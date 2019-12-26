import './App.css';

import { Map } from 'mapbox-gl';
import { EventEmitter } from 'events';

import WebMap, { Type } from '@nextgis/webmap';
import QmsKit from '@nextgis/qms-kit';
import MapboxglAdapter from '@nextgis/mapboxgl-map-adapter';

import { SliderControl } from './components/SliderControl';
import { getLayers } from './services/GetLayersService';
import { getPoints } from './services/GetPointsService';
import {
  getAboutProjectLink,
  getAffiliatedLinks
} from './components/Links/Links';

import { AppOptions, AreaStat, LayersGroup } from './interfaces';

import { Controls } from './Controls';
import { TimeMap } from './TimeMap/TimeMap';

import { urlParams } from './services/UrlParams';
import { TimeLayersGroupOptions } from './TimeMap/TimeGroup';
import { MarkerLayer } from './layers/MarkerLayer';
import { CitiesLayer } from './layers/CitiesLayer';
import { LinesLayer } from './layers/LinesLayer';
import { BoundaryLayer } from './layers/BoundaryLayer';

export class App {
  options: AppOptions = {
    target: '#app',
    style: {
      transition: {
        duration: 0,
        delay: 0
      },
      glyphs:
        location.origin + location.pathname + 'font/{fontstack}/{range}.pbf'
    }
  } as AppOptions;
  controls!: Controls;
  slider!: SliderControl;
  webMap!: WebMap<Map, string[]>;

  urlParams = urlParams;

  emitter = new EventEmitter();

  timeMap!: TimeMap;

  private statusLayers: {
    [groupName: string]: Type<TimeLayersGroupOptions>;
  } = {
    base: BoundaryLayer,
    cities: CitiesLayer,
    lines: LinesLayer
  };

  private _markers: MarkerLayer;

  constructor(options: AppOptions) {
    this.options = { ...this.options, ...options };
    this._markers = new MarkerLayer(this);
    const urlYear = this.urlParams.get('year');
    if (urlYear) {
      this.options.currentYear = parseInt(urlYear, 10);
    }

    const { fromYear, currentYear } = this.options;

    if (fromYear && currentYear && currentYear < fromYear) {
      this.options.currentYear = fromYear;
    }
    this.createWebMap().then(() => {
      this._buildApp();
    });
  }

  async createWebMap() {
    const options = { ...this.options };
    const webMap = new WebMap({
      mapAdapter: new MapboxglAdapter(),
      starterKits: [new QmsKit()]
    });
    await webMap.create(options);
    this.timeMap = new TimeMap(webMap, {
      fromYear: this.options.fromYear,
      getStatusLayer: (config: LayersGroup) => this._getStatusLayer(config),
      onStepReady: (year: number) => this.updateDataByYear(year),
      onLayerUpdate: (year: number) => this.updateDataByYear(year)
    });
    this.timeMap.emitter.once('loading:finish', () => {
      this._setSelectedLayerFromUrl();
    });
    if (this.options.currentYear) {
      this.timeMap.currentYear = this.options.currentYear;
    }
    webMap.addBaseLayer('QMS', {
      id: 'baselayer',
      qmsId: 2550,
      visibility: true
    });
    this.webMap = webMap;
    return webMap;
  }

  updateDataByYear(year: number) {
    const pointId = this._markers._getPointIdByYear(year);

    this._markers.updatePoint(pointId);

    const areaStat = this._findAreaStatByYear(year);

    this._updatePeriodBlockByYear(year, areaStat);
    this._updateYearStatBlockByYear(year, areaStat);

    this.urlParams.set('year', String(year));
  }

  getTimeStop(year: number): string {
    const stop = this.options.timeStops.find(x => year < x.toYear);
    return stop ? stop.name : '';
  }

  updateLayersColor() {
    // ignore
  }

  private _setSelectedLayerFromUrl() {
    const id = urlParams.get('id');
    if (id) {
      const group = this.timeMap.getTimeGroup('base');
      if (group) {
        group.select(id);
      }
    }
  }

  private _buildApp() {
    getLayers(data => {
      this.timeMap.buildTimeMap(data);

      this.slider = this._createSlider();

      this._createHeader();
      this._createAffiliatedLogos();
      this.controls = new Controls(this);
      this.controls.updateControls();

      this.webMap.onMapLoad(() => {
        this.timeMap.updateByYear(this.timeMap.currentYear);
      });
      this.emitter.emit('build');
      this._addEventsListeners();
    });
    getPoints().then(points => {
      this._markers.setPoints(points);
    });
  }

  private _getStatusLayer(config: LayersGroup) {
    const options: Partial<TimeLayersGroupOptions> = {
      name: config.name,
      baseUrl: this.options.baseUrl,
      manualOpacity: true,
      filterIdField: 'fid'
    };
    const StatusLayer: Type<TimeLayersGroupOptions> | undefined = this
      .statusLayers[config.name];
    if (StatusLayer) {
      const statusLayer = new StatusLayer(this, options);
      return statusLayer;
    }
  }

  private _createSlider() {
    const stepReady = (
      year: number,
      callback: (value: number) => void,
      previous: boolean
    ) => {
      this.timeMap._stepReady(year, callback, previous);
    };
    const slider = new SliderControl({
      type: 'range',
      min: this.timeMap._minYear,
      max: this.timeMap._maxYear,
      step: 1,
      animationStep: this.options.animationStep || 1,
      value: this.timeMap.currentYear,
      animationDelay: this.options.animationDelay || 100,
      stepReady
    });
    slider.emitter.on('change', (year: number) => {
      // may be updated in _stepReady method
      if (year !== this.timeMap.currentYear) {
        this.timeMap.currentYear = year;
        this.timeMap.updateByYear(year);
      }
    });

    const container = this.webMap.mapAdapter.getContainer();
    if (container) {
      container.appendChild(slider.onAdd(this.webMap));
    }

    return slider;
  }

  private _createHeader() {
    const header = document.createElement('div');
    header.className = 'font-effect-shadow-multiple app-header';
    const headerText = document.createElement('span');
    headerText.innerHTML = `
      Границы России ${this.timeMap._minYear}-${this.timeMap._maxYear} гг.`;
    header.appendChild(headerText);
    header.appendChild(getAboutProjectLink(this));

    const mapContainer = this.webMap.mapAdapter.getContainer();
    if (mapContainer) {
      mapContainer.appendChild(header);
    }

    return header;
  }

  private _createAffiliatedLogos() {
    const logos = document.createElement('div');
    logos.className = 'app-affiliated-logos';

    logos.appendChild(getAffiliatedLinks(this));

    const mapContainer = this.webMap.mapAdapter.getContainer();
    if (mapContainer) {
      mapContainer.appendChild(logos);
    }

    return logos;
  }

  private _updatePeriodBlockByYear(year: number, areaStat?: AreaStat) {
    const period = this._findPeriodByYear(year);
    if (period && this.controls.periodsPanelControl) {
      this.controls.periodsPanelControl.updatePeriod(period, areaStat);
    }
  }

  private _findPeriodByYear(year: number) {
    const periods = this.options.periods || [];
    const period = periods.find(x => {
      let finded = year >= x.years_from;
      if (finded && x.years_to) {
        finded = year <= x.years_to;
      }
      return finded;
    });
    return period;
  }

  private _updateYearStatBlockByYear(year: number, areaStat?: AreaStat) {
    if (this.controls.yearsStatPanelControl) {
      const yearStat = this._findYearStatsByYear(year);
      this.controls.yearsStatPanelControl.updateYearStats(yearStat, areaStat);
    }
  }

  private _findAreaStatByYear(year: number): AreaStat | undefined {
    if (this.options.areaStat) {
      return this.options.areaStat.find(x => x.year === year);
    }
  }

  private _findYearStatsByYear(year: number) {
    year = Number(year);
    const yearsStat = this.options.yearsStat || [];
    const yearStat = yearsStat.filter(x => {
      return year === x.year;
    });

    return yearStat;
  }

  private _addEventsListeners() {
    if (this.controls.yearsStatPanelControl) {
      this.controls.yearsStatPanelControl.emitter.on(
        'update',
        ({ yearStat }) => {
          this._markers.updateActiveMarker(yearStat);
        }
      );
    }
  }
}
