/* Bad globals =( */
var ngwUrl = 'http://dev.nextgis.com/practice2',
    sourceGroupId = 160,
    currentLayer;

$.ajax({
        url: ngwUrl+'/api/resource/?parent='+sourceGroupId,
        dataType: 'JSON',
        success: function(data){
            loadGeoJSON(data);
        }
});

var popupContainer = document.getElementById('popup');
var popupContent = document.getElementById('popup-content');
var popupCloseBtn = document.getElementById('popup-closer');

var osmSource = new ol.source.OSM();

var overlay = new ol.Overlay({
  element: popupContainer,
  autoPan: true,
  autoPanAnimation: {
    duration: 250
  }
});

popupCloseBtn.onclick = function() {
      overlay.setPosition(undefined);
      popupCloseBtn.blur();
      return false;
};

var map = new ol.Map({
    target: 'map',
    layers: [
        new ol.layer.Tile({
            opacity: 0.8,
            source: osmSource
        })
    ],
    overlays: [overlay],
    view: new ol.View({
        center: ol.proj.fromLonLat([45, 45]),
        zoom: 2
    })
});


map.on('singleclick', function(evt) {
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
	    var props = feature.getProperties();
	    //console.log(props);
	    var toolTip = 'Слой №' + props.layer + '</br>' +
			  		  'LwDate: ' + props.LwDate + '</br>' +
			  		  'SrcData: ' + props.SrcData + '</br>' +
			  		  'EventStart: ' + props.EventStart + '</br>' +
			  		  'UpDtRl: ' + props.UpDtRl + '</br>' +
			  		  'LineComnt: ' + props.LineComnt + '</br>';

        var coordinate = evt.coordinate;
        popupContent.innerHTML = toolTip;
        overlay.setPosition(coordinate);
    });
});


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
  //console.log(layersDescription);
  var fromYears = layersDescription.map(function(x) { return x.from; });
  var toYears = layersDescription.map(function(x) { return x.to; });
  var minYear = (fromYears.sort(function(a, b) { return a - b;}))[0];
  var maxYear = (toYears.sort(function(a, b) { return b - a;}))[0];
  console.log('[min: '+minYear+', '+'max: '+maxYear+']');

  // Set timeline to extent
  $('#timeline').attr('min', minYear);
  $('#timeline').attr('max', maxYear);

  // Filter by year
  var initLayerId = getLayerIdByYear(layersDescription, 1876);

  // Add initial layer to map
  updateLayer(initLayerId);
  $('#timeline').on('change', function(e) {
    var year = $(this).val();
    console.log(year);
    var layerId = getLayerIdByYear(layersDescription, +year);
    if (layerId) {
        updateLayer(layerId);
    } else {
        //map.removeLayer(currentLayer);
        console.log('No data for this year');
        Materialize.toast('Нет данных за этот год', 4000);
    }
  });
};

function getLayerIdByYear(layers, year) {
    var filteredLayer = layers.filter(function(d) {
        return ((year >= d.from) && (year <= d.to))
    });
    var layerId = (filteredLayer.length != 0) ? filteredLayer[0].id : undefined;
    return layerId;
};

function updateLayer(layerId) {
  var layerUrl = 'http://dev.nextgis.com/practice2/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';
  var style = [
      new ol.style.Style({
          fill: new ol.style.Fill({
              color: 'rgba(255,255,255,0.4)'
          }),
          stroke: new ol.style.Stroke({
              color: '#3399CC',
              width: 1.25
          })
      })];

      var updatedLayer = new ol.layer.VectorTile({
          source: new ol.source.VectorTile({
              format: new ol.format.MVT(),
              tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
              tilePixelRatio: 16,
              url: layerUrl,
              wrapX: false
          }),
          style: style
      });

      if (!currentLayer) {
        currentLayer = updatedLayer;
        map.addLayer(currentLayer);
        //console.log('layer added');
      } else {
        var updatedLayerProps = updatedLayer.getProperties(),
        currentLayerProps = currentLayer.getProperties();
        if (updatedLayerProps.source.urls[0] != currentLayerProps.source.urls[0]) {
            map.removeLayer(currentLayer);
            currentLayer = updatedLayer;
            map.addLayer(currentLayer);
            //console.log('layer updated');
        }
    }
};
