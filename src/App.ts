import './App.css';

import { EventEmitter } from 'events';

import MapAdapter from '@nextgis/maplibre-gl-map-adapter';
import { debounce } from '@nextgis/utils';
import { WebMap } from '@nextgis/webmap';

import appConfig from '../config.json';

import { TimeMap } from './TimeMap/TimeMap';
import {
  getAboutProjectLink,
  getAffiliatedLinks,
} from './components/Links/Links';
import { SliderControl } from './components/SliderControl';
import { Controls } from './controls/Controls';
import { BoundaryLayer } from './layers/BoundaryLayer';
import { CitiesLayer } from './layers/CitiesLayer';
import { LinesLayer } from './layers/LinesLayer';
import { MarkerLayer } from './layers/MarkerLayer';
import { OstrogLayer } from './layers/OstrogLayer';
import { getLayers } from './services/GetLayersService';
import { getPoints } from './services/GetPointsService';
import { urlParams } from './services/UrlParams';

import type { TimeLayersGroupOptions } from './TimeMap/TimeGroup';
import type {
  AppOptions,
  AreaStat,
  LayersGroup,
  SelectedFeature,
} from './interfaces';
import type { Type } from '@nextgis/utils';
import type { Map, StyleSpecification } from 'maplibre-gl';

export class App {
  options: AppOptions = {
    target: '#app',
  } as AppOptions;
  controls!: Controls;
  slider?: SliderControl;
  webMap!: WebMap<Map, string[]>;

  urlParams = urlParams;

  emitter = new EventEmitter();

  readonly minimize = this.urlParams.get('controls') === 'min';

  timeMap!: TimeMap;

  updateDataByYear: (year: number) => void;

  private statusLayers: {
    [groupName: string]: Type<TimeLayersGroupOptions>;
  } = {
    base: BoundaryLayer,
    lines: LinesLayer,
    status1: BoundaryLayer,
    status2: BoundaryLayer,
    cities: CitiesLayer,
    ostrog: OstrogLayer,
  };

  private _markers: MarkerLayer;
  private selectedFeatures: SelectedFeature[] = [];

  constructor(options: AppOptions) {
    this.options = { ...this.options, ...options };
    this._markers = new MarkerLayer(this);
    const urlYear = this.urlParams.get('year');
    if (urlYear) {
      this.options.currentYear = parseInt(urlYear, 10);
    }

    const urlCenter = this.urlParams.get('center');
    const urlZoom = this.urlParams.get('zoom');
    const bounds = this.urlParams.get('bounds');
    if (bounds) {
      this.options.bounds = bounds.split('_').map(Number);
    } else if (urlCenter && urlZoom) {
      const center = urlCenter.split(',').map(Number);
      this.options.center = center;
      this.options.zoom = Number(urlZoom);
    }

    const urlSelectedFeatures = this.urlParams.get('selected');
    if (urlSelectedFeatures) {
      const [fid, groupName] = urlSelectedFeatures.split('__');
      this.selectedFeatures = [{ fid: Number(fid), groupName }];
    }

    const { fromYear, currentYear } = this.options;

    if (fromYear && currentYear && currentYear < fromYear) {
      this.options.currentYear = fromYear;
    }
    this.updateDataByYear = debounce(
      (year: number) => this._updateDataByYear(year),
      300,
    );
    this.createWebMap().then(() => {
      this._buildApp();
    });
  }

  async createWebMap(): Promise<WebMap> {
    const options = { ...this.options };
    let style: Partial<StyleSpecification> = {
      glyphs:
        location.origin + location.pathname + 'font/{fontstack}/{range}.pbf',
    };
    let geoservice: Partial<StyleSpecification> | undefined = undefined;

    try {
      const resp = await fetch(appConfig.geoservice.url);
      geoservice = (await resp.json()) as StyleSpecification;
      style = geoservice;
    } catch {
      //
    }

    const webMap = new WebMap<Map>({
      mapAdapter: new MapAdapter(),
      ...options,
      mapAdapterOptions: {
        style: {
          transition: {
            duration: 0,
            delay: 0,
          },
          ...style,
        },
      },
    });
    await webMap.onLoad();

    this.timeMap = new TimeMap(webMap, {
      fromYear: this.options.fromYear,
      getStatusLayer: (config: LayersGroup) => this._getStatusLayer(config),
      onStepReady: (year: number) => this.updateDataByYear(year),
      onLayerUpdate: (year: number) => this.updateDataByYear(year),
      onReset: () => this.onReset(),
    });
    this.timeMap.emitter.once('loading:finish', () => {
      this._setSelectedLayerFromUrl();
    });
    if (this.options.currentYear) {
      this.timeMap.currentYear = this.options.currentYear;
    }

    if (!geoservice) {
      webMap.addBaseLayer('OSM', {
        id: 'baselayer',
      });
    }
    this.webMap = webMap;
    return webMap;
  }

  onReset(): void {
    if (this._markers) {
      this.updateDataByYear(this.timeMap.currentYear);
    }
  }

  getTimeStop(year: number): string {
    const stop = this.options.timeStops.find((x) => year < x.toYear);
    return stop ? stop.name : '';
  }

  getMapParams() {
    const { bounds, zoom, center } = this.webMap.getStateAsString();
    const year = this.options.currentYear;
    const selectedFeatures = this.selectedFeatures;
    return { zoom, center, year, bounds, selectedFeatures };
  }

  clearSelectedFeatures() {
    this.selectedFeatures = [];
  }

  updateLayersColor(): void {
    // ignore
  }

  private _updateDataByYear(year: number) {
    const pointId = this._markers._getPointIdByYear(year);

    this._markers.updatePoint(pointId);

    const areaStat = this._findAreaStatByYear(year);
    this._updatePeriodBlockByYear(year, areaStat);
    this._updateYearStatBlockByYear(year, areaStat);

    this.urlParams.set('year', String(year));
    this.options.currentYear = year;
  }

  private _setSelectedLayerFromUrl() {
    if (this.selectedFeatures?.length !== 0) {
      const { groupName, fid } = this.selectedFeatures[0];
      const group = this.timeMap.getTimeGroup(groupName);
      if (group) {
        group.select(String(fid));
      }
    }
  }

  private async _buildApp() {
    const data = await getLayers();
    this.timeMap.buildTimeMap(data);
    if (!this.minimize) {
      this.slider = this._createSlider();
    }

    this._createHeader();
    this._createAffiliatedLogos();
    this.controls = new Controls(this, {
      minimize: this.minimize,
    });
    this.controls.updateControls();

    this.webMap.onMapLoad(() => {
      this.timeMap.updateByYear(this.timeMap.currentYear);
    });
    this.emitter.emit('build');
    this._addEventsListeners();
    const points = await getPoints();
    this._markers.setPoints(points);
  }

  private _getStatusLayer(config: LayersGroup) {
    const sourceGroups = appConfig.sourceGroups as unknown as LayersGroup[];
    const groupOptions = sourceGroups.find((g) => g.name === config.name);
    const options: Partial<TimeLayersGroupOptions> = {
      ...groupOptions,
      name: config.name,
      baseUrl: this.options.baseUrl,
      manualOpacity: true,
    };
    const StatusLayer: Type<TimeLayersGroupOptions> | undefined =
      this.statusLayers[config.name];
    if (StatusLayer) {
      const statusLayer = new StatusLayer(this, options);
      return statusLayer;
    }
  }

  private _createSlider() {
    // used for animation to wait full layer loading
    const stepReady = (
      year: number,
      callback: (value: number) => void,
      previous: boolean,
    ) => {
      this.timeMap._stepReady(year, callback);
    };
    const slider = new SliderControl({
      type: 'range',
      min: this.timeMap._minYear,
      max: this.timeMap._maxYear,
      step: 1,
      animationStep: this.options.animationStep || 1,
      value: this.timeMap.currentYear,
      animationDelay: this.options.animationDelay || 200,
      stepReady,
    });
    slider.emitter.on('change', (year: number) => {
      // may be updated in _stepReady method
      if (year !== this.timeMap.currentYear && year !== this.timeMap.nextYear) {
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
    const period = periods.find((x) => {
      let found = year >= x.years_from;
      if (found && x.years_to) {
        found = year <= x.years_to;
      }
      return found;
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
      return this.options.areaStat.find((x) => x.year === year);
    }
  }

  private _findYearStatsByYear(year: number) {
    year = Number(year);
    const yearsStat = this.options.yearsStat || [];
    const yearStat = yearsStat.filter((x) => {
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
        },
      );
    }
    this.webMap.emitter.on('preclick', () => {
      this.clearSelectedFeatures();
      this.timeMap.unselect();
    });
    this.webMap.emitter.on('layer:click', (e) => {
      this.clearSelectedFeatures();
      if (e.layer.id) {
        const group = this.timeMap.getTimeGroupByAdapterId(e.layer.id);
        const groupName = group && group.timeGroup.name;
        if (groupName) {
          if (e.feature) {
            const feature = e.feature;
            const selectedFeature: SelectedFeature = {
              fid: feature.properties?.fid,
              groupName,
            };

            this.selectedFeatures.push(selectedFeature);
          }
        }
      }
    });
  }
}
