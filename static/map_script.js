var json_map = '';
var map = 0;
var info = 0;
var legendxx = 0;

function requestMap() {
	$.ajax({
		type: "GET",
		url: "request_json_map",
		data: {
			"type": document.getElementById('population_id').value,
		},
		success: function (data) {
			json_map = data["map"];
			drawMap();

		},
	});
}


function drawMap()
    {
    	map = L.map('map');

    	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
			maxZoom: 11,
			attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			  'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
			id: 'mapbox/light-v9',
			tileSize: 512,
			zoomOffset: -1,
		}).addTo(map);

    	// control that shows state info on hover
		info = L.control();

		info.onAdd = function (map) {
		  this._div = L.DomUtil.create('div', 'infox');
		  this.update();
		  return this._div;
		};

		info.update = function (props) {
		  this._div.innerHTML = 'Cat COVID-19 INFO<br><br>' +  (props ?
			'<b>' + props.NOMPROV + '</b><br />' + props.AREAPROV + ' people / mi<sup>2</sup>'
			: 'CAT PROV');
		};

		info.addTo(map);



		// Define the geojson layer and add it to the map
		L.geoJSON(json_map, {

		  style: function (feature) {
			return feature.properties && feature.properties.style;
		  },
		}).addTo(map);

		let comarquestCatalunyaLayer = L.geoJson(json_map, {
		  weight: 3,
		  color: '#244422'
		}).addTo(map);
		//comarquestCatalunyaLayer.bindPopup('Comarquest de Catalunya');
		//console.log(data)
		//comarquestCatalunyaLayer(data.Feature).addTo(map);
		map.fitBounds(comarquestCatalunyaLayer.getBounds());
		map.setZoom(8);



		// get color depending on population density value
		function getColor(d) {
		  return d > 1000 ? '#800026' :
			d > 500  ? '#BD0026' :
			  d > 200  ? '#E31A1C' :
				d > 100  ? '#FC4E2A' :
				  d > 50   ? '#FD8D3C' :
					d > 20   ? '#FEB24C' :
					  d > 10   ? '#FED976' :
						'#FFEDA0';
		}

		function style(feature) {
		  return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		  };
		}


		function highlightFeature(e) {
		  var layer = e.target;

		  layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		  });

		  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		  }

		  info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
		  geojson.resetStyle(e.target);
		  info.update();
		}

		function zoomToFeature(e) {
		  map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
		  layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		  });
		}

		geojson = L.geoJson(json_map, {
		  style: style,
		  onEachFeature: onEachFeature
		}).addTo(map);

		var legend = L.control({position: 'bottomright'});
		legendxx = legend;

		legend.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'infox legend'),
				grades = [0, 10, 20, 50, 100, 200, 500, 1000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legend.addTo(map);


    }


    function redrawMap()
    {


    	console.log(strata_population["Drun01"]);

		info.update = function (props) {
		  this._div.innerHTML = 'Cat COVID-19 INFO<br><br>' +  (props ?
			'<b>' + props.NOMPROV + '</b><br />' + props.AREAPROV + ' people / mi<sup>2</sup>'
			: 'CAT PROV');
		};



		// Define the geojson layer and add it to the map
		L.geoJSON(json_map, {

		  style: function (feature) {
			return feature.properties && feature.properties.style;
		  },
		}).addTo(map);

		let comarquestCatalunyaLayer = L.geoJson(json_map, {
		  weight: 3,
		  color: '#244422'
		}).addTo(map);
		//comarquestCatalunyaLayer.bindPopup('Comarquest de Catalunya');
		//console.log(data)
		//comarquestCatalunyaLayer(data.Feature).addTo(map);
		map.fitBounds(comarquestCatalunyaLayer.getBounds());
		map.setZoom(8);



		// get color depending on population density value
		function getColor(d) {
		  return d > 1000 ? '#800026' :
			d > 500  ? '#BD0026' :
			  d > 200  ? '#E31A1C' :
				d > 100  ? '#FC4E2A' :
				  d > 50   ? '#FD8D3C' :
					d > 20   ? '#FEB24C' :
					  d > 10   ? '#FED976' :
						'#FFEDA0';
		}

		function style(feature) {
		  return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		  };
		}


		function highlightFeature(e) {
		  var layer = e.target;

		  layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		  });

		  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		  }

		  info.update(layer.feature.properties);
		}

		var geojson;

		function resetHighlight(e) {
		  geojson.resetStyle(e.target);
		  info.update();
		}

		function zoomToFeature(e) {
		  map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
		  layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		  });
		}

		geojson = L.geoJson(json_map, {
		  style: style,
		  onEachFeature: onEachFeature
		}).addTo(map);


		legendxx.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'infox legend'),
				grades = [0, 100, 200, 500, 1000, 2000, 5000, 10000],
				labels = [],
				from, to;

			for (var i = 0; i < grades.length; i++) {
				from = grades[i];
				to = grades[i + 1];

				labels.push(
					'<i style="background:' + getColor(from + 1) + '"></i> ' +
					from + (to ? '&ndash;' + to : '+'));
			}

			div.innerHTML = labels.join('<br>');
			return div;
		};

		legendxx.addTo(map);


    }

    requestMap();
