import {
  Map,
  Popup,
  MapMouseEvent,
  EventData,
  LngLatBounds,
  GeoJSONSource,
} from 'mapbox-gl';

import WebMap, {
  MvtAdapterOptions,
  VectorLayerAdapter,
  PropertiesFilter,
} from '@nextgis/webmap';
import { Feature, FeatureCollection, Point, Polygon } from 'geojson';

type UsedMapEvents = 'click' | 'mouseenter' | 'mouseleave';
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
  selectOnLayerClick?: boolean;
  oldNgwMvtApi?: boolean;
  addLayers: (
    url: string,
    id: string
  ) => Promise<TimeLayer>[] | Promise<Promise<TimeLayer>[]>;
  setUrl?: (opt: { baseUrl: string; resourceId: string }) => string;
  getFillColor?: (...args: any[]) => any;
  createPopupContent?: (props: any) => HTMLElement | undefined;
  setFilter?: (properties: PropertiesFilter, id?: number | string) => void;
  removeFilter?: (id?: number | string) => void;
}

export class TimeLayersGroup {
  name: string;
  currentLayerId!: string;
  opacity = 0.8;
  order?: number;
  pointFitMaxZoom = 7;
  polygonFitMaxZoom = 12;

  private _filter?: PropertiesFilter;
  private _visible = true;
  private _popup?: Popup;
  private _timeLayers: { [layerId: string]: TimeLayer[] } = {};
  private _layersLoaded: { [layerId: string]: boolean } = {};
  private _onDataLoadEvents: Array<() => void> = [];
  private _onLayerClickMem: {
    [layerId: string]: {
      [ev in UsedMapEvents]?: (ev: MapMouseEvent & EventData) => void;
    };
  } = {};

  constructor(
    private webMap: WebMap<Map, TLayer>,
    public options: TimeLayersGroupOptions
  ) {
    this.name = this.options.name;
    this._visible = this.options.visible ?? true;
    // @ts-ignore TODO: update webmap version
    options.order = options.order ?? this.webMap.reserveOrder();
    this.order = options.order;
    if (options.opacity !== undefined) {
      this.opacity = options.opacity;
    }
    if (this._isWaitDataLoadedGroup()) {
      webMap.mapAdapter.emitter.on('data-loaded', (data) => this._onData(data));
      webMap.mapAdapter.emitter.on('data-error', (data) => this._onData(data));
    }
  }

  hide() {
    if (this._visible) {
      Object.keys(this._timeLayers).forEach((x) => this._hideLayer(x));
      this._visible = false;
    }
  }

  show() {
    if (!this._visible) {
      this._visible = true;
      this._showLayer(this.currentLayerId);
    }
  }

  updateLayer(layerId: string) {
    const fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    return this.switchLayer(fromId, layerId);
  }

  updateLayersColor() {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      if (this.options.getFillColor) {
        const fillColorDarken = this.options.getFillColor({ darken: 0.5 });
        const fillColor = this.options.getFillColor();
        for (const l in this._layersLoaded) {
          if (l.indexOf('-bound') !== -1) {
            map.setPaintProperty(l, 'line-color', fillColorDarken);
          } else {
            map.setPaintProperty(l, 'fill-color', fillColor);
          }
        }
      }
    }
  }

  pushDataLoadEvent(event: (...args: any[]) => void) {
    this._onDataLoadEvents.push(event);
  }

  fitToFilter(filter: any[], timeLayer: TimeLayer) {
    const map = this.webMap.mapAdapter.map;
    if (map && typeof timeLayer.source === 'string') {
      const isNgwGeoJson = timeLayer.source.startsWith('ngw:');
      let features: Feature[] = [];
      if (isNgwGeoJson) {
        // const layers = timeLayer.getLayers();
        // features = layers.map(x => x.feature) as Feature[];
        const source = map.getSource(timeLayer.source) as GeoJSONSource;
        const featureCollection: FeatureCollection =
          // @ts-ignore
          source._data as FeatureCollection;
        const filterIdField = this.options.filterIdField || 'id';
        features = featureCollection.features.filter((x) => {
          const ids: number[] = [].concat(filter[2]);
          return (
            x.properties && ids.indexOf(x.properties[filterIdField]) !== -1
          );
        });
        // features = map.querySourceFeatures(timeLayer.source, {
        //   filter
        // });
      } else {
        const sourceLayer: string | undefined =
          'ngw:' + (timeLayer.options.name || timeLayer.id);
        const source: string | undefined = timeLayer.source;
        features = map.querySourceFeatures(source, {
          filter,
          sourceLayer,
        });
      }
      if (features && features.length) {
        this._fitToFeatures(features);
        return features;
      }
    }
  }

  showOnlyCurrentLayer() {
    this.hideNotCurrentLayers();
    this.makeOpacity();
  }

  switchLayer(fromId: string, toId: string) {
    const promise = new Promise((resolve, reject) => {
      this._removePopup();
      this._cleanDataLoadEvents();
      if (toId && fromId !== toId) {
        this.pushDataLoadEvent(resolve);
        this._showLayer(toId)
          .then((id_) => {
            if (id_ === this.currentLayerId) {
              this._addLayerListeners(id_);
              // do not hide unloaded layer if it first
              if (fromId) {
                this._removeLayerListeners(fromId);
                this._setLayerOpacity(id_, 0);
              }
              if (!this._isWaitDataLoadedGroup()) {
                this._onSourceIsLoaded();
              }
            }
            resolve();
          })
          .catch((er) => {
            reject(er);
          });
      } else {
        resolve();
      }
    });
    return promise.then(() => {
      return toId;
    });
  }

  hideLayer(layerId: string) {
    this._hideLayer(layerId);
  }

  getTimeLayer(layerId?: string) {
    layerId = layerId !== undefined ? layerId : this.currentLayerId;
    return this._timeLayers[layerId];
  }

  forEachTimeLayer(layerId: string, fun: (timeLayer: TimeLayer) => void) {
    const timeLayer = this._timeLayers[layerId];
    if (timeLayer) {
      timeLayer.forEach((x) => fun(x));
    }
  }

  selectLayerFeature(feature: Feature, adapterId: string) {
    const prop = feature.properties;
    if (prop && this.options.filterIdField) {
      const filterIdField = this.options.filterIdField;
      const fid = prop[filterIdField];
      const adapter = this._getWebMapLayer(adapterId);
      if (adapter && adapter.select) {
        adapter.select([[filterIdField, 'eq', Number(fid)]]);
        // urlParams.set('id', String(fid));
      }
    }
  }

  select(fids: string, id?: string, fit = false) {
    id = id ?? this.currentLayerId;
    // const idsParam = urlParams.get('id') as string;
    const ids: number[] = fids.split(',').map((x) => Number(x));
    const layers = this._timeLayers[id];
    const filterIdField = this.options.filterIdField;
    const mapLayers: TimeLayer[] = [];
    layers.forEach((x) => {
      const mapLayer = x && x.layer && x.layer[0];
      if (ids && mapLayer && filterIdField) {
        if (x && x.select) {
          x.select([[filterIdField, 'in', ids]]);
          mapLayers.push(x);
        }
      }
    });
    if (fit) {
      for (const timeLayer of mapLayers) {
        const features = this.fitToFilter(
          ['in', filterIdField, ...ids],
          timeLayer
        );
        if (features && features.length) {
          return features;
        }
      }
    }
  }

  setFilter(filter: PropertiesFilter) {
    if (filter && filter.length) {
      this._filter = filter;
    } else {
      this._filter = undefined;
    }
    if (this.options.setFilter) {
      this.options.setFilter(this._filter || [], this.currentLayerId);
    } else {
      this._updateFilter();
    }
  }

  private _cleanDataLoadEvents() {
    this._onDataLoadEvents = [];
  }

  private makeOpacity() {
    this._setLayerOpacity(this.currentLayerId, this.opacity);
  }

  private hideNotCurrentLayers() {
    Object.keys(this._timeLayers).forEach((id) => {
      if (id !== this.currentLayerId) {
        this._hideLayer(id);
      }
    });
  }

  private _getWebMapLayerId(id?: string) {
    return String(id);
  }

  private _getWebMapLayer(id: string): VectorLayerAdapter {
    return this.webMap.getLayer(
      this._getWebMapLayerId(id)
    ) as VectorLayerAdapter;
  }

  private _isWaitDataLoadedGroup() {
    return this.options.dataLoaded !== undefined
      ? this.options.dataLoaded
      : true;
  }

  private _setLayerOpacity(id: string, value: number) {
    const dataLoaded = this._isWaitDataLoadedGroup();
    this.forEachTimeLayer(id, (dataLayerId) => {
      if (dataLoaded) {
        return this.webMap.setLayerOpacity(dataLayerId, value);
      } else {
        if (value === 0) {
          return this.webMap.hideLayer(dataLayerId);
        } else {
          return this.webMap.showLayer(dataLayerId);
        }
      }
    });
  }

  private _removePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = undefined;
    }
  }

  private _isCurrentDataLayer(layerId: string): boolean {
    const currentLayers = this._timeLayers[this.currentLayerId];
    return currentLayers
      ? currentLayers.some((x) => {
          return (
            x.id === layerId ||
            x.options.name === layerId ||
            (x.layer && x.layer.some((y) => y === layerId))
          );
        })
      : false;
  }

  private _getLayerIdFromSource(target: string) {
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

  private _onData(data: { target: string }) {
    const layerId = this._getLayerIdFromSource(data.target);
    if (layerId) {
      const loadedYet = this._layersLoaded[layerId];
      const isCurrentLayer = this._isCurrentDataLayer(layerId);
      const isHistoryLayer = this._isHistoryLayer(layerId);
      if (!loadedYet && isHistoryLayer && isCurrentLayer) {
        this._layersLoaded[layerId] = true;
        this._onSourceIsLoaded();
      }
    }
  }

  private _onLayerClick(
    e: MapMouseEvent & EventData,
    layerId: string,
    adapterId: string
  ) {
    const map = this.webMap.mapAdapter.map;
    const point = e.point;
    const width = 5;
    const height = 5;
    // Find all features within a bounding box around a point
    if (map) {
      const features = map.queryRenderedFeatures(
        [
          [point.x - width / 2, point.y - height / 2],
          [point.x + width / 2, point.y + height / 2],
        ],
        { layers: [layerId] }
      );
      const feature = features[0];
      const prop = feature.properties;
      if (this.options.createPopupContent) {
        const html = this.options.createPopupContent(prop);
        if (html) {
          this._removePopup();
          this._popup = new Popup()
            .setLngLat(e.lngLat)
            .setDOMContent(html)
            .addTo(map);
        }
      }
      const selectOnLayerClick = this.options.selectOnLayerClick ?? true;
      if (selectOnLayerClick) {
        this.selectLayerFeature(feature, adapterId);
      }
    }
  }

  private _removeLayerListeners(layerId: string) {
    const map = this.webMap.mapAdapter.map;
    // map.off('click', layerId);

    const memEvents = this._onLayerClickMem[layerId];
    if (memEvents && map) {
      for (const ev in memEvents) {
        const memEvent = memEvents[ev as UsedMapEvents];
        if (memEvent) {
          map.off(ev, memEvent);
        }
      }
    }
    this._removePopup();
  }

  private _addLayerListeners(id: string) {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      this._forEachDataLayer(id, (layerId) => {
        const layerClickBind = (ev: MapMouseEvent & EventData) =>
          this._onLayerClick(ev, layerId, id);
        const layerMouseEnterBind = () =>
          (map.getCanvas().style.cursor = 'pointer');
        const layerMouseLeaveBind = () => (map.getCanvas().style.cursor = '');

        map.on('click', layerId, layerClickBind);
        // Change the cursor to a pointer when the mouse is over the places layer.
        map.on('mouseenter', layerId, layerMouseEnterBind);
        // Change it back to a pointer when it leaves.
        map.on('mouseleave', layerId, layerMouseLeaveBind);

        this._onLayerClickMem[layerId] = this._onLayerClickMem[layerId] || {};

        this._onLayerClickMem[layerId].click = layerClickBind;
        this._onLayerClickMem[layerId].mouseenter = layerClickBind;
        this._onLayerClickMem[layerId].mouseleave = layerClickBind;
      });
    }
  }

  private _isHistoryLayer(layerId: string) {
    return !this.webMap.isBaseLayer(layerId);
  }

  private _isAllDataLayerLoaded(layer: string) {
    if (this._isWaitDataLoadedGroup()) {
      const timeLayer = this._timeLayers[layer];
      if (timeLayer) {
        return timeLayer.every((x) => {
          return (
            x.id === layer ||
            x.options.name === layer ||
            (x.layer && x.layer.some((y) => this._layersLoaded[y]))
          );
        });
      }
    } else {
      return true;
    }
  }

  private _forEachDataLayer(
    layerId: string,
    fun: (dataLayerId: string) => void
  ) {
    this.forEachTimeLayer(
      layerId,
      (timeLayer) => timeLayer.layer && timeLayer.layer.forEach((y) => fun(y))
    );
  }

  private _onSourceIsLoaded() {
    if (this._isAllDataLayerLoaded(this.currentLayerId)) {
      if (!this.options.manualOpacity) {
        this.showOnlyCurrentLayer();
      }
      this._executeDataLoadEvents();
    }
  }

  private _executeDataLoadEvents() {
    for (let fry = 0; fry < this._onDataLoadEvents.length; fry++) {
      const event = this._onDataLoadEvents[fry];
      event();
    }
    this._onDataLoadEvents = [];
  }

  private async _addLayer(url: string, id: string): Promise<TimeLayer[]> {
    const layers = await this.options.addLayers(url, id);
    this._timeLayers[id] = [];
    for (const l of layers) {
      const layer = await l;
      this._timeLayers[id].push(layer);
    }
    return this._timeLayers[id];
  }

  private _toggleLayer(id: string, status: boolean) {
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
    }
  }

  private _hideLayer(layerId: string) {
    this._toggleLayer(layerId, false);
  }

  private _showLayer(id: string): Promise<string> {
    if (this._visible) {
      const toggle = () => {
        this.forEachTimeLayer(id, (l) => this.webMap.toggleLayer(l, true));
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
          ? this.options.baseUrl + '/api/resource/' + id + '/{z}/{x}/{y}.mvt'
          : this.newNgwMvtUrl({
              baseUrl: this.options.baseUrl,
              resourceId: id,
            });

        return this._addLayer(url, id).then(() => {
          return toggle();
        });
      } else {
        return Promise.resolve(toggle());
      }
    }
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this._executeDataLoadEvents();
        resolve(id);
      }, 0);
    });
  }

  private newNgwMvtUrl(opt: { baseUrl: string; resourceId: string }) {
    return (
      opt.baseUrl +
      '/api/component/feature_layer/mvt?x={x}&y={y}&z={z}&' +
      'resource=' +
      opt.resourceId
    );
  }

  private _fitToFeatures(features: Feature[]) {
    const bounds = new LngLatBounds();
    const types: string[] = [];
    const extendCoords = (coords: any[]) => {
      if (coords.length === 2) {
        try {
          // @ts-ignore
          bounds.extend(coords);
        } catch (er) {
          // ignore
        }
      } else {
        coords.forEach((c) => {
          extendCoords(c);
        });
      }
    };

    features.forEach((feature) => {
      const geometry: Polygon | Point = feature.geometry as Polygon | Point;
      extendCoords(geometry.coordinates);
      types.push(feature.geometry.type);
    });
    if (this.webMap.mapAdapter.map) {
      const onlyPoint = types.every((x) => x === 'Point');
      this.webMap.mapAdapter.map.fitBounds(bounds, {
        padding: 20,
        maxZoom: onlyPoint ? this.pointFitMaxZoom : this.polygonFitMaxZoom,
      });
    }
  }

  private _updateFilter() {
    const layers = this._timeLayers[this.currentLayerId];
    const filterIdField = this.options.filterIdField;
    layers.forEach((x) => {
      if (filterIdField) {
        if (x && x.propertiesFilter) {
          x.propertiesFilter(this._filter || []);
        }
      }
    });
  }
}
