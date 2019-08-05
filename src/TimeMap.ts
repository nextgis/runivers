import WebMap, { MvtAdapterOptions, VectorLayerAdapter } from '@nextgis/webmap';
import { Map, Popup, MapMouseEvent, EventData } from 'mapbox-gl';

type UsedMapEvents = 'click' | 'mouseenter' | 'mouseleave';
type TLayer = string[];
type TimeLayer = VectorLayerAdapter<Map, TLayer, MvtAdapterOptions>;

export interface TimeMapOptions {
  baseUrl: string;
  getFillColor: (...args: any[]) => any;
  createPopupContent: (props: any) => HTMLElement;
}

export class TimeMap {
  currentLayerId!: string;
  private _opacity = 0.8;
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

  async switchLayer(fromId: string, toId: string) {
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

  private _onLayerClick(e: MapMouseEvent & EventData, layerId: string) {
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

  private _addLayerListeners(layerId: string) {
    const map = this.webMap.mapAdapter.map;
    if (map) {
      const layerClickBind = (ev: MapMouseEvent & EventData) => this._onLayerClick(ev, layerId);
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
      this._setLayerOpacity(this.currentLayerId, this._opacity);
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

  private async _addLayer(url: string, id: string): Promise<any> {
    const paint = {
      'fill-opacity': this._opacity,
      'fill-opacity-transition': {
        duration: 0
      },
      // 'fill-outline-color': '#8b0000', // darkred
      // 'fill-outline-color': '#8b0000', // darkred
      'fill-color': this.options.getFillColor()
    };
    const paintLine = {
      'line-opacity': this._opacity,
      'line-opacity-transition': {
        duration: 0
      },
      'line-width': 1,
      'line-color': this.options.getFillColor({ darken: 0.5 })
    };
    const sourceLayer = id;
    const fillLayer = (await this.webMap.addLayer('MVT', {
      url,
      id,
      paint,
      nativePaint: true,
      sourceLayer
    })) as TimeLayer;
    const boundLayer = (await this.webMap.addLayer('MVT', {
      url,
      id: id + '-bound',
      paint: paintLine,
      type: 'line',
      sourceLayer,
      nativePaint: true
    })) as TimeLayer;
    this._timeLayers[id] = [fillLayer, boundLayer];
    return [fillLayer, boundLayer];
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
}
