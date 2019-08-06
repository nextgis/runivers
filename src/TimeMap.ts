import WebMap, { MvtAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';
import { Map, Popup, MapMouseEvent, EventData, MapboxGeoJSONFeature, LngLatBounds } from 'mapbox-gl';
import { urlParams } from './App';
import { filter } from 'minimatch';

type UsedMapEvents = 'click' | 'mouseenter' | 'mouseleave';
type TLayer = string[];
export type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

export interface TimeMapOptions {
  baseUrl: string;
  filterIdField?: string;
  getFillColor: (...args: any[]) => any;
  createPopupContent: (props: any) => HTMLElement;
  addLayers: (url: string, id: string) => Array<Promise<TimeLayer>>;
}

export class TimeMap {
  currentLayerId!: string;
  opacity = 0.8;
  private _popup?: Popup;
  private _timeLayers: { [layerId: string]: TimeLayer[] } = {};
  private _layersLoaded: { [layerId: string]: boolean } = {};
  private _onDataLoadEvents: Array<() => void> = [];
  private _onLayerClickMem: {
    [layerId: string]: {
      [ev in UsedMapEvents]?: (ev: MapMouseEvent & EventData) => void;
    };
  } = {};

  constructor(private webMap: WebMap<Map, TLayer>, private options: TimeMapOptions) {
    webMap.mapAdapter.emitter.on('data-loaded', data => this._onData(data));
    webMap.mapAdapter.emitter.on('data-error', data => this._onData(data));
  }

  updateLayer(layerId: string) {
    const fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    this.switchLayer(fromId, layerId);
  }

  updateLayersColor() {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      for (const l in this._layersLoaded) {
        if (l.indexOf('-bound') !== -1) {
          map.setPaintProperty(l, 'line-color', this.options.getFillColor({ darken: 0.5 }));
        } else {
          map.setPaintProperty(l, 'fill-color', this.options.getFillColor());
        }
      }
    }
  }

  pushDataLoadEvent(event: (...args: any[]) => void) {
    this._onDataLoadEvents.push(event);
  }

  fitToFilter(filter: any[], sourceLayer: string, sourceId: string) {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      const features = map.querySourceFeatures(sourceId, { filter, sourceLayer });
      this._fitToFeatures(features);
    }
  }

  async switchLayer(fromId: string, toId: string) {
    if (fromId) {
      urlParams.remove('id');
    }
    this._removePopup();
    if (toId && fromId !== toId) {
      await this._showLayer(toId);
      this._addLayerListeners(toId);
      // do not hide unloaded layer if it first
      if (fromId) {
        this._removeLayerListeners(fromId);
        this._setLayerOpacity(toId, 0);
      }
    }
  }

  private _setLayerOpacity(id: string, value: number) {
    this._forEachTimeLayer(id, dataLayerId => {
      return this.webMap.setLayerOpacity(dataLayerId, value);
    });
  }

  private _removePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = undefined;
    }
  }

  private _isCurrentDataLayer(layerId: string) {
    const currentLayers = this._timeLayers[this.currentLayerId];
    return currentLayers.some(x => {
      return x.layer && x.layer.some(y => y === layerId);
    });
  }

  private _onData(data: { target: string }) {
    const layerId = data.target;
    const loadedYet = this._layersLoaded[layerId];
    const isCurrentLayer = this._isCurrentDataLayer(data.target);
    if (!loadedYet && this._isHistoryLayer(data.target) && isCurrentLayer) {
      this._layersLoaded[layerId] = true;
      this._onSourceIsLoaded();
    }
  }

  private _onLayerClick(e: MapMouseEvent & EventData, layerId: string, adapterId: string) {
    const map = this.webMap.mapAdapter.map;
    const point = e.point;
    const width = 5;
    const height = 5;
    // Find all features within a bounding box around a point
    if (map) {
      const features = map.queryRenderedFeatures(
        [[point.x - width / 2, point.y - height / 2], [point.x + width / 2, point.y + height / 2]],
        { layers: [layerId] }
      );
      const feature = features[0];
      const prop = feature.properties;
      if (prop && prop.status && prop.status < 6) {
        const html = this.options.createPopupContent(prop);
        this._removePopup();
        this._popup = new Popup()
          .setLngLat(e.lngLat)
          .setDOMContent(html)
          .addTo(map);
      }
      if (prop && this.options.filterIdField) {
        const fid = prop[this.options.filterIdField];
        const adapter = this.webMap.getLayer(adapterId) as VectorLayerAdapter;
        if (adapter.select) {
          adapter.select([[this.options.filterIdField, 'eq', Number(fid)]]);
          // urlParams.set('id', String(fid));
        }
      }
    }
  }

  private _removeLayerListeners(layerId: string) {
    const map = this.webMap.mapAdapter.map;
    // map.off('click', layerId);

    const memEvents = this._onLayerClickMem[layerId];
    if (memEvents && map) {
      for (const ev in memEvents) {
        // @ts-ignore
        const memEvent = memEvents[ev];
        map.off(ev, memEvent);
      }
    }
    this._removePopup();
  }

  private _addLayerListeners(id: string) {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      this._forEachDataLayer(id, layerId => {
        const layerClickBind = (ev: MapMouseEvent & EventData) => this._onLayerClick(ev, layerId, id);
        const layerMouseEnterBind = () => (map.getCanvas().style.cursor = 'pointer');
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
    const timeLayer = this._timeLayers[layer];
    if (timeLayer) {
      return timeLayer.every(x => x.layer && x.layer.some(y => this._layersLoaded[y]));
    }
  }

  private _forEachTimeLayer(layerId: string, fun: (timeLayer: TimeLayer) => void) {
    const timeLayer = this._timeLayers[layerId];
    if (timeLayer) {
      timeLayer.forEach(x => fun(x));
    }
  }

  private _forEachDataLayer(layerId: string, fun: (dataLayerId: string) => void) {
    this._forEachTimeLayer(layerId, timeLayer => timeLayer.layer && timeLayer.layer.forEach(y => fun(y)));
  }

  private _onSourceIsLoaded() {
    if (this._isAllDataLayerLoaded(this.currentLayerId)) {
      this._setLayerOpacity(this.currentLayerId, this.opacity);
      this._hideNotCurrentLayers();
      for (let fry = 0; fry < this._onDataLoadEvents.length; fry++) {
        const event = this._onDataLoadEvents[fry];
        event();
      }
      this._onDataLoadEvents = [];
    }
  }

  private _hideNotCurrentLayers() {
    const layers = this.webMap.getLayers();
    layers.forEach(l => {
      if (!this.webMap.isBaseLayer(l)) {
        if (this.webMap.isLayerVisible(l)) {
          const currentLayers = this._timeLayers[this.currentLayerId];
          const isSkipLayer = currentLayers.some(x => x.id === l);
          if (!isSkipLayer) {
            this._hideLayer(l);
          }
        }
      }
    });
  }

  private async _addLayer(url: string, id: string): Promise<TimeLayer[]> {
    const layers = this.options.addLayers(url, id);
    this._timeLayers[id] = [];
    let fillLayer: TimeLayer | undefined;
    for (const l of layers) {
      const layer = await l;
      if (!fillLayer) {
        fillLayer = layer;
      }
      this._timeLayers[id].push(layer);
    }
    const idsParam = urlParams.get('id') as string;
    const ids = idsParam && idsParam.split(',').map(x => Number(x));
    const firstFillLayer = fillLayer && fillLayer.layer && fillLayer.layer[0];
    const filterIdField = this.options.filterIdField;
    if (ids && firstFillLayer && filterIdField) {
      this._onDataLoadEvents.push(() => {
        if (fillLayer && fillLayer.select) {
          fillLayer.select([[filterIdField, 'in', ids]]);
        }
        this.fitToFilter(['in', filterIdField, ...ids], id, firstFillLayer);
      });
    }
    return this._timeLayers[id];
  }

  private _toggleLayer(id: string, status: boolean) {
    this._forEachDataLayer(id, l => {
      this._layersLoaded[l] = false;
    });
    if (status) {
      this._showLayer(id);
    } else {
      this._forEachTimeLayer(id, l => this.webMap.removeLayer(l));
    }
  }

  private _hideLayer(layerId: string) {
    this._toggleLayer(layerId, false);
  }

  private _showLayer(id: string): Promise<any> {
    const toggle = () => {
      this._forEachTimeLayer(id, l => this.webMap.toggleLayer(l, true));
    };

    const exist = this.webMap.getLayer(id);
    if (!exist) {
      const url = this.options.baseUrl + '/api/resource/' + id + '/{z}/{x}/{y}.mvt';
      return this._addLayer(url, id).then(() => {
        return toggle();
      });
    } else {
      return Promise.resolve(toggle());
    }
  }

  private _fitToFeatures(features: MapboxGeoJSONFeature[]) {
    const bounds = new LngLatBounds();

    const extendCoords = (coords: any[]) => {
      if (coords.length === 2) {
        // @ts-ignore
        bounds.extend(coords);
      } else {
        coords.forEach(c => {
          extendCoords(c);
        });
      }
    };

    features.forEach(feature => {
      // @ts-ignore
      extendCoords(feature.geometry.coordinates);
    });
    if (this.webMap.mapAdapter.map) {
      this.webMap.mapAdapter.map.fitBounds(bounds, {
        padding: 20
      });
    }
  }
}
