import proj4 from 'proj4';
import { Feature, MultiPoint, Point, FeatureCollection } from 'geojson';
import { Map, Marker } from 'mapbox-gl';

import { onlyUnique } from '../utils/utils';

import { App } from '../App';
import {
  AppMarkerMem,
  PointProperties,
  PointMeta,
  HistoryLayerResource,
} from '../interfaces';
import { getPointGeojson } from '../services/GetPointsService';

export class MarkerLayer {
  name!: string;
  baseUrl!: string;
  manualOpacity?: boolean;
  filterIdField?: string;
  opacity = 1;
  simplification = 8;

  private currentPointId?: string;
  private _markers: AppMarkerMem[] = [];
  private _pointsConfig: PointMeta[] = [];

  constructor(protected app: App) {}

  setPoints(points: HistoryLayerResource[]) {
    this._pointsConfig = this._processPointsMeta(points);
    const pointId = this._getPointIdByYear(this.app.timeMap.currentYear);
    if (pointId) {
      this.updatePoint(pointId);
    }
  }

  remove() {
    this._markers.forEach((x) => {
      x.marker.remove();
    });
    this._markers = [];
  }

  updatePoint(pointId?: string) {
    if (pointId !== this.currentPointId) {
      if (this.currentPointId) {
        this.remove();
      }
      this.currentPointId = pointId;
      if (pointId) {
        this._addPoint(pointId);
      }
    }
  }

  updateActiveMarker(yearsStat: { year: number; numb: number }) {
    if (yearsStat) {
      this._markers.forEach((x) => {
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
  }

  _getPointIdByYear(year: number): string | undefined {
    const point = this._getPointByYear(year);
    if (point) {
      return point && String(point.id);
    }
  }

  private _addPoint(id: string) {
    getPointGeojson(id).then(
      (data: FeatureCollection<MultiPoint, PointProperties>) => {
        const _many =
          data.features.length > 1 &&
          data.features.map((x) => x.properties.numb).filter(onlyUnique);
        const many = _many && _many.length > 1;
        data.features.forEach(
          (marker: Feature<Point | MultiPoint, PointProperties>, i) => {
            const type = marker && marker.geometry && marker.geometry.type;
            if (type === 'MultiPoint') {
              const coordinates = marker.geometry.coordinates as [
                number,
                number
              ][];
              coordinates.forEach((x) => {
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
    const map: Map | undefined = this.app.webMap.mapAdapter.map;
    if (map) {
      // create a DOM element for the marker
      const element = document.createElement('div');
      let isActive;
      if (this.app.controls.yearsStatPanelControl) {
        const yearStat = this.app.controls.yearsStatPanelControl.yearStat;
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

      element.addEventListener('click', (e) => {
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
    const yearControl = this.app.controls.yearsStatPanelControl;
    if (yearControl && yearControl.yearStats) {
      const yearStat = yearControl.yearStats.find((x) => {
        return x.year === properties.year && x.numb === properties.numb;
      });
      if (yearStat) {
        yearControl.updateYearStat(yearStat);
        yearControl.unBlock();
        yearControl.show();
      }
    }
  }

  private _getPointByYear(year: number): PointMeta | undefined {
    return this._pointsConfig.find((x) => x.year === year);
  }

  private _processPointsMeta(pointsMeta: HistoryLayerResource[]): PointMeta[] {
    return pointsMeta.map(({ resource }) => {
      const name = resource.display_name;
      // const [year, month, day] = name.match('(\\d{4})-(\\d{2})-(\\d{2})*$').slice(1).map((x) => Number(x));
      // return { name, year, month, day, id: resource.id };
      const _match = name.match('(\\d{4})*$') as string[];
      const [year] = _match.slice(1).map((x) => Number(x));
      return { name, year: year as number, id: resource.id };
    });
  }
}
