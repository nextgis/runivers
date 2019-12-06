import './App.css';

import WebMap from '@nextgis/webmap';
import MapboxglAdapter from '@nextgis/mapboxgl-map-adapter';
import QmsKit from '@nextgis/qms-kit';

import { SliderControl } from './components/SliderControl';
import { Marker, Map } from 'mapbox-gl';
import { getLayers } from './services/GetLayersService';
import { getPoints, getPointGeojson } from './services/GetPointsService';

import { EventEmitter } from 'events';

import proj4 from 'proj4';
import { Feature, MultiPoint, Point, FeatureCollection } from 'geojson';

import { onlyUnique } from './utils/utils';
import {
  getAboutProjectLink,
  getAffiliatedLinks
} from './components/Links/Links';

import {
  AppOptions,
  LayerMeta,
  PointProperties,
  PointMeta,
  AreaStat,
  AppMarkerMem,
  HistoryLayerResource
} from './interfaces';

import { Controls } from './Controls';
import { TimeMap, TimeLayer } from './TimeMap/TimeMap';

import { urlParams } from './services/UrlParams';
import { TimeLayersGroupOptions } from './TimeMap/TimeGroup';
import { BaseLayer } from './layers/BaseLayer';

export class App {
  options: AppOptions = {
    target: '#app'
  } as AppOptions;
  currentYear!: number;
  controls!: Controls;
  slider!: SliderControl;
  webMap!: WebMap<Map, string[]>;
  currentPointId?: string;

  urlParams = urlParams;

  emitter = new EventEmitter();

  timeMap!: TimeMap;

  private _minYear = 0;
  private _maxYear = 0;

  private _layersConfig: LayerMeta[] = [];

  private _pointsConfig: PointMeta[] = [];
  private _markers: AppMarkerMem[] = [];

  constructor(options: AppOptions) {
    this.options = { ...this.options, ...options };

    const urlYear = this.urlParams.get('year');
    if (urlYear) {
      this.options.currentYear = parseInt(urlYear, 10);
    }

    const { fromYear, currentYear } = this.options;

    if (fromYear && currentYear && currentYear < fromYear) {
      this.options.currentYear = fromYear;
    }
    if (this.options.currentYear) {
      this.currentYear = this.options.currentYear;
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
    this.timeMap = new TimeMap(webMap, {});
    webMap.addBaseLayer('QMS', {
      id: 'baselayer',
      qmsId: 2550,
      visibility: true
    });
    this._addTimeLayersGroups();
    this.webMap = webMap;
    return webMap;
  }

  updateByYear(year: number, previous?: boolean) {
    const layerId = this._getLayerIdByYear(year, previous);
    if (layerId) {
      this.updateLayer(layerId);
    }

    this.updateDataByYear(year);
  }

  updateDataByYear(year: number) {
    const pointId = this._getPointIdByYear(year);

    this.updatePoint(pointId);

    const areaStat = this._findAreaStatByYear(year);

    this._updatePeriodBlockByYear(year, areaStat);
    this._updateYearStatBlockByYear(year, areaStat);

    this.urlParams.set('year', String(year));
  }

  updateLayer(layerId: string) {
    this.timeMap.updateLayer(layerId);
  }

  updatePoint(pointId?: string) {
    if (pointId !== this.currentPointId) {
      if (this.currentPointId) {
        // this._removePoint(this.currentPointId);
        this._markers.forEach(x => {
          x.marker.remove();
        });
        this._markers = [];
      }
      this.currentPointId = pointId;
      if (pointId) {
        this._addPoint(pointId);
      }
    }
  }

  updateLayersColor() {
    // this.timeMap.updateLayersColor();
  }

  _findYearInDateStr(dateStr: string): number | undefined {
    const datePattern = /(\d{4})/;
    const date = datePattern.exec(dateStr);
    if (date) {
      return Number(date[0]);
    }
  }

  _getTimeStop(year: number): string {
    const stop = this.options.timeStops.find(x => year < x.toYear);
    return stop ? stop.name : '';
  }

  private _buildApp() {
    getLayers(data => {
      this._layersConfig = this._processLayersMeta(data);
      if (!this.currentYear && this._minYear) {
        this.currentYear = this._minYear;
      }
      this._layersConfig.sort((a, b) => (a.from < b.from ? -1 : 1));

      this.slider = this._createSlider();

      this._createHeader();
      this._createAffiliatedLogos();
      this.controls = new Controls(this);
      this.controls.updateControls();

      this.webMap.onMapLoad(() => {
        this.updateByYear(this.currentYear);
      });
      this.emitter.emit('build');
      this._addEventsListeners();
    });
    getPoints().then(points => {
      this._pointsConfig = this._processPointsMeta(points);
      const pointId = this._getPointIdByYear(this.currentYear);
      if (pointId) {
        this.updatePoint(pointId);
      }
    });
  }

  private _addTimeLayersGroups(config?: HistoryLayerResource[]) {
    const options: Partial<TimeLayersGroupOptions> = {
      name: '',
      baseUrl: this.options.baseUrl,
      filterIdField: 'fid'
    };

    const baseLayer = new BaseLayer(this, options);

    this.timeMap.addTimeGroup(baseLayer);
  }

  private _createSlider() {
    const stepReady = (
      year: number,
      callback: (value: number) => void,
      previous: boolean
    ) => {
      this._stepReady(year, callback, previous);
    };
    const slider = new SliderControl({
      type: 'range',
      min: this._minYear,
      max: this._maxYear,
      step: 1,
      animationStep: this.options.animationStep || 1,
      value: this.currentYear,
      animationDelay: this.options.animationDelay || 100,
      stepReady
    });
    slider.emitter.on('change', (year: number) => {
      // may be updated in _stepReady method
      if (year !== this.currentYear) {
        this.currentYear = year;
        this.updateByYear(year);
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
    headerText.innerHTML = `Границы России ${this._minYear}-${this._maxYear} гг.`;
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

  private _stepReady(
    year: number,
    callback: (year: number) => void,
    previous?: boolean
  ) {
    let nextLayer = this._getLayerByYear(year, previous);
    if (!nextLayer) {
      nextLayer = this._getNextLayer(year, previous);
    }

    if (nextLayer) {
      const y = year;
      // const y = previous ? nextLayer.to : nextLayer.from;

      const next = () => {
        this.currentYear = y;
        callback(y);
      };
      if (this.timeMap.getTimeGroup().currentLayerId !== String(nextLayer.id)) {
        this.timeMap.pushDataLoadEvent(next);
        this.updateLayer(String(nextLayer.id));
      } else {
        next();
      }
      this.updateDataByYear(y);
    } else {
      if (this._minYear && this._maxYear) {
        callback(previous ? this._minYear : this._maxYear);
      }
    }
  }

  // TODO: Mapboxgl specific method
  private _addPoint(id: string) {
    getPointGeojson(id).then(
      (data: FeatureCollection<MultiPoint, PointProperties>) => {
        const _many =
          data.features.length > 1 &&
          data.features.map(x => x.properties.numb).filter(onlyUnique);
        const many = _many && _many.length > 1;
        data.features.forEach(
          (marker: Feature<Point | MultiPoint, PointProperties>, i) => {
            const type = marker && marker.geometry && marker.geometry.type;
            if (type === 'MultiPoint') {
              const coordinates = marker.geometry.coordinates as Array<
                [number, number]
              >;
              coordinates.forEach(x => {
                this._addMarkerToMap(x, marker.properties, many);
              });
            } else if (type === 'Point') {
              this._addMarkerToMap(
                marker.geometry.coordinates as [number, number],
                marker.properties,
                many
              );
            }
          }
        );
      }
    );
  }

  // TODO: Mapboxgl specific method
  private _addMarkerToMap(
    coordinates: [number, number],
    properties: PointProperties,
    many: boolean
  ) {
    const map: Map | undefined = this.webMap.mapAdapter.map;
    if (map) {
      // create a DOM element for the marker
      const element = document.createElement('div');
      let isActive;
      if (this.controls.yearsStatPanelControl) {
        const yearStat = this.controls.yearsStatPanelControl.yearStat;
        isActive =
          yearStat &&
          yearStat.year === properties.year &&
          yearStat.numb === properties.numb;
      }

      element.className = 'map-marker' + (isActive ? ' active' : ''); // use class `aсtive` for selected

      const elInner = document.createElement('div');
      elInner.className = 'map-marker--inner';
      elInner.innerHTML = many
        ? `<div class="map-marker__label">${properties.numb}</div>`
        : '';

      element.appendChild(elInner);

      const coordEPSG4326 = proj4('EPSG:3857').inverse(coordinates);
      // add marker to map
      const marker = new Marker(element);
      const markerMem = { marker, element, properties };
      this._markers.push(markerMem);
      marker.setLngLat(coordEPSG4326);

      marker.addTo(map);

      element.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        this._setMarkerActive(markerMem, properties);
      });
    }
  }

  private _setMarkerActive(
    markerMem: AppMarkerMem,
    properties: PointProperties
  ) {
    const yearControl = this.controls.yearsStatPanelControl;
    if (yearControl && yearControl.yearStats) {
      const yearStat = yearControl.yearStats.find(x => {
        return x.year === properties.year && x.numb === properties.numb;
      });
      if (yearStat) {
        yearControl.updateYearStat(yearStat);
        yearControl.unBlock();
        yearControl.show();
      }
    }
  }

  private _updateActiveMarker(yearsStat: { year: number; numb: number }) {
    this._markers.forEach(x => {
      if (
        x.properties.year === yearsStat.year &&
        x.properties.numb === yearsStat.numb
      ) {
        x.element.classList.add('active');
      } else {
        x.element.classList.remove('active');
      }
    });
  }

  private _getLayerByYear(
    year: number,
    previous?: boolean
  ): LayerMeta | undefined {
    const layers = this._layersConfig.filter(
      d => year >= d.from && year <= d.to
    );
    // return previous ? layers[0] : layers[layers.length - 1];
    return layers[layers.length - 1];
  }

  private _getLayerIdByYear(
    year: number,
    previous?: boolean
  ): string | undefined {
    const filteredLayer = this._getLayerByYear(year, previous);
    if (filteredLayer) {
      return filteredLayer && String(filteredLayer.id);
    }
  }

  private _getPointByYear(year: number): PointMeta | undefined {
    return this._pointsConfig.find(x => x.year === year);
  }

  private _getPointIdByYear(year: number): string | undefined {
    const point = this._getPointByYear(year);
    if (point) {
      return point && String(point.id);
    }
  }

  // get next or previous territory changed layer
  private _getNextLayer(
    year: number,
    previous?: boolean
  ): LayerMeta | undefined {
    const filteredLayer = this._getLayerByYear(year);
    if (filteredLayer) {
      if (
        String(filteredLayer.id) === this.timeMap.getTimeGroup().currentLayerId
      ) {
        const index = this._layersConfig.indexOf(filteredLayer);
        if (index !== -1) {
          const nextLayer = this._layersConfig[
            previous ? index - 1 : index + 1
          ];
          return nextLayer;
        }
      } else {
        return filteredLayer;
      }
    } else {
      // if no layer for this year find nearest
      if (previous) {
        return this._layersConfig
          .slice()
          .reverse()
          .find(d => d.to <= year);
      } else {
        return this._layersConfig.find(d => d.from >= year);
      }
    }
  }

  private _processLayersMeta(layersMeta: HistoryLayerResource[]) {
    const layers: LayerMeta[] = [];
    layersMeta.forEach(({ resource }) => {
      const name = resource.display_name;
      const _match = name.match('from_(\\d{3,4})_to_(\\d{3,4}).*$');
      if (_match) {
        const [from, to] = _match.slice(1).map(x => Number(x));
        const allowedYear =
          this.options.fromYear && from < this.options.fromYear ? false : true;
        if (allowedYear) {
          this._minYear = (this._minYear > from ? from : this._minYear) || from;
          this._maxYear = (this._maxYear < to ? to : this._maxYear) || to;
          layers.push({ name, from, to, id: resource.id });
        }
      }
    });
    return layers;
  }

  private _processPointsMeta(pointsMeta: HistoryLayerResource[]): PointMeta[] {
    return pointsMeta.map(({ resource }) => {
      const name = resource.display_name;
      // const [year, month, day] = name.match('(\\d{4})-(\\d{2})-(\\d{2})*$').slice(1).map((x) => Number(x));
      // return { name, year, month, day, id: resource.id };
      const _match = name.match('(\\d{4})*$') as string[];
      const [year] = _match.slice(1).map(x => Number(x));
      return { name, year: year as number, id: resource.id };
    });
  }

  private _addEventsListeners() {
    if (this.controls.yearsStatPanelControl) {
      this.controls.yearsStatPanelControl.emitter.on(
        'update',
        ({ yearStat }) => {
          this._updateActiveMarker(yearStat);
        }
      );
    }
  }
}
