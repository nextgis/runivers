import { EventEmitter } from 'events';

import { Events } from '@nextgis/utils';

import CityImg from '../img/city.png';

import { BaseLayer } from './BaseLayer';

import type { App } from '../App';
import type { TimeLayer } from '../TimeMap/TimeGroup';
import type { TimeLayersGroupOptions } from '../TimeMap/TimeGroup';
import type { Map } from 'maplibre-gl';

export class CitiesLayer extends BaseLayer {
  emitter = new EventEmitter();
  private events: Events;

  constructor(
    protected app: App,
    options: Partial<TimeLayersGroupOptions>,
  ) {
    super(app, options);
    this.events = new Events(this.emitter);
    this.app.webMap.onLoad().then(() => this._registerMapboxImages());
  }

  addLayers(url: string, id: string): Promise<TimeLayer>[] {
    return this._createTimeLayers(url, id);
  }

  private _registerMapboxImages() {
    const map: Map | undefined = this.app.webMap.mapAdapter.map;
    if (map) {
      map.loadImage(CityImg).then((image) => {
        if (image.data) {
          map.addImage('city', image.data);
          this.emitter.emit('load-images');
        }
      });
    }
  }

  private _createTimeLayers(url: string, id: string): Promise<TimeLayer>[] {
    const sourceLayer = 'ngw:' + id;
    const label = this.events.onLoad('load-images').then(() => {
      const layer = this.app.webMap.addLayer('MVT', {
        url,
        id,
        order: this.order,
        // name: id,
        paint: {
          'text-color': 'rgba(255, 255, 255, 1)',
          'text-halo-color': 'rgba(49, 67, 90, .9)',
          'text-halo-width': 1,
        },
        layout: {
          'icon-image': 'city',
          'icon-allow-overlap': true,
          'icon-optional': true,
          'text-field': ['to-string', ['get', 'toponym']],
          'text-anchor': 'top',
          'text-size': 10,
          'text-font': ['Open Sans Bold'],

          'text-variable-anchor': ['top'],
          'text-radial-offset': 0.95,
          'text-line-height': 1.1,
          'text-letter-spacing': 0.06,
          'text-padding': 0,
          'text-justify': 'auto',
        },
        nativeOptions: { type: 'symbol' },
        nativePaint: true,
        type: 'point',
        sourceLayer,
      });
      return layer.then((x) => {
        return x;
      });
    }) as Promise<TimeLayer>;

    return [
      // layer,
      label,
    ];
  }
}
