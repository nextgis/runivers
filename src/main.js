import './css/style.css';
import { Map, NavigationControl } from 'mapbox-gl';
import { Ngw } from '../../ngw-connector/index';
import { SliderControl } from './SliderControl';

/* Bad globals =( */
var ngwUrl = 'http://213.248.47.89';
var sourceGroupId = 343;
// var currentLayer, highlightLayer;

var currentLayerId = 974;
var currentYear = 1301;

var layers = [];
var slider;
var minYear;
var maxYear;

// already registered layers, if true - it means on the map
var _layers = {};
var LOADED = false;

var connector = new Ngw({
  baseUrl: ngwUrl
});

var map = new Map({
  container: 'map',
  center: [96, 63], // initial map center in [lon, lat]
  zoom: 2,
  // transformRequest: function (url, type) {
  //   if (type === 'Vector', url.match('.mvt')) {
  //     url = url.replace('LAYER_ID', currentLayerId);
  //   }
  //   return {url: url};
  // },
  style: {
    version: 8,
    name: 'Empty style',
    sources: {},
    layers: [],
  }
});

map.addControl(new NavigationControl());

function onMapLoad(calback, context) {
  if (LOADED) { // map.loaded()
    calback.call(context);
  } else {
    map.once('load', function () {
      calback.call(context);
    });
  }
}

connector.makeQuery('/api/resource/?parent={id}', function (data) {
  onMapLoad(function () {
    layers = _processLayersMeta(data);
    updateLayerByYear(currentYear)
    slider = new SliderControl({ min: minYear, max: maxYear, step: 1, value: currentLayerId })
    slider.emitter.on('change', function (year) {
      currentYear = year;
      updateLayerByYear(year);
    })
    map.addControl(slider, 'bottom-left');
  });
}, {
  id: sourceGroupId
});

function updateLayerByYear(year) {
  var layerId = _getLayerIdByYear(layers, year);
  updateLayer(layerId);
}

function updateLayer(layerId) {

  var currentLayer = _layers[currentLayerId];
  if (currentLayer) {
    _hideLayer(currentLayerId);
    _layers[currentLayerId] = false;
  }
  var exist = _layers[layerId];
  currentLayerId = layerId;
  if (exist !== undefined) {
    // if exist - layer already on the map
    if (!exist) {
      _showLayer(layerId);
      _layers[layerId] = true;
    }
  } else {
    _addMvtlayer(layerId);
    _layers[layerId] = true;
  }

}

function _hideLayer(layerId) {
  map.setLayoutProperty(layerId, 'visibility', 'none');
}

function _showLayer(layerId) {
  map.setLayoutProperty(layerId, 'visibility', 'visible');
}

function _addMvtlayer(layerId) {

  // red about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
  // var layerUrl = ngwUrl+'/api/resource/LAYER_ID/{z}/{x}/{y}.mvt';
  var layerUrl = ngwUrl + '/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';

  map.addLayer({
    'id': String(currentLayerId),
    'type': 'fill',
    'source-layer': String(currentLayerId),
    'source': {
      'type': 'vector',
      'tiles': [layerUrl]
    },
    'paint': {
      'fill-color': 'red',
      'fill-opacity': 0.8
    }
  });
}

function _addTileLayer(layerName, url, params) {
  // this.map.addSource(layerName, params);

  var tiles;
  if (params && params.subdomains) {
    tiles = params.subdomains.split('').map((x) => {
      var subUrl = url.replace('{s}', x);
      return subUrl;
    });
  } else {
    tiles = [url];
  }

  map.addLayer({
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

function _getLayerIdByYear(layers, year) {
  var filteredLayer = layers.filter(function (d) {
    return ((year >= d.from) && (year <= d.to))
  });
  var layerId = (filteredLayer.length != 0) ? filteredLayer[0].id : undefined;
  return layerId;
}


function _processLayersMeta(layersMeta) {
  var layersDescription = layersMeta.map(function (d) {
    var layer = {},
      resource = d.resource,
      re = new RegExp('from_(\\d{4})_to_(\\d{4}).*$');
    var layerName = resource.display_name;
    layer.name = resource.display_name;
    layer.id = resource.id;
    layer.from = +layerName.replace(re, '$1');
    layer.to = +layerName.replace(re, '$2');
    return layer;
  });
  //console.log(layersDescription);
  var fromYears = layersDescription.map(function (x) {
    return x.from;
  });
  var toYears = layersDescription.map(function (x) {
    return x.to;
  });
  minYear = (fromYears.sort(function (a, b) {
    return a - b;
  }))[0];
  maxYear = (toYears.sort(function (a, b) {
    return b - a;
  }))[0];
  console.log('[min: ' + minYear + ', ' + 'max: ' + maxYear + ']');

  return layersDescription;
}

map.on('load', function () {
  LOADED = true;
  _addTileLayer('osm', 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright" target="_blank">OpenStreetMap</a> contributors',
    subdomains: 'abc'
  });
})

window.map = map;
