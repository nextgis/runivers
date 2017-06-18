/* Bad globals =( */
var ngwUrl = 'http://histgeo.nextgis.com',
	sourceGroupId = 2,
	currentLayer = {};

// Projections	
proj4.defs([
  [
    'EPSG:4326',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'],
  [
    'EPSG:3857',
    ,'+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs'
  ]
]);

var map = L.map('map', {
    attributionControl: false,
    center: [60, 90], // starting position
    minZoom: 3,
    maxZoom: 17,
    zoom: 3
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	id: 'osm'
}).addTo(map);

$.ajax({
        url: ngwUrl+'/api/resource/?parent='+sourceGroupId,
        dataType: 'JSON',
        success: function(data){
        	loadGeoJSON(data);
        }
});

function getLayerIdByYear(layers, year) {
    var filteredLayer = layers.filter(function(d) {
        return ((year >= d.from) && (year < d.to))
    });
    return filteredLayer[0].id;
};

function loadGeoJSON(layersMeta) {
  var layersDescription = layersMeta.map(function(d) {
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

  // Filter by year
  var initLayerId = getLayerIdByYear(layersDescription, 1876);

  // Add initial layer to map
  updateLayer(initLayerId);
  $('#timeline').on('change', function(e) {
  	var year = $(this).val();
  	console.log(year);
  	var layerId = getLayerIdByYear(layersDescription, +year);
  	updateLayer(layerId);
  });
};

var simpleStyle = {
	weight: 2,
	color: '#7b4ea9',
	fillColor: '#7b4ea9',
	fillOpacity: .75
};

var highlightStyle = {
	weight: 3,
	color: '#DC185A',
	fillColor: '#7b4ea9',
	fillOpacity: .75
};

function updateLayer(layerId) {
  // Add initial layer to map
  var layerUrl = ngwUrl + '/api/resource/'+layerId+'/geojson';
	$.ajax({
	        url: layerUrl,
	        dataType: 'JSON',
	        success: function(data){
	        	var updatedLayer = L.geoJSON(data, {
	        		style: function (feature) {
	        			return simpleStyle;
	        		},
	        		coordsToLatLng: function(coords) {                    
	        			var latLng = proj4('EPSG:3857', 'EPSG:4326', coords);
	        			return L.latLng([latLng[1], latLng[0]]);
	        		},
                    onEachFeature: function (feature, layer) {
                        layer.on({
                            popupopen: function(e) { this.setStyle(highlightStyle); },
                            popupclose: function(e) { this.setStyle(simpleStyle); }
                        });
                    }
	        	}).bindPopup(function (layer) {
	        		//console.log(layer);
	        		var props = layer.feature.properties;
	        		var toolTip = 'Слой №' + layer.feature.id + '</br>' +
								  'cat: ' + props.cat + '</br>' +
								  'LwDate: ' + props.LwDate + '</br>' +
								  'LwDtAppr: ' + props.LwDtAppr + '</br>' +
								  'SrcData: ' + props.SrcData + '</br>' +
								  'UpDtAD: ' + props.UpDtAD + '</br>' +
								  'EventStart: ' + props.EventStart + '</br>' +
								  'UpperDat: ' + props.UpperDat + '</br>' +
								  'LineType: ' + props.LineType + '</br>' +
								  'UpDtRl: ' + props.UpDtRl + '</br>' +
								  'LineComnt: ' + props.LineComnt + '</br>' +
								  'LwDtAD: ' + props.LwDtAD + '</br>' +
								  'UpDtAppr: ' + props.UpDtAppr + '</br>';
	        		return toolTip;
	        	});
	        	if (!map.hasLayer(updatedLayer)) {
	        		map.removeLayer(currentLayer);
	        		currentLayer = updatedLayer;
	        		currentLayer.addTo(map);
	        		console.log('layer updated');
	        	}
	        	//console.log(map);
	        }
	});
};
