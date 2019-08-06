import './App.css';

import WebMap from '@nextgis/webmap';
import MapboxglAdapter from '@nextgis/mapboxgl-map-adapter';
import QmsKit from '@nextgis/qms-kit';
import UrlParams from '@nextgis/url-runtime-params';

import { SliderControl } from './components/SliderControl';
import { Marker, Map } from 'mapbox-gl';
import { getLayers } from './services/GetLayersService';
import { getPoints, getPointGeojson } from './services/GetPointsService';

import { EventEmitter } from 'events';
import Color from 'color';

import proj4 from 'proj4';
import { Feature, MultiPoint, Point, FeatureCollection } from 'geojson';

import { formatArea, onlyUnique, copyText } from './utils/utils';
import { getAboutProjectLink, getAffiliatedLinks } from './components/Links/Links';

import {
  AppOptions,
  LayerMeta,
  PointProperties,
  PointMeta,
  AreaStat,
  HistoryLayerProperties,
  AppMarkerMem,
  HistoryLayerResource
} from './interfaces';

import { Controls } from './Controls';
import { TimeMap, TimeLayer } from './TimeMap';
import { Principalities01 } from './data/Principalities01';

export const urlParams = new UrlParams();

interface GetFillColorOpt {
  lighten?: number;
  darken?: number;
}

interface PopupContentField<T = any> {
  name?: string;
  field: T;
  getHtml?: (prop: any, props: any) => HTMLElement;
}

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
    this.createWebMap();
    this._buildApp();
  }

  createWebMap() {
    const options = { ...this.options };
    const webMap = new WebMap({
      mapAdapter: new MapboxglAdapter(),
      starterKits: [new QmsKit()]
    });

    webMap.create(options).then(() => {
      this.timeMap = new TimeMap(this.webMap, {
        baseUrl: this.options.baseUrl,
        filterIdField: 'fid',
        getFillColor: (opt: GetFillColorOpt) => this._getFillColor(opt),
        createPopupContent: (props: HistoryLayerProperties) => this._createPopupContent(props),
        addLayers: (url, id) => this._createTimeLayers(url, id)
      });
      webMap.addBaseLayer('QMS', {
        id: 'baselayer',
        qmsId: 2550,
        visibility: true
      });
    });

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
    this.timeMap.updateLayersColor();
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

  private _getTimeStop(year: number): string {
    const stop = this.options.timeStops.find(x => year < x.toYear);
    return stop ? stop.name : '';
  }

  private _createSlider() {
    const stepReady = (year: number, callback: (value: number) => void, previous: boolean) => {
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

  private _findYearInDateStr(dateStr: string): number | undefined {
    const datePattern = /(\d{4})/;
    const date = datePattern.exec(dateStr);
    if (date) {
      return Number(date[0]);
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

  private _stepReady(year: number, callback: (year: number) => void, previous?: boolean) {
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
      if (this.timeMap.currentLayerId !== String(nextLayer.id)) {
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

  private _createTimeLayers(url: string, id: string): Array<Promise<TimeLayer>> {
    const paint = {
      'fill-opacity': this.timeMap.opacity,
      'fill-opacity-transition': {
        duration: 0
      },
      // 'fill-outline-color': '#8b0000', // darkred
      // 'fill-outline-color': '#8b0000', // darkred
      'fill-color': this._getFillColor()
    };
    const selectedPaint = { ...paint, 'fill-color': this._getFillColor({ darken: 0.5 }) };
    const paintLine = {
      'line-opacity': this.timeMap.opacity,
      'line-opacity-transition': {
        duration: 0
      },
      'line-width': 1,
      'line-color': this._getFillColor({ darken: 0.5 })
    };
    const sourceLayer = id;
    const fillLayer = this.webMap.addLayer('MVT', {
      url,
      id,
      paint,
      selectedPaint,
      selectable: true,
      type: 'fill',
      nativePaint: true,
      labelField: 'name',
      sourceLayer
    }) as Promise<TimeLayer>;
    const boundLayer = this.webMap.addLayer('MVT', {
      url,
      id: id + '-bound',
      paint: paintLine,
      type: 'line',
      sourceLayer,
      nativePaint: true
    }) as Promise<TimeLayer>;
    return [fillLayer, boundLayer];
  }

  // TODO: Mapboxgl specific method
  private _addPoint(id: string) {
    getPointGeojson(id).then((data: FeatureCollection<MultiPoint, PointProperties>) => {
      const _many = data.features.length > 1 && data.features.map(x => x.properties.numb).filter(onlyUnique);
      const many = _many && _many.length > 1;
      data.features.forEach((marker: Feature<Point | MultiPoint, PointProperties>, i) => {
        const type = marker && marker.geometry && marker.geometry.type;
        if (type === 'MultiPoint') {
          const coordinates = marker.geometry.coordinates as Array<[number, number]>;
          coordinates.forEach(x => {
            this._addMarkerToMap(x, marker.properties, many);
          });
        } else if (type === 'Point') {
          this._addMarkerToMap(marker.geometry.coordinates as [number, number], marker.properties, many);
        }
      });
    });
  }

  // TODO: Mapboxgl specific method
  private _addMarkerToMap(coordinates: [number, number], properties: PointProperties, many: boolean) {
    const map: Map | undefined = this.webMap.mapAdapter.map;
    if (map) {
      // create a DOM element for the marker
      const element = document.createElement('div');
      let isActive;
      if (this.controls.yearsStatPanelControl) {
        const yearStat = this.controls.yearsStatPanelControl.yearStat;
        isActive = yearStat && yearStat.year === properties.year && yearStat.numb === properties.numb;
      }

      element.className = 'map-marker' + (isActive ? ' active' : ''); // use class `aсtive` for selected

      const elInner = document.createElement('div');
      elInner.className = 'map-marker--inner';
      elInner.innerHTML = many ? `<div class="map-marker__label">${properties.numb}</div>` : '';

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

  private _setMarkerActive(markerMem: AppMarkerMem, properties: PointProperties) {
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
      if (x.properties.year === yearsStat.year && x.properties.numb === yearsStat.numb) {
        x.element.classList.add('active');
      } else {
        x.element.classList.remove('active');
      }
    });
  }

  private _getFillColor(opt: GetFillColorOpt = {}) {
    const { lineColorLegend, lineColor } = this.options;
    if (lineColor && lineColorLegend) {
      const meta: any = ['match', ['get', 'status']];
      // update lineColor by legend colors
      lineColorLegend.forEach(x => {
        const linksToLineColors = x[3];
        linksToLineColors.forEach(y => {
          const _lineColor = lineColor.find(z => z[0] === y);
          if (_lineColor) {
            _lineColor[1] = x[1];
          }
        });
      });

      const colors = lineColor.reduce<Array<string | number>>((a, b) => {
        const [param, color] = b;
        let c = Color(color);
        if (param) {
          a.push(param);
        }
        if (opt.darken) {
          c = c.darken(opt.darken);
        }
        a.push(c.hex());
        return a;
      }, []);
      return meta.concat(colors);
    }
  }

  private _getLayerByYear(year: number, previous?: boolean): LayerMeta | undefined {
    const layers = this._layersConfig.filter(d => year >= d.from && year <= d.to);
    // return previous ? layers[0] : layers[layers.length - 1];
    return layers[layers.length - 1];
  }

  private _getLayerIdByYear(year: number, previous?: boolean): string | undefined {
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
  private _getNextLayer(year: number, previous?: boolean): LayerMeta | undefined {
    const filteredLayer = this._getLayerByYear(year);
    if (filteredLayer) {
      if (String(filteredLayer.id) === this.timeMap.currentLayerId) {
        const index = this._layersConfig.indexOf(filteredLayer);
        if (index !== -1) {
          const nextLayer = this._layersConfig[previous ? index - 1 : index + 1];
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
        const allowedYear = this.options.fromYear && from < this.options.fromYear ? false : true;
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

  private _createPopupContent(props: HistoryLayerProperties): HTMLElement {
    const fields: Array<{ name?: string; field: keyof HistoryLayerProperties }> = [
      // { name: 'Fid', field: 'fid' }
      // { field: 'name' }
      // { name: 'Наименование территории', field: 'name' },
      // { name: 'Дата возникновения', field: 'lwdate' },
      // { name: 'Дата исчезновения', field: 'updtrl' },
      // { name: 'Комментарий', field: 'linecomnt' },
    ];
    return this._createPropBlock(fields, props);
  }

  private _formatDateStr(str: string): string {
    const formated = str
      .split('-')
      .reverse()
      .join('.');
    return formated;
  }

  private _createPropElement(html: string, addClass: string) {
    const propBlock = document.createElement('div');
    propBlock.className = 'popup__propertyblock';
    propBlock.innerHTML = `<div class="popup__property--value${addClass ? ' ' + addClass : ''}" >${html}</div >`;
    return propBlock;
  }

  private _createPropBlock(
    fields: Array<PopupContentField<keyof HistoryLayerProperties>>,
    props: HistoryLayerProperties,
    headerField = 'name'
  ) {
    const block = document.createElement('div');
    const _fields: PopupContentField[] = [...fields];
    const _props: Record<string, any> = { ...props };
    const timeStop = this._getTimeStop(this.currentYear);
    if (timeStop === 'principalities') {
      this._addPrincipalitiesFields(_fields, _props);
    }

    if (_props[headerField]) {
      block.appendChild(
        this._createPropElement(`<h2>${_props[headerField]} <a class="feature-link">&#x1f517;</a></h2>`, 'prop header')
      );
    }

    _fields.forEach(x => {
      const prop = _props[x.field];
      if (prop) {
        const propBlock = document.createElement('div');
        propBlock.className = 'popup__propertyblock';
        propBlock.innerHTML = '';
        if (prop) {
          const content = x.getHtml ? x.getHtml(prop, _props) : this._createPropElement(prop, '');
          block.appendChild(content);
        }
      }
    });

    if (props.status) {
      block.innerHTML += this._createPropStatusHtml(props);
    }
    const featureLink = block.getElementsByClassName('feature-link')[0] as HTMLElement;
    if (featureLink) {
      featureLink.addEventListener('click', () => {
        let url = document.location.origin + document.location.pathname;
        url += `?year=${this.currentYear}&id=${props.fid}`;
        this.urlParams.set('id', String(props.fid));
        copyText(url);
      });
    }
    this._addPropShowDateClickEvent(block);
    return block;
  }

  private _findPrincipalities01(fid: number, year: number) {
    const princes = this.options.principalities01 || [];

    const prince = princes.find(x => {
      const upperdat = this._findYearInDateStr(x.upperdat);
      const lwdate = this._findYearInDateStr(x.lwdate);
      if (upperdat && lwdate) {
        return x.fid === fid && year <= upperdat && year >= lwdate;
      }
      return false;
    });

    return prince;
  }

  private _findPrincipalities02(fid: number, year: number) {
    const princes = this.options.principalities02 || [];

    const prince = princes.find(x => {
      const upperdat = this._findYearInDateStr(x.years_to);
      const lwdate = this._findYearInDateStr(x.years_from);
      if (upperdat && lwdate) {
        return fid === x.fid && year <= upperdat && year >= lwdate;
      }
      return false;
    });

    return prince;
  }

  private _addPrincipalitiesFields(fields: PopupContentField[], props: Record<string, any>) {
    const addProp = (value: any, opt: PopupContentField) => {
      fields.push({ name: opt.field, ...opt });
      props[opt.field] = value;
    };
    const fid = props.fid;
    if (fid) {
      const prince02 = this._findPrincipalities02(fid, this.currentYear);
      if (prince02) {
        addProp(prince02.ruler, { field: 'ruler' });
        // addProp(prince02.name, { field: 'name' });
      }
      const prince01 = this._findPrincipalities01(fid, this.currentYear);
      if (prince01) {
        const getHtml = (prop: keyof Principalities01, props: Principalities01) => {
          return this._createPropElement(`<a href="${props.desc_link}" target="_blank">${prop}</a>`, '');
        };
        props.desc_link = prince01.desc_link;
        addProp(prince01.name, { field: 'name_prince', getHtml });
      }
    }
  }

  private _createPropStatusHtml(props: HistoryLayerProperties) {
    let str = '';
    const alias = this.options.statusAliases && this.options.statusAliases[props.status];
    if (alias) {
      str += `
              <div class="popup__property--value status"><p>${alias}</p></div>
            `;
    }
    if (props.status > 0 && props.status < 6) {
      const lwdate = this._formatDateStr(props.lwdate);
      const updtrl = this._formatDateStr(props.updtrl || props.upperdat);
      if (lwdate && updtrl) {
        str += `
              <div class="popup__property--value dates">
                <span>
                  <span class="show-date">${lwdate}</span> -
                  <span class="show-date">${updtrl}</span>
                </span>
              </div>
            `;
      }
    }
    if (props.Area) {
      str += `
              <div class="popup__property--value area">
                <span>
                  ${formatArea(props.Area / 1000000)}
                </span>
              </div>
            `;
    }
    return str;
  }

  private _addPropShowDateClickEvent(block: HTMLElement) {
    const yearsLinks = block.querySelectorAll('.show-date');
    for (let fry = 0; fry < yearsLinks.length; fry++) {
      const link = yearsLinks[fry];
      link.addEventListener('click', () => {
        const year = this._findYearInDateStr(link.innerHTML);
        if (year) {
          this.updateByYear(year);
          if (this.slider && this.slider._slider) {
            this.slider._slider.set(year);
          }
        }
      });
    }
  }

  private _addEventsListeners() {
    if (this.controls.yearsStatPanelControl) {
      this.controls.yearsStatPanelControl.emitter.on('update', ({ yearStat }) => {
        this._updateActiveMarker(yearStat);
      });
    }
  }
}
