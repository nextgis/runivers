import './App.css';

import { SliderControl } from './SliderControl';

import { getLayers } from './services/GetLayersService';
import { WebMap } from '../nextgisweb_frontend/packages/webmap/src/entities/WebMap';
import { MapboxglAdapter } from '../nextgisweb_frontend/packages/mapbox-gl-adapter/src/MapboxglAdapter';
// import { doNotRepeat } from './utils/doNotRepeat';
import { PeriodPanelControl, Period } from './PeriodPanelControl';
import { YearsStatPanelControl, YearStat } from './YearsStatPanelControl';

export interface AppOptions {
  baseUrl: string;
  target: string;
  currentYear: number;
  periods: Period[];
  yearsStat: YearStat[];
  version: string;
}

export class App {

  options: AppOptions;
  currentYear: number;
  slider: SliderControl;

  periodsPanelControl = new PeriodPanelControl();
  yearsStatPanelControl = new YearsStatPanelControl();
  webMap: WebMap;

  currentLayerId = null;

  _headerElement: HTMLElement;

  private _minYear: number;
  private _maxYear: number;

  private _layersConfig = [];
  private _loadedSources = {};
  private _onDataLoadEvents = [];


  constructor(options: AppOptions) {
    this.options = Object.assign({}, this.options, options);
    this.currentYear = options.currentYear;
    this.webMap = this.createWebMap();
    this._buildApp();
  }

  createWebMap() {
    const options = Object.assign({}, this.options);
    const webMap = new WebMap({
      mapAdapter: new MapboxglAdapter()
    });
    webMap.create(options);

    webMap.addBaseLayer('osm', 'OSM');
    webMap.map.showLayer('osm');

    webMap.map.addControl('ZOOM', 'top-left');

    webMap.map.emitter.on('data-loaded', (data) => this._onData(data));

    return webMap;
  }

  updateLayerByYear(year) {
    const layerId = this._getLayerIdByYear(year);
    this.updateLayer(layerId);

    this._updatePeriodBlockByYear(year);
    this._updateYearStatBlockByYear(year);
  }

  updateLayer(layerId) {
    const fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    this._switchLayer(fromId, layerId);
  }

  // region App control
  _buildApp() {
    getLayers((data) => {
      this._layersConfig = this._processLayersMeta(data);

      this.slider = this._createSlider();
      this.webMap.map.addControl(this.periodsPanelControl, 'top-right');
      this.webMap.map.addControl(this.yearsStatPanelControl, 'top-right');

      this._headerElement = this._createHeader();

      this.webMap.map.onMapLoad(() => {
        this.updateLayerByYear(this.currentYear);
      });
    });
  }

  _createSlider() {
    const slider = new SliderControl({
      min: this._minYear,
      max: this._maxYear,
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

    this.webMap.map.addControl(slider, 'bottom-left');
    return slider;
  }

  _createHeader() {
    const header = document.createElement('div');
    header.className = 'app-header';
    header.innerHTML = `Границы России ${this._minYear}-${this._maxYear} гг.`;
    const mapContainer = this.webMap.map.getContainer();
    mapContainer.appendChild(header);
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

  _findYearStatByYear(year: number) {
    year = Number(year);
    const yearsStat = this.options.yearsStat || [];
    const yearStat = yearsStat.find((x) => x.year === year);
    return yearStat;
  }
  // endregion

  // region Map control
  _switchLayer(fromId, toId) {
    if (toId && fromId !== toId) {
      this._showLayer(toId);
      // do not hide unloaded layer if it first
      if (fromId) {
        this.webMap.map.setLayerOpacity(toId, 0);
      } else {
        this._loadedSources[toId] = true;
      }
    }
  }

  _preloadLayer(layerId) {
    this._loadedSources[layerId] = this._loadedSources[layerId] || false;
    this._showLayer(layerId);
    this.webMap.map.setLayerOpacity(layerId, 0);
  }

  _nextStepReady(year, callback) {
    const nextLayerId = this._getLayerIdByYear(year);

    const next = () => {
      callback(year);
    };
    this._preloadLayer(nextLayerId);
    const isLoading = this.currentLayerId === nextLayerId;
    if (isLoading) {
      next();
    } else {
      this._onDataLoadEvents.push(next);
    }
  }

  _isHistoryLayer(layerId) {
    return !this.webMap.isBaseLayer(layerId);
  }

  _onData(data) {
    if (this._isHistoryLayer(data.target)) {
      this._loadedSources[data.target] = true;
      this._onSourceIsLoaded();
    }

  }

  _onSourceIsLoaded() {
    this._hideNotCurrentLayers();
    this.webMap.map.setLayerOpacity(this.currentLayerId, 0.8);
    for (let fry = 0; fry < this._onDataLoadEvents.length; fry++) {
      const event = this._onDataLoadEvents[fry];
      event();
    }
    this._onDataLoadEvents = [];
  }

  _hideNotCurrentLayers() {
    const layers = this.webMap.map.getLayers();
    layers.forEach((l) => {
      if (!this.webMap.isBaseLayer(l)) {
        if (l !== String(this.currentLayerId) && this.webMap.map.isLayerOnTheMap(l)) {
          this._hideLayer(l);
        }
      }
    });
  }

  _hideLayer(layerId) {
    this.webMap.map.toggleLayer(layerId, false);
  }

  _showLayer(id) {
    const exist = this.webMap.map.getLayer(id);
    if (!exist) {
      const url = this.options.baseUrl + '/api/resource/' + id + '/{z}/{x}/{y}.mvt';
      const paint = {
        'fill-opacity': 0.8,
        'fill-opacity-transition': {
          duration: 0
        },
        // 'fill-outline-color': '#8b0000', // darkred
        'fill-color': [
          'match',
          ['get', 'status'],
          1, '#fbb03b',
          2, '#223b53',
          3, '#e55e5e',
          4, '#3bb2d0',
          5, '#3bb2d0',
          /* other */ 'red'
        ]
      };
      this.webMap.map.addLayer('MVT', { url, id, paint });
    }
    this.webMap.map.toggleLayer(id, true);
  }

  _getLayerIdByYear(year) {
    const filteredLayer = this._layersConfig.filter((d) => ((year >= d.from) && (year <= d.to)));
    const layerId = (filteredLayer.length !== 0) ? filteredLayer[0].id : undefined;
    return layerId;
  }

  _processLayersMeta(layersMeta) {
    return layersMeta.map(({ resource }) => {
      const name = resource.display_name;
      const [from, to] = name.match('from_(\\d{4})_to_(\\d{4}).*$').slice(1).map((x) => Number(x));
      this._minYear = (this._minYear > from ? from : this._minYear) || from;
      this._maxYear = (this._maxYear < to ? to : this._maxYear) || to;
      return { name, from, to, id: resource.id };
    });
  }
  // endregion
}
