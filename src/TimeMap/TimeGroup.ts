import { LngLatBounds } from 'maplibre-gl';

import type { PropertiesFilter } from '@nextgis/properties-filter';
import type {
  MvtAdapterOptions,
  VectorLayerAdapter,
  WebMap,
} from '@nextgis/webmap';
import type {
  Feature,
  FeatureCollection,
  Point,
  Polygon,
  Position,
} from 'geojson';
import type { GeoJSONSource, LngLatLike, Map } from 'maplibre-gl';

type TLayer = string[];
export type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

export interface TimeLayersGroupOptions {
  name: string;
  baseUrl: string;
  filterIdField?: string;
  manualOpacity?: boolean;
  opacity?: number;
  order?: number;
  dataLoaded?: boolean;
  visible?: boolean;
  oldNgwMvtApi?: boolean;
  addLayers: (
    url: string,
    id: string,
  ) => Promise<TimeLayer>[] | Promise<Promise<TimeLayer>[]> | undefined;
  setUrl?: (opt: { baseUrl: string; resourceId: string }) => string;
  getFillColor?: (...args: any[]) => any;
  setFilter?: (properties: PropertiesFilter, id?: number | string) => void;
}

export class TimeLayersGroup {
  name: string;
  currentLayerId?: string;
  beforeLayerId?: string;
  opacity = 0.8;
  order?: number;
  pointFitMaxZoom = 7;
  polygonFitMaxZoom = 12;

  private _filter?: PropertiesFilter;
  private _visible: boolean;

  private _timeLayers: Record<string, TimeLayer[]> = {};
  private _layersLoaded: Record<string, boolean> = {};
  private _onDataLoadEvents: (() => void)[] = [];

  constructor(
    private webMap: WebMap<Map, TLayer>,
    public options: TimeLayersGroupOptions,
  ) {
    this.name = options.name;
    this._visible = options.visible ?? true;
    this.order = options.order ?? this.webMap.reserveOrder();
    this.opacity = options.opacity ?? this.opacity;

    if (this._isWaitDataLoadedGroup()) {
      webMap.mapAdapter.emitter.on('data-loaded', this._onData.bind(this));
      webMap.mapAdapter.emitter.on('data-error', this._onData.bind(this));
    }
  }

  hide(): void {
    if (this._visible) {
      Object.keys(this._timeLayers).forEach((layerId) =>
        this._hideLayer(layerId),
      );
      this._visible = false;
    }
  }

  show(): void {
    if (!this._visible && this.currentLayerId) {
      this._visible = true;
      this._showLayer(this.currentLayerId);
    }
  }

  updateLayer(layerId: string): Promise<string> {
    this.beforeLayerId = this.currentLayerId;
    this.currentLayerId = layerId;
    return this.switchLayer(this.beforeLayerId || '', layerId);
  }

  updateLayersColor(): void {
    const map = this.webMap.mapAdapter.map;
    if (map && this.options.getFillColor) {
      const fillColorDarken = this.options.getFillColor({ darken: 0.5 });
      const fillColor = this.options.getFillColor();
      Object.keys(this._layersLoaded).forEach((layerId) => {
        const color = layerId.includes('-bound') ? fillColorDarken : fillColor;
        map.setPaintProperty(layerId, 'fill-color', color);
      });
    }
  }

  pushDataLoadEvent(event: (...args: any[]) => void): void {
    this._onDataLoadEvents.push(event);
  }

  fitToFilter(filter: any, timeLayer: TimeLayer): Feature[] | undefined {
    const map = this.webMap.mapAdapter.map;
    if (map && typeof timeLayer.source === 'string') {
      let features: Feature[] = [];
      if (timeLayer.source.startsWith('ngw:')) {
        const source = map.getSource(timeLayer.source) as GeoJSONSource;
        const featureCollection = source._data as FeatureCollection;
        const filterIdField = this.options.filterIdField || 'id';
        features = featureCollection.features.filter((feature) => {
          const ids: number[] = [].concat(filter[2]);
          return (
            feature.properties &&
            ids.includes(feature.properties[filterIdField])
          );
        });
      } else {
        const sourceLayer = 'ngw:' + (timeLayer.options.name || timeLayer.id);
        features = map.querySourceFeatures(timeLayer.source, {
          filter,
          sourceLayer,
        });
      }

      if (features.length) {
        this._fitToFeatures(features);
        return features;
      }
    }
  }

  showOnlyCurrentLayer(): void {
    this.hideNotCurrentLayers();
    this.makeOpacity();
  }

  clean(): void {
    this._cleanDataLoadEvents();
    if (this.currentLayerId) {
      this._hideLayer(this.currentLayerId);
    }
    this.currentLayerId = undefined;
  }

  switchLayer(fromId: string, toId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._cleanDataLoadEvents();

      if (toId && fromId !== toId) {
        this.pushDataLoadEvent(resolve);
        this._showLayer(toId)
          .then((id_) => {
            if (id_ === this.currentLayerId) {
              // Do not hide unloaded layer if it first
              if (fromId) {
                // Not all tiles for this layer is loaded, hide until full loading
                this._setLayerOpacity(id_, 0);
              }
              if (!this._isWaitDataLoadedGroup()) {
                this._onSourceIsLoaded();
              }
            } else {
              reject('Not current id');
            }
          })
          .catch(reject);
      } else {
        resolve('');
      }
    }).then(() => toId);
  }

  hideLayer(layerId: string): void {
    this._hideLayer(layerId);
  }

  getTimeLayer(layerId?: string): TimeLayer[] | undefined {
    layerId = layerId !== undefined ? layerId : this.currentLayerId;
    if (layerId) {
      return this._timeLayers[layerId];
    }
  }

  forEachTimeLayer(
    layerId: string,
    callback: (timeLayer: TimeLayer) => void,
  ): void {
    const timeLayer = this._timeLayers[layerId];
    if (timeLayer) {
      timeLayer.forEach(callback);
    }
  }

  selectLayerFeature(feature: Feature, adapterId: string): void {
    const prop = feature.properties;
    if (prop && this.options.filterIdField) {
      const filterIdField = this.options.filterIdField;
      const fid = prop[filterIdField];
      const adapter = this._getWebMapLayer(adapterId);
      if (adapter?.select) {
        adapter.select([[filterIdField, 'eq', Number(fid)]]);
      }
    }
  }

  unselect() {
    for (const layers of Object.values(this._timeLayers)) {
      layers.filter((x) => {
        return x.unselect && x.unselect();
      });
    }
  }

  select(fids: string, id?: string, fit = false): Feature[] | undefined {
    id = id ?? this.currentLayerId;
    if (id) {
      const ids = fids.split(',').map(Number);
      const layers = this._timeLayers[id];
      const filterIdField = this.options.filterIdField;

      const mapLayers = layers.filter((x) => {
        const mapLayer = x?.layer?.[0];
        return (
          mapLayer &&
          filterIdField &&
          x.select &&
          x.select([[filterIdField, 'in', ids]])
        );
      });

      if (fit) {
        for (const timeLayer of mapLayers) {
          const features = this.fitToFilter(
            ['in', filterIdField, ...ids],
            timeLayer,
          );
          if (features?.length) {
            return features;
          }
        }
      }
    }
  }

  setFilter(filter: PropertiesFilter): void {
    this._filter = filter?.length ? filter : undefined;
    if (this.options.setFilter) {
      this.options.setFilter(this._filter || [], this.currentLayerId);
    } else {
      this._updateFilter();
    }
  }

  hideNotCurrentLayers(): void {
    Object.keys(this._timeLayers).forEach((layerId) => {
      if (layerId !== this.currentLayerId) {
        this._hideLayer(layerId);
      }
    });
  }

  private _cleanDataLoadEvents(): void {
    this._onDataLoadEvents = [];
  }

  private makeOpacity(): void {
    if (this.currentLayerId) {
      this._setLayerOpacity(this.currentLayerId, this.opacity);
    }
  }

  private _getWebMapLayerId(id?: string): string {
    return String(id);
  }

  private _getWebMapLayer(id: string): VectorLayerAdapter {
    return this.webMap.getLayer(
      this._getWebMapLayerId(id),
    ) as VectorLayerAdapter;
  }

  private _isWaitDataLoadedGroup(): boolean {
    return this.options.dataLoaded !== undefined
      ? this.options.dataLoaded
      : true;
  }

  private _setLayerOpacity(id: string, value: number): void {
    const dataLoaded = this._isWaitDataLoadedGroup();
    this.forEachTimeLayer(id, (dataLayerId) => {
      if (dataLoaded) {
        this.webMap.setLayerOpacity(dataLayerId, value);
      } else {
        value === 0
          ? this.webMap.hideLayer(dataLayerId)
          : this.webMap.showLayer(dataLayerId);
      }
    });
  }

  private _isCurrentDataLayer(layerId: string): boolean {
    const currentLayers =
      this.currentLayerId && this._timeLayers[this.currentLayerId];
    return currentLayers
      ? currentLayers.some(
          (x) =>
            x.id === layerId ||
            x.options.name === layerId ||
            x.layer?.includes(layerId),
        )
      : false;
  }

  private _getLayerIdFromSource(target: string): string | undefined {
    if (this._timeLayers[target]) {
      return target;
    }
    for (const t in this._timeLayers) {
      const timeLayerList = this._timeLayers[t];
      const adapter = timeLayerList.find((x) => {
        return (
          (x.source && x.source === target) ||
          (x.options && x.options.url && x.options.url === target)
        );
      });
      if (adapter) {
        return adapter.id;
      }
    }
  }

  private _onData(data: { target: string }): void {
    const layerId = this._getLayerIdFromSource(data.target);
    if (
      layerId &&
      !this._layersLoaded[layerId] &&
      this._isHistoryLayer(layerId) &&
      this._isCurrentDataLayer(layerId)
    ) {
      this._layersLoaded[layerId] = true;
      this._onSourceIsLoaded();
    }
  }

  private _isHistoryLayer(layerId: string): boolean {
    return !this.webMap.isBaseLayer(layerId);
  }

  private _isAllDataLayerLoaded(layer: string): boolean {
    if (this._isWaitDataLoadedGroup()) {
      const timeLayer = this._timeLayers[layer];
      return timeLayer
        ? timeLayer.every(
            (x) =>
              x.id === layer ||
              x.options.name === layer ||
              x.layer?.some((y) => this._layersLoaded[y]),
          )
        : false;
    } else {
      return true;
    }
  }

  private _forEachDataLayer(
    layerId: string,
    fun: (dataLayerId: string) => void,
  ): void {
    this.forEachTimeLayer(layerId, (timeLayer) => {
      timeLayer.layer?.forEach(fun);
    });
  }

  private _onSourceIsLoaded(): void {
    if (
      this.currentLayerId &&
      this._isAllDataLayerLoaded(this.currentLayerId)
    ) {
      if (!this.options.manualOpacity) {
        this.showOnlyCurrentLayer();
      }
      this._executeDataLoadEvents();
    }
  }

  private _executeDataLoadEvents(): void {
    this._onDataLoadEvents.forEach((event) => event());
    this._onDataLoadEvents = [];
  }

  private async _addLayer(
    url: string,
    id: string,
  ): Promise<TimeLayer[] | undefined> {
    const layers = await this.options.addLayers(url, id);
    if (layers) {
      this._timeLayers[id] = [];
      for (const layer of layers) {
        this._timeLayers[id].push(await layer);
      }
      return this._timeLayers[id];
    }
  }

  private _toggleLayer(id: string, status: boolean): void {
    this._forEachDataLayer(id, (l) => {
      this._layersLoaded[l] = false;
    });
    this._layersLoaded[id] = false;
    if (status) {
      this._showLayer(id);
    } else {
      this.forEachTimeLayer(id, (l) => {
        this.webMap.removeLayer(l);
      });
      this._timeLayers[id] = [];
    }
  }

  private _hideLayer(layerId: string): void {
    this._toggleLayer(layerId, false);
  }

  private async _showLayer(id: string): Promise<string> {
    if (this._visible) {
      const toggle = () => {
        this.forEachTimeLayer(id, (l) => {
          this.webMap.toggleLayer(l, true);
        });
        return id;
      };

      const exist = this._getWebMapLayer(id);
      if (!exist) {
        const url = this.options.setUrl
          ? this.options.setUrl({
              baseUrl: this.options.baseUrl,
              resourceId: id,
            })
          : this.options.oldNgwMvtApi
            ? `${this.options.baseUrl}/api/resource/${id}/{z}/{x}/{y}.mvt`
            : this.newNgwMvtUrl({
                baseUrl: this.options.baseUrl,
                resourceId: id,
              });

        await this._addLayer(url, id);
        return toggle();
      } else {
        return toggle();
      }
    }
    return new Promise((resolve) => {
      setTimeout(() => {
        this._executeDataLoadEvents();
        resolve(id);
      }, 0);
    });
  }

  private newNgwMvtUrl(opt: { baseUrl: string; resourceId: string }): string {
    return `${opt.baseUrl}/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&resource=${opt.resourceId}`;
  }

  private _fitToFeatures(features: Feature[]): void {
    const bounds = new LngLatBounds();
    const types: string[] = [];
    const extendCoords = (coords: unknown[]) => {
      if (coords.length === 2) {
        bounds.extend(coords as LngLatLike);
      } else {
        (coords as Position[][]).forEach(extendCoords);
      }
    };

    features.forEach((feature) => {
      extendCoords((feature.geometry as Polygon | Point).coordinates);
      types.push(feature.geometry.type);
    });

    if (this.webMap.mapAdapter.map) {
      const onlyPoint = types.every((type) => type === 'Point');
      this.webMap.mapAdapter.map.fitBounds(bounds, {
        padding: 20,
        maxZoom: onlyPoint ? this.pointFitMaxZoom : this.polygonFitMaxZoom,
      });
    }
  }

  private _updateFilter(): void {
    if (this.currentLayerId) {
      const layers = this._timeLayers[this.currentLayerId];
      const filterIdField = this.options.filterIdField;
      layers.forEach((x) => {
        if (filterIdField && x?.propertiesFilter) {
          x.propertiesFilter(this._filter || []);
        }
      });
    }
  }
}
