import proj4 from 'proj4';
import { Feature, MultiPoint, Point, FeatureCollection } from 'geojson';
import { Map, Marker } from 'mapbox-gl';

import { onlyUnique } from '../utils/utils';

import { App } from '../App';
import { AppMarkerMem, PointProperties } from '../interfaces';
import { getPointGeojson } from '../services/GetPointsService';

export class MarkerLayer {
  name!: string;
  baseUrl!: string;
  manualOpacity?: boolean;
  filterIdField?: string;
  opacity = 1;
  simplification = 8;

  private _markers: AppMarkerMem[] = [];

  constructor(protected app: App) {}

  updatePoint(pointId?: string) {
    if (pointId !== this.app.currentPointId) {
      if (this.app.currentPointId) {
        // this._removePoint(this.currentPointId);
        this._markers.forEach(x => {
          x.marker.remove();
        });
        this._markers = [];
      }
      this.app.currentPointId = pointId;
      if (pointId) {
        this._addPoint(pointId);
      }
    }
  }

  updateActiveMarker(yearsStat: { year: number; numb: number }) {
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
    const yearControl = this.app.controls.yearsStatPanelControl;
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
}
