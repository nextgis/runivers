import './App.css';

import WebMap from '@nextgis/webmap';
import MapboxglAdapter from '@nextgis/mapboxgl-map-adapter';
import QmsKit from '@nextgis/qms-kit';
import UrlParams from '@nextgis/url-runtime-params';

import { SliderControl } from './components/SliderControl';
import { Popup, Marker, Map } from 'mapbox-gl';
import { getLayers } from './services/GetLayersService';
import { getPoints, getPointGeojson } from './services/GetPointsService';

import { EventEmitter } from 'events';
import Color from 'color';

import proj4 from 'proj4';
import { Feature, MultiPoint, Point, FeatureCollection } from 'geojson';

import { formatArea, onlyUnique } from './utils/utils';
import { getAboutProjectLink } from './components/Links/Links';

import {
  AppOptions,
  LayerMeta,
  PointProperties,
  PointMeta,
  AreaStat,
  HistoryLayerProperties
} from './interfaces';

import { Controls } from './Controls';

export class App {

  options: AppOptions = {
    target: '#app'
  };
  currentYear: number;
  slider: SliderControl;

  webMap: WebMap;

  currentLayerId: string;
  currentPointId: string;

  urlParams = new UrlParams();

  emitter = new EventEmitter();

  _headerElement: HTMLElement;

  controls: Controls;


  private _minYear: number;
  private _maxYear: number;
  private _popup: Popup;

  private _layersConfig: LayerMeta[] = [];
  private _onDataLoadEvents: Array<() => void> = [];
  private _layersLoaded: { [layerId: string]: boolean } = {};

  private _pointsConfig: PointMeta[] = [];
  private _markers: Marker[] = [];

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
    this.currentYear = this.options.currentYear;
    this.createWebMap();
    this._buildApp();
  }

  createWebMap() {
    const options = { ...this.options };
    const webMap = new WebMap({
      mapAdapter: new MapboxglAdapter(),
      starterKits: [new QmsKit()],
    });

    webMap.create(options).then(() => {

      // webMap.addBaseLayer('osm', 'OSM');
      webMap.addBaseLayer('QMS', {
        id: 'baselayer',
        qmsid: 487
      }).then((layer) => {
        webMap.showLayer(layer.name);
      });

      webMap.mapAdapter.emitter.on('data-loaded', (data) => this._onData(data));

    });

    this.webMap = webMap;

    return webMap;
  }

  updateByYear(year: number, previous?: boolean) {
    const layerId = this._getLayerIdByYear(year, previous);
    this.updateLayer(layerId);

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
    const fromId = this.currentLayerId;
    this.currentLayerId = layerId;
    this._switchLayer(fromId, layerId);
  }

  updatePoint(pointId: string) {
    if (pointId !== this.currentPointId) {
      if (this.currentPointId) {
        // this._removePoint(this.currentPointId);
        this._markers.forEach((x) => {
          x.remove();
        });
      }
      this.currentPointId = pointId;
      if (pointId) {
        this._addPoint(pointId);
      }
    }
  }

  // region App control
  _buildApp() {
    getLayers((data) => {
      this._layersConfig = this._processLayersMeta(data);
      this._layersConfig.sort((a, b) => a.from < b.from ? -1 : 1);

      this.slider = this._createSlider();

      this._headerElement = this._createHeader();
      this.controls = new Controls(this);
      this.controls.addControls();

      this.webMap.mapAdapter.onMapLoad(() => {
        this.updateByYear(this.currentYear);
      });
      this.emitter.emit('build');
    });
    getPoints().then((points) => {
      this._pointsConfig = this._processPointsMeta(points);
      const pointId = this._getPointIdByYear(this.currentYear);
      this.updatePoint(pointId);
    });

  }

  _createSlider() {
    const slider = new SliderControl({
      min: this._minYear,
      max: this._maxYear,
      step: 1,
      animationStep: this.options.animationStep,
      value: this.currentYear,
      animationDelay: this.options.animationDelay,
      stepReady: (year, callback, previous) => this._stepReady(year, callback, previous)
    });
    slider.emitter.on('change', (year) => {
      // may be updated in _stepReady method
      if (year !== this.currentYear) {
        this.currentYear = year;
        this.updateByYear(year);
      }
    });

    const container = this.webMap.mapAdapter.getContainer();
    container.appendChild(slider.onAdd(this.webMap));

    return slider;
  }

  _createHeader() {
    const header = document.createElement('div');
    header.className = 'font-effect-shadow-multiple app-header';
    const headerText = document.createElement('span');
    headerText.innerHTML = `Границы России ${this._minYear}-${this._maxYear} гг.`;
    header.appendChild(headerText);
    header.appendChild(getAboutProjectLink());

    const mapContainer = this.webMap.mapAdapter.getContainer();

    mapContainer.appendChild(header);

    return header;
  }

  _updatePeriodBlockByYear(year: number, areaStat: AreaStat) {
    const period = this._findPeriodByYear(year);
    this.controls.periodsPanelControl.updatePeriod(period, areaStat);
  }

  _findPeriodByYear(year: number) {
    const periods = this.options.periods || [];
    const period = periods.find((x) => (year >= x.years_from) && (year <= x.years_to));
    return period;
  }

  _updateYearStatBlockByYear(year: number, areaStat: AreaStat) {
    const yearStat = this._findYearStatsByYear(year);
    this.controls.yearsStatPanelControl.updateYearStats(yearStat, areaStat);
  }

  _findYearInDateStr(dateStr: string): number {
    const datePattern = /(\d{4})/;
    const date = datePattern.exec(dateStr);
    return Number(date[0]);
  }

  _findAreaStatByYear(year: number): AreaStat {
    return this.options.areaStat.find((x) => x.year === year);
  }

  _findYearStatsByYear(year: number) {
    year = Number(year);
    const yearsStat = this.options.yearsStat || [];
    const yearStat = yearsStat.filter((x) => {
      // const from = this._findYearInDateStr(x.date_from);
      // let included = false;
      // if (x.date_to) {
      //   const to = this._findYearInDateStr(x.date_to);
      //   included = year >= from && year <= to;
      // } else {
      //   included = year === from;
      // }
      // return included;
      // return year === from;
      return year === x.year;
    });
    // console.log(yearStat);
    return yearStat;
  }
  // endregion

  // region Map control
  async _switchLayer(fromId: string, toId: string) {
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

  _stepReady(year: number, callback: (year: number) => void, previous?: boolean) {
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
      if (this.currentLayerId !== String(nextLayer.id)) {
        this._onDataLoadEvents.push(next);
        this.updateLayer(String(nextLayer.id));
      } else {
        next();
      }
      this.updateDataByYear(y);
    } else {
      callback(previous ? this._minYear : this._maxYear);
    }
  }

  _isHistoryLayer(layerId) {
    return !this.webMap.isBaseLayer(layerId);
  }

  _onData(data) {
    const layerId = data.target;
    const loadedYet = this._layersLoaded[layerId];
    const isCurrentLayer = data.target === this.currentLayerId || data.target === this.currentLayerId + '-bound';
    if (!loadedYet && this._isHistoryLayer(data.target) && isCurrentLayer) {
      this._layersLoaded[layerId] = true;
      this._onSourceIsLoaded();
    }
  }

  _onSourceIsLoaded() {
    if (this._layersLoaded[this.currentLayerId] && this._layersLoaded[this.currentLayerId + '-bound']) {
      this._hideNotCurrentLayers();
      this._setLayerOpacity(this.currentLayerId, 0.8);
      for (let fry = 0; fry < this._onDataLoadEvents.length; fry++) {
        const event = this._onDataLoadEvents[fry];
        event();
      }
      this._onDataLoadEvents = [];
    }
  }

  _hideNotCurrentLayers() {
    const layers = this.webMap.getLayers();
    layers.forEach((l) => {
      if (!this.webMap.isBaseLayer(l)) {
        const isSkipLayer = l === this.currentLayerId || l === this.currentLayerId + '-bound';
        if (!isSkipLayer && this.webMap.isLayerOnTheMap(l)) {
          this._hideLayer(l);
        }
      }
    });
  }

  _hideLayer(layerId) {
    this._toggleLayer(layerId, false);
  }

  _showLayer(id): Promise<any> {
    const toggle = () => {
      this.webMap.toggleLayer(id, true);
      this.webMap.toggleLayer(id + '-bound', true);
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

  _setLayerOpacity(id: string, value: number) {
    this.webMap.setLayerOpacity(id, value);
    this.webMap.setLayerOpacity(id + '-bound', value);
  }

  // TODO: Mapboxgl specific method
  _addPoint(id: string) {

    getPointGeojson(id).then((data: FeatureCollection<MultiPoint, PointProperties>) => {
      const _many = data.features.length > 1 &&
        data.features.map((x) => x.properties.numb)
          .filter(onlyUnique);
      const many = _many.length > 1;
      data.features.forEach((marker: Feature<Point | MultiPoint, PointProperties>, i) => {
        const type = marker && marker.geometry && marker.geometry.type;
        if (type === 'MultiPoint') {
          const coordinates = marker.geometry.coordinates as Array<[number, number]>;
          coordinates.forEach((x) => {
            this._addMarkerToMap(x, marker.properties, many);
          });
        } else if (type === 'Point') {
          this._addMarkerToMap(marker.geometry.coordinates as [number, number], marker.properties, many);
        }
      });
    });
  }

  // TODO: Mapboxgl specific method
  _addMarkerToMap(coordinates: [number, number], properties: PointProperties, many: boolean) {
    const map: Map = this.webMap.mapAdapter.map;
    // create a DOM element for the marker
    const el = document.createElement('div');
    el.className = 'map-marker'; // use class `aсtive` for selected

    const elInner = document.createElement('div');
    elInner.className = 'map-marker--inner';
    elInner.innerHTML = many ? `<div class="map-marker__label">${properties.numb}</div>` : '';

    el.appendChild(elInner);

    const coordEPSG4326 = proj4('EPSG:3857').inverse(coordinates);
    // add marker to map
    const m = new Marker(el);
    this._markers.push(m);
    m.setLngLat(coordEPSG4326);

    m.addTo(map);
  }

  _updateLayersColor() {
    for (const l in this._layersLoaded) {
      if (this._layersLoaded.hasOwnProperty(l)) {
        if (l.indexOf('-bound') !== -1) {
          this.webMap.mapAdapter.map.setPaintProperty(l, 'line-color', this._getFillColor({ darken: 0.5 }));
        } else {
          this.webMap.mapAdapter.map.setPaintProperty(l, 'fill-color', this._getFillColor());
        }
      }

    }
  }

  _getFillColor(opt: {
    lighten?: number,
    darken?: number
  } = {}) {

    const meta = [
      'match',
      ['get', 'status']
    ];
    const colors = this.options.lineColor.reduce((a, b) => {
      const [param, color] = b;
      const c = Color(color);
      if (param) {
        a.push(param);
      }
      if (opt.darken) {
        c.darken(opt.darken);
      }
      a.push(c.hex());
      return a;
    }, []);
    return meta.concat(colors);
  }

  _addLayer(url: string, id: string): Promise<any> {
    const paint = {
      'fill-opacity': 0.8,
      'fill-opacity-transition': {
        duration: 0
      },
      // 'fill-outline-color': '#8b0000', // darkred
      'fill-color': this._getFillColor()
    };
    const paintLine = {
      'line-opacity': 0.8,
      'line-opacity-transition': {
        duration: 0
      },
      'line-width': 1,
      'line-color': this._getFillColor({ darken: 0.5 }),
    };
    return Promise.all([
      this.webMap.addLayer('MVT', { url, id, paint }),
      this.webMap.addLayer('MVT', {
        url,
        'id': (id + '-bound'),
        'paint': paintLine,
        'type': 'line',
        'source-layer': id
      }),
    ]);
  }

  _toggleLayer(id, status) {
    this._layersLoaded[id] = false;
    this._layersLoaded[id + '-bound'] = false;
    if (status) {
      this._showLayer(id);
      this._showLayer(id + '-bound');
    } else {
      this.webMap.removeLayer(id);
      this.webMap.removeLayer(id + '-bound');
    }

  }

  _getLayerByYear(year: number, previous?: boolean): LayerMeta | false {
    const layers = this._layersConfig.filter((d) => ((year >= d.from) && (year <= d.to)));
    // return previous ? layers[0] : layers[layers.length - 1];
    return layers[layers.length - 1];
  }

  _getLayerIdByYear(year: number, previous?: boolean): string {
    const filteredLayer = this._getLayerByYear(year, previous);
    return filteredLayer && String(filteredLayer.id);
  }

  _getPointByYear(year: number): PointMeta {
    return this._pointsConfig.find((x) => x.year === year);
  }

  _getPointIdByYear(year: number): string {
    const point = this._getPointByYear(year);
    return point && point.id;
  }

  // get next or previous territory changed layer
  _getNextLayer(year: number, previous?: boolean): LayerMeta | false {
    const filteredLayer = this._getLayerByYear(year);
    if (filteredLayer) {
      if (String(filteredLayer.id) === this.currentLayerId) {
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
        return this._layersConfig.slice().reverse().find((d) => d.to <= year);
      } else {
        return this._layersConfig.find((d) => d.from >= year);
      }
    }
    return false;
  }

  _processLayersMeta(layersMeta) {
    const layers: LayerMeta[] = [];
    layersMeta.forEach(({ resource }) => {
      const name = resource.display_name;
      const [from, to] = name.match('from_(\\d{4})_to_(\\d{4}).*$').slice(1).map((x) => Number(x));
      const allowedYear = (this.options.fromYear && from < this.options.fromYear) ? false : true;
      if (allowedYear) {
        this._minYear = (this._minYear > from ? from : this._minYear) || from;
        this._maxYear = (this._maxYear < to ? to : this._maxYear) || to;
        layers.push({ name, from, to, id: resource.id });
      }
    });
    return layers;
  }

  _processPointsMeta(pointsMeta): PointMeta[] {
    return pointsMeta.map(({ resource }) => {
      const name = resource.display_name;
      // const [year, month, day] = name.match('(\\d{4})-(\\d{2})-(\\d{2})*$').slice(1).map((x) => Number(x));
      // return { name, year, month, day, id: resource.id };
      const [year] = name.match('(\\d{4})*$').slice(1).map((x) => Number(x));
      return { name, year, id: resource.id };
    });
  }

  _createPopupContent(props: HistoryLayerProperties): HTMLElement {
    const fields = [
      // { name: 'Fid', field: 'fid' },
      { field: 'name' },
      // { name: 'Наименование территории', field: 'name' },
      // { name: 'Дата возникновения', field: 'lwdate' },
      // { name: 'Дата исчезновения', field: 'updtrl' },
      // { name: 'Комментарий', field: 'linecomnt' },
    ];
    return this._createPropBlock(fields, props);
  }

  _formatDateStr(str: string): string {
    const formated = str.split('-').reverse().join('.');
    return formated;
  }

  _createPropBlock(fields: Array<{ name?: string, field: string }>, props: HistoryLayerProperties) {
    const block = document.createElement('div');

    fields.forEach((x) => {
      const prop = props[x.field];
      if (prop) {
        const propBlock = document.createElement('div');
        propBlock.className = 'popup__propertyblock';
        propBlock.innerHTML = '';
        if (name) {
          propBlock.innerHTML += `<div class="popup__property--name">${x.name}</div>`;
        }
        propBlock.innerHTML = `
          <div class="popup__property--value prop"><h2>${prop}</h2></div>
        `;
        if (props.status) {
          const alias = this.options.statusAliases[props.status];
          if (alias) {
            propBlock.innerHTML += `
              <div class="popup__property--value status"><p>${alias}</p></div>
            `;
          }
          if (props.status > 0 && props.status < 6) {
            propBlock.innerHTML += `
              <div class="popup__property--value dates">
                <span>
                  ${this._formatDateStr(props.lwdate)} - ${this._formatDateStr(props.updtrl)}
                </span>
              </div>
            `;
          }
          if (props.Area) {
            propBlock.innerHTML += `
              <div class="popup__property--value area">
                <span>
                  ${formatArea(props.Area / 1000000)}
                </span>
              </div>
            `;
          }
        }
        block.appendChild(propBlock);
      }
    });
    return block;
  }
  // endregion

  private _addLayerListeners(layerId: string) {
    const map = this.webMap.mapAdapter.map;

    map.on('click', layerId, (e) => {
      const point = e.point;
      const width = 5;
      const height = 5;
      // Find all features within a bounding box around a point

      const features = map.queryRenderedFeatures([
        [point.x - width / 2, point.y - height / 2],
        [point.x + width / 2, point.y + height / 2],
      ], { layers: [layerId] });
      const feature = features[0];
      if (feature.properties.status && feature.properties.status < 6) {
        const html = this._createPopupContent(feature.properties);
        const str = html.innerHTML;
        if (str) {
          this._popup = new Popup()
            .setLngLat(e.lngLat)
            .setHTML(str)
            .addTo(map);
        }
      }
    });

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.on('mouseenter', layerId, (e) => {
      map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    map.on('mouseleave', layerId, () => {
      map.getCanvas().style.cursor = '';
      // this._removePopup();
    });
  }

  private _removePopup() {
    if (this._popup) {
      this._popup.remove();
      this._popup = null;
    }
  }

  private _removeLayerListeners(layerId: string) {
    const map = this.webMap.mapAdapter.map;
    // map.off('click', layerId);

    // Change the cursor to a pointer when the mouse is over the places layer.
    map.off('mouseenter', layerId);

    // Change it back to a pointer when it leaves.
    map.off('mouseleave', layerId);

    map.getCanvas().style.cursor = '';
    this._removePopup();
  }
}
