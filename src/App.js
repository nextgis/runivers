import './css/style.css';

import { SliderControl } from './SliderControl';

import { getLayers } from './services/GetLayersService';
import { WebMap } from './WebMap';
import { doNotRepeat } from './utils/doNotRepeat';

export class App {

  constructor(options) {
    this.options = Object.assign({}, this.options, options);
    this.currentYear = this.options.currentYear;

    this.slider;
    this.webMap = this.createWebMap();

    this.currentLayerId = null;
    this._minYear;
    this._maxYear;

    this._layersConfig = [];
    this._loadedSources = {};
    this._onDataLoadEvents = [];

  }

  createWebMap() {

    const webMap = new WebMap(this.options);

    webMap.map.on('data', (data) => this._onData(data));

    // set base layers
    webMap.onMapLoad(() => {
      webMap.addTileLayer('osm', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
        subdomains: 'abc'
      });
    })

    getLayers((data) => {
      webMap.onMapLoad(() => {

        this._layersConfig = this._processLayersMeta(data);
        this.updateLayerByYear(this.currentYear)
        this.slider = new SliderControl({
          min: this.minYear,
          max: this.maxYear,
          step: 1,
          animationStep: 10,
          value: this.currentYear,
          animationDelay: 10,
          nextStepReady: (year, callback) => this._nextStepReady(year, callback)
        })
        this.slider.emitter.on('change', (year) => {
          this.currentYear = year;
          this.updateLayerByYear(year);
        })
        webMap.map.addControl(this.slider, 'bottom-left');
      });
    });

    return webMap;
  }

  updateLayerByYear(year) {
    var layerId = this._getLayerIdByYear(year);
    this.updateLayer(layerId);
  }

  updateLayer(layerId) {
    var fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    this._switchLayer(fromId, layerId);
  }

  _switchLayer(fromId, toId) {
    if (fromId !== toId) {
      this._showLayer(toId);
      // do not hide unloded layer if it first
      if (fromId && !this.webMap.map.isSourceLoaded(toId)) {
        this.webMap.map.setPaintProperty(toId, 'fill-opacity', 0);
      } else {
        this._loadedSources[toId] = true;
      }
    }
  }

  _preloadLayer(layerId) {
    this._loadedSources[layerId] = this._loadedSources[layerId] || false;
    this._showLayer(layerId);
    this.webMap.map.setPaintProperty(layerId, 'fill-opacity', 0);
  }

  _nextStepReady(year, callback) {
    var nextLayerId = this._getLayerIdByYear(year);

    var next = () => {
      callback(year);
    }
    this._preloadLayer(nextLayerId);
    var isLoading = this.currentLayerId === nextLayerId || this._loadedSources[nextLayerId];
    if (isLoading) {
      next();
    } else {
      this._onDataLoadEvents.push(next);
    }
  }

  _isHistoryLayer(layerId) {
    return this.webMap._layers[layerId] !== undefined;
  }

  _onData(data) {
    if (data.dataType === 'source') {
      if (this._isHistoryLayer(data.sourceId)) {
        const isLoaded = data.isSourceLoaded;
        if (isLoaded) {
          this._loadedSources[data.sourceId] = isLoaded;
          // use this delay do remove layer switch blinking
          doNotRepeat('onSourceIsLoaded', () => this._onSourceIsLoaded(), 200);
        }
      }
    }
  }

  _onSourceIsLoaded() {
    this._hideNotCurrentLayers();
    this.webMap.map.setPaintProperty(this.currentLayerId, 'fill-opacity', 0.8);
    for (var fry = 0; fry < this._onDataLoadEvents.length; fry++) {
      var event = this._onDataLoadEvents[fry];
      event();
    }
    this._onDataLoadEvents = [];
  }

  _hideNotCurrentLayers() {
    const layers = this.webMap._layers;
    for (var l in layers) {
      if (layers.hasOwnProperty(l)) {
        if (l !== String(this.currentLayerId) && layers[l]) {
          this._hideLayer(l);
        }
      }
    }
  }

  _hideLayer(layerId) {
    this.webMap.toggleLayer(layerId, false)
  }

  _showLayer(layerId) {
    this.webMap.toggleLayer(layerId, true)
  }

  _getLayerIdByYear(year) {
    var filteredLayer = this._layersConfig.filter((d) => ((year >= d.from) && (year <= d.to)));
    var layerId = (filteredLayer.length != 0) ? filteredLayer[0].id : undefined;
    return layerId;
  }

  _processLayersMeta(layersMeta) {
    var layersDescription = layersMeta.map((d) => {
      var layer = {};
      var resource = d.resource;
      var re = new RegExp('from_(\\d{4})_to_(\\d{4}).*$');
      var layerName = resource.display_name;
      layer.name = resource.display_name;
      layer.id = resource.id;
      layer.from = +layerName.replace(re, '$1');
      layer.to = +layerName.replace(re, '$2');
      return layer;
    });

    var fromYears = layersDescription.map((x) => {
      return x.from;
    });
    var toYears = layersDescription.map((x) => {
      return x.to;
    });
    this.minYear = (fromYears.sort((a, b) => {
      return a - b;
    }))[0];
    this.maxYear = (toYears.sort((a, b) => {
      return b - a;
    }))[0];

    return layersDescription;
  }
}






