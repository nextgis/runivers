/* Bad globals =( */
var ngwUrl = 'http://213.248.47.89',
    sourceGroupId = 343,
<<<<<<< Updated upstream
    currentLayer;

$.ajax({
        url: ngwUrl+'/api/resource/?parent='+sourceGroupId,
        dataType: 'JSON',
        success: function(data){
            loadGeoJSON(data);
        }
});
=======
    currentLayer, highlightLayer;

//http://213.248.47.89/api/resource/?parent=343

var overlay = d3.select("#md-overlay");
//overlay.classed('md-show', true);

queue()
  .defer(d3.csv, "data/years_stat.csv")
  .defer(d3.csv, "data/periods.csv")
  .defer(d3.json, ngwUrl+'/api/resource/?parent='+sourceGroupId)
  .await(ready);

function ready(error, territoriesStat, periodsData, layersMetaData) {
  if (error) throw error;

  territoriesStat.forEach(function (d) {
    d.year = +d.year;
    d.date = new Date(d.year, 0, 1);
    d.territories_gained = +d.territories_gained;
    d.territories_lost = +d.territories_lost;
  });

  periodsData.forEach(function (d) {
    d.start = new Date(+d.start, 0, 1);
    d.end = new Date(+d.end + 1, 0, 1);
  });

  var layers = processLayersMeta(layersMetaData);
  console.log(layers);

  currentLayerId = getLayerIdByYear(layers, 1462);

  var timeline = chroniton()
    .domain([new Date('1/1/1462'), new Date('1/1/2018')])
    .width(1100)
    .height(80)
    .playbackRate(0.02)
    //.setData(territoriesStat)
    //.setPeriods(periodsData)
    .labelFormat(d3.time.format("%Y"))
    .playButton(true);

  var timelineChange = function(d) {
    var year = d.getFullYear();
    //console.log(year);

    var layerId = getLayerIdByYear(layers, +year);
    if (layerId) {
        updateLayer(layerId);
    } else {
        console.log('No data for this year');
        Materialize.toast('Нет данных за этот год', 4000);
    }
  };

  timeline.on('change', timelineChange);
  timeline.on('changeDrag', debounce(timelineChange, 50));

  d3.select('#timeline')
    .call(timeline);
};

>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
    map.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
	    var props = feature.getProperties();
	    //console.log(props);
	    var toolTip = 'Слой №' + props.layer + '</br>' +
			  		  'LwDate: ' + props.lwdate + '</br>' +
			  		  'SrcData: ' + props.srcdata + '</br>' +
			  		  'EventStart: ' + props.eventstart + '</br>' +
			  		  'UpDtRl: ' + props.updtappr + '</br>' +
			  		  'LineComnt: ' + props.linecomnt + '</br>';
=======
    var features = map.getFeaturesAtPixel(evt.pixel);
    var feature = features[0];
    console.log(feature);
    var props = feature.getProperties();
	  //console.log(layer);
    //console.log(props);
	  var clickedId = props.id;
	  var toolTip = 'Слой №' + props.layer + '</br>' +
			  		  'LwDate: ' + props.LwDate + '</br>' +
			  		  'SrcData: ' + props.SrcData + '</br>' +
			  		  'EventStart: ' + props.EventStart + '</br>' +
			  		  'UpDtRl: ' + props.UpDtRl + '</br>' +
			  		  'LineComnt: ' + props.LineComnt + '</br>';
>>>>>>> Stashed changes

    var coordinate = evt.coordinate;
    popupContent.innerHTML = toolTip;
    overlay.setPosition(coordinate);
});

function processLayersMeta(layersMeta) {
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

  return layersDescription;
};

function initMap(layersDescription, initYear) {
  // Filter by year
  var initLayerId = getLayerIdByYear(layersDescription, initYear);
  // Add initial layer to map
  updateLayer(initLayerId);
};

function getLayerIdByYear(layers, year) {
    var filteredLayer = layers.filter(function(d) {
        return ((year >= d.from) && (year <= d.to))
    });
    var layerId = (filteredLayer.length != 0) ? filteredLayer[0].id : undefined;
    return layerId;
};

function updateLayer(layerId) {
  var layerUrl = ngwUrl+'/api/resource/' + layerId + '/{z}/{x}/{y}.mvt';
  var style = [
      new ol.style.Style({
          fill: new ol.style.Fill({
              color: [255, 255, 255, 1]
          }),
          stroke: new ol.style.Stroke({
              color: [51, 153, 204, 1],
              width: 1.25
          })
      })];

  var oldStyle = [
      new ol.style.Style({
          fill: new ol.style.Fill({
              color: [255, 255, 255, 0.4]
          }),
          stroke: new ol.style.Stroke({
              color: [51, 153, 204, 1],//[102, 204, 51, 0.4],
              width: 1.25
          })
      })];

      var vectorSource = new ol.source.VectorTile({
              format: new ol.format.MVT(),
              tileGrid: ol.tilegrid.createXYZ({maxZoom: 22}),
              tilePixelRatio: 16,
              url: layerUrl,
              wrapX: false
      });

      var updatedLayer = new ol.layer.VectorTile({
          source: vectorSource,
          style: style
      });
      updatedLayer.setZIndex(10);

      if (!currentLayer) {
        map.addLayer(updatedLayer);
        currentLayer = updatedLayer;
        prevLayer = currentLayer;
      } else {
        var updatedLayerProps = updatedLayer.getProperties(),
        currentLayerProps = currentLayer.getProperties();
        if (updatedLayerProps.source.urls[0] != currentLayerProps.source.urls[0]) {
            updatedLayer.setZIndex(10);
            //console.log('updateLayer', updatedLayer.getProperties());
            map.addLayer(updatedLayer);
            oldLayer = prevLayer;
            prevLayer = currentLayer;
            oldLayer.setZIndex(1);
            prevLayer.setZIndex(2);
            prevLayer.setStyle(oldStyle);
            oldLayer.setStyle(oldStyle);
            currentLayer = updatedLayer;
            // Remove rest old layers
            map.getLayers().forEach(function(layer, i) {
              if (layer) {
                var idx = layer.getZIndex();
                console.log(idx);
                if (idx == 1) { map.removeLayer(layer) };
              }
            });
            console.log('updated-current', currentLayer);
        }
    }
};
<<<<<<< Updated upstream
=======

function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this, args = arguments;
    var later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};
>>>>>>> Stashed changes
