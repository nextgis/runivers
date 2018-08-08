import { Map, NavigationControl } from 'mapbox-gl';

export class WebMap {

  constructor(options) {
    this.map = null;
    this.options = Object.assign({}, options);

    // already registered layers, if true - it means on the map
    this._layers = {};
    this.isLoaded = false;
    this.create();
  }

  create() {
    this.map = new Map({
      container: this.options.target,
      center: [96, 63], // initial map center in [lon, lat]
      zoom: 2,
      style: {
        version: 8,
        name: 'Empty style',
        sources: {},
        layers: [],
      }
    });

    this.map.addControl(new NavigationControl(), 'top-left');
    this.map.once('load', () => {
      this.isLoaded = true;
    });
  }

  onMapLoad(cb, context) {
    if (this.isLoaded) { // map.loaded()
      cb.call(context);
    } else {
      this.map.once('load', () => {
        cb.call(context);
      });
    }
  }

  addMvtLayer(layerId, layerUrl) {

    // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6

    var idString = String(layerId);
    this.map.addLayer({
      'id': idString,
      'type': 'fill',
      'source-layer': idString,
      'source': {
        'type': 'vector',
        'tiles': [layerUrl]
      },
      'layout': {
        'visibility': 'none'
      },
      'paint': {
        'fill-color': 'red',
        'fill-opacity': 0.8,
        'fill-opacity-transition': {
          'duration': 0
        },
        'fill-outline-color': '#8b0000' // darkred
      }
    });
    this._layers[layerId] = false;
    return this._layers[layerId];
  }

  addTileLayer(layerName, url, params) {

    var tiles;
    if (params && params.subdomains) {
      tiles = params.subdomains.split('').map((x) => {
        var subUrl = url.replace('{s}', x);
        return subUrl;
      });
    } else {
      tiles = [url];
    }

    this.map.addLayer({
      id: layerName,
      type: 'raster',
      source: {
        'type': 'raster',
        // point to our third-party tiles. Note that some examples
        // show a "url" property. This only applies to tilesets with
        // corresponding TileJSON (such as mapbox tiles).
        'tiles': tiles,
        'tileSize': params && params.tileSize || 256
      }
    });
  }

  toggleLayer(layerId, status) {
    var exist = this._layers[layerId];
    if (exist === undefined) {
      const layerUrl = this.options.baseUrl + '/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';
      exist = this.addMvtLayer(layerId, layerUrl);
    }
    if (exist !== status) {
      this.map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
      this._layers[layerId] = status;
    }
  }
}
