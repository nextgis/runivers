import './App.css';

import { SliderControl } from './SliderControl';

import { getLayers } from './services/GetLayersService';
import { WebMap } from '../nextgisweb_frontend/packages/webmap';
import { MapboxglAdapter } from '../nextgisweb_frontend/packages/mapbox-gl-adapter';
// import { doNotRepeat } from './utils/doNotRepeat';
import { PeriodPanelControl } from './PeriodPanelControl';
import { YearsStatPanelControl } from './YearsStatPanelControl';

export class App {

  constructor(options) {
    this.options = Object.assign({}, this.options, options);
    this.currentYear = this.options.currentYear;

    this.slider;
    this.periodsPanelControl = new PeriodPanelControl()
    this.yearsStatPanelControl = new YearsStatPanelControl()
    this.webMap = this.createWebMap();
    this.currentLayerId = null;

    this._minYear;
    this._maxYear;

    this._layersConfig = [];
    this._loadedSources = {};
    this._onDataLoadEvents = [];

    this._buildApp();

  }

  createWebMap() {
    const options = Object.assign({}, this.options, {
      mapAdapter: new MapboxglAdapter()
    });
    const webMap = new WebMap(options);
    webMap.create();

    webMap.map.addBaseLayer('osm');

    // webMap.map.on('data', (data) => this._onData(data));

    // // set base layers
    // webMap.onMapLoad(() => {
    //   webMap.addTileLayer('osm', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    //     subdomains: 'abc'
    //   });
    // })

    return webMap;
  }

  updateLayerByYear(year) {
    let layerId = this._getLayerIdByYear(year);
    this.updateLayer(layerId);

    this._updatePeriodBlockByYear(year);
    this._updateYearStatBlockByYear(year);
  }

  updateLayer(layerId) {
    let fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    this._switchLayer(fromId, layerId);
  }

  // region App control
  _buildApp() {
    getLayers((data) => {
      this._layersConfig = this._processLayersMeta(data);

      this.slider = this._createSlider();
      // this.webMap.map.addControl(this.periodsPanelControl, 'top-right');
      // this.webMap.map.addControl(this.yearsStatPanelControl, 'top-right');

      this._headerElement = this._createHeader();

      // this.webMap.onMapLoad(() => {
      //   this.updateLayerByYear(this.currentYear)
      // });
    });
  }

  _createSlider() {
    const slider = new SliderControl({
      min: this.minYear,
      max: this.maxYear,
      step: 1,
      animationStep: 10,
      value: this.currentYear,
      animationDelay: 10,
      nextStepReady: (year, callback) => this._nextStepReady(year, callback)
    });
    slider.emitter.on('change', (year) => {
      this.currentYear = year;
      this.updateLayerByYear(year);
    });

    // this.webMap.map.addControl(slider, 'bottom-left');
    return slider;
  }

  _createHeader() {
    const header = document.createElement('div');
    header.className = 'app-header';
    header.innerHTML = `Границы России ${this.minYear}-${this.maxYear} гг.`;
    // const mapContainer = this.webMap.map.map.getContainer();
    // mapContainer.appendChild(header);
    return header;
  }

  _updatePeriodBlockByYear(year) {
    const period = this._findPeriodByYear(year);
    this.periodsPanelControl.updatePeriod(period);
  }

  _findPeriodByYear(year) {
    year = parseInt(year, 10);
    const periods = this.options.periods || [];
    const period = periods.find((x) => (year >= x.start) && (year <= x.end));
    return period;
  }

  _updateYearStatBlockByYear(year) {
    const yearStat = this._findYearStatByYear(year);
    this.yearsStatPanelControl.updateYearStat(yearStat);
  }

  _findYearStatByYear(year) {
    year = parseInt(year, 10);
    const yearsStat = this.options.yearsStat || [];
    const yearStat = yearsStat.find((x) => x.year === year);
    return yearStat;
  }



  // endregion

  //region Map control
  _switchLayer(fromId, toId) {
    if (fromId !== toId) {
      this._showLayer(toId);
      // do not hide unloaded layer if it first
      if (fromId) {
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
    let nextLayerId = this._getLayerIdByYear(year);

    let next = () => {
      callback(year);
    }
    this._preloadLayer(nextLayerId);
    let isLoading = this.currentLayerId === nextLayerId;
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
          this._onSourceIsLoaded();
          // use this delay do remove layer switch blinking
          // doNotRepeat('onSourceIsLoaded', () => this._onSourceIsLoaded(), 200);
        }
      }
    }
  }

  _onSourceIsLoaded() {
    this._hideNotCurrentLayers();
    this.webMap.map.setPaintProperty(this.currentLayerId, 'fill-opacity', 0.8);
    for (let fry = 0; fry < this._onDataLoadEvents.length; fry++) {
      let event = this._onDataLoadEvents[fry];
      event();
    }
    this._onDataLoadEvents = [];
  }

  _hideNotCurrentLayers() {
    const layers = this.webMap._layers;
    for (let l in layers) {
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
    const filteredLayer = this._layersConfig.filter((d) => ((year >= d.from) && (year <= d.to)));
    const layerId = (filteredLayer.length != 0) ? filteredLayer[0].id : undefined;
    return layerId;
  }

  _processLayersMeta(layersMeta) {
    return layersMeta.map(({ resource }) => {
      const name = resource.display_name;
      const [from, to] = name.match('from_(\\d{4})_to_(\\d{4}).*$').slice(1).map((x) => Number(x));
      this.minYear = (this.minYear > from ? from : this.minYear) || from;
      this.maxYear = (this.maxYear < to ? to : this.maxYear) || to;
      return { name, from, to, id: resource.id };
    });
  }
  // endregion
}
