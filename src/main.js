import './css/style.css';
import { Map, NavigationControl } from 'mapbox-gl';
import { Ngw } from 'ngw-connector';
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
var _loadedSources = {};
var _onDataLoadEvents = [];
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

map.on('data', _onData);

function onMapLoad(cb, context) {
  if (LOADED) { // map.loaded()
    cb.call(context);
  } else {
    map.once('load', function () {
      cb.call(context);
    });
  }
}

connector.makeQuery('/api/resource/?parent={id}', function (data) {
  onMapLoad(function () {
    layers = _processLayersMeta(data);
    updateLayerByYear(currentYear)
    slider = new SliderControl({
      min: minYear,
      max: maxYear,
      step: 1,
      animationStep: 10,
      value: currentLayerId,
      animationDelay: 10,
      nextStepReady: _nextStepReady
    })
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
  var layerId = _getLayerIdByYear(year);
  updateLayer(layerId);
}

function updateLayer(layerId) {
  var fromId = currentLayerId;
  currentLayerId = layerId;
  _switchLayer(fromId, layerId);
}

function _nextStepReady (year, callback) {
  var nextLayerId = _getLayerIdByYear(year);

  var next = function () {
    callback(year);
  }
  _preloadLayer(nextLayerId);
  var isLoading = currentLayerId === nextLayerId || _loadedSources[nextLayerId];
  if (isLoading) {
    next();
  } else {
    _onDataLoadEvents.push(next);
  }
}

function _preloadLayer(layerId) {
  _loadedSources[layerId] = _loadedSources[layerId] || false;
  if (!_loadedSources[layerId]) {
    _showLayer(layerId);
    map.setPaintProperty(layerId, 'fill-opacity', 0);
  }
}

function _switchLayer(fromId, toId) {
  if (fromId !== toId || !_loadedSources[toId]) {
    _showLayer(toId);
    map.setPaintProperty(currentLayerId, 'fill-opacity', 0);
  }
}

function _isHistoryLayer(layerId) {
  return _layers[layerId] !== undefined;
}

function _onData(data) {
  if (data.dataType === 'source') {
    if (_isHistoryLayer(data.sourceId)) {

      const isLoaded = data.isSourceLoaded;
      _loadedSources[data.sourceId] = isLoaded;
      if (isLoaded) {
        _hideNotCurrentLayers();
        map.setPaintProperty(currentLayerId, 'fill-opacity', 0.8);
        // map.off('data', _onData);
        for (var fry = 0; fry < _onDataLoadEvents.length; fry++) {
          var event = _onDataLoadEvents[fry];
          event();
        }
        _onDataLoadEvents = [];
      }
    }
  }
}

// function _checkLoading() {
//   for (var s in _loadedSources) {
//     if (_loadedSources.hasOwnProperty(s)) {
//       var source = _loadedSources[s];
//       if (_isHistoryLayer(s) && !source) { // || map.getLayer(s)
//         return false;
//       }
//     }
//   }
//   return true;
// }

function _hideNotCurrentLayers() {
  for (var l in _layers) {
    if (_layers.hasOwnProperty(l)) {
      if (l !== String(currentLayerId) && _layers[l]) {
        _hideLayer(l);
      }
    }
  }
}

function _hideLayer(layerId) {
  _toggleLayer(layerId, false)
}

function _showLayer(layerId) {
  _toggleLayer(layerId, true)
}

function _toggleLayer(layerId, status) {
  var exist = _layers[layerId];
  if (exist === undefined) {
    exist = _addMvtLayer(layerId);
  }
  if (exist !== status) {
    map.setLayoutProperty(layerId, 'visibility', status ? 'visible' : 'none');
    _layers[layerId] = status;
  }
}

function _addMvtLayer(layerId) {

  // read about https://blog.mapbox.com/vector-tile-specification-version-2-whats-changed-259d4cd73df6
  // var layerUrl = ngwUrl+'/api/resource/LAYER_ID/{z}/{x}/{y}.mvt';
  var layerUrl = ngwUrl + '/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';

  var idString = String(layerId);
  map.addLayer({
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
  _layers[layerId] = false;
  return _layers[layerId];
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

function _getLayerIdByYear(year) {
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
