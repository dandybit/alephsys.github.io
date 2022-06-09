var json_map = '';
var map = 0;
var info = 0;
var legendxx = 0;
var first_draw = true;

//Request map from server
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


//First draw for the map
function drawMap()
{
	first_draw = true;
	map = L.map('map', {
	  zoomControl: true,
	  zoom: 5,
	  minZoom: 6,
	  maxZoom: 12
	});

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 11,
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


	function style(feature) {
	  return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(feature.properties.AREAPROV)
	  };
	}


	//Display info for region (the first draw will be for density population)
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

	// get color depending on population density value (first draw)
	function getColor(d) {
	  return d > 12000 ? '#800026' :
			d > 11000  ? '#FC4E2A' :
			  d > 9000   ? '#FD8D3C' :
				d > 7000   ? '#FEB24C' :
				  d > 5000   ? '#FED976' :
					'#FFEDA0';
	}

	//Init map legend
	legend.onAdd = function (map) {
		var div = L.DomUtil.create('div', 'infox legend'),
			grades = [5000, 7000, 9000, 11000, 12000],
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





//Redraw with update info
function redrawMap(timestep)
{

	//console.log(timestep);
	//console.log(lockdown_info_map_acc[timestep]);
	//console.log(lockdown_info_map[timestep]);

	wrapper_ml = {'Lleida': json_data_map['results']['total_patches']['D']['4'][timestep],
	'Tarragona': json_data_map['results']['total_patches']['D']['3'][timestep],
	'Barcelona': json_data_map['results']['total_patches']['D']['2'][timestep],
	'Girona': json_data_map['results']['total_patches']['D']['1'][timestep],
	}

	//console.log(wrapper_ml['Barcelona'])


	info.update = function (props) {
	  //console.log(props);
	  this._div.innerHTML = 'Cat COVID-19 INFO<br><br>' +  (props ?
		'<b>' + props.NOMPROV + '</b><br />' + Number((wrapper_ml[props.NOMPROV]).toFixed(3)) + ' Deceases'
		: 'CAT PROV');
	};



	// get color depending on population density value
	function getColor(d) {
	  return d > acc_ref[6] ? '#800026' :
		d > acc_ref[5]  ? '#BD0026' :
		  d > acc_ref[4]  ? '#E31A1C' :
			d > acc_ref[3]  ? '#FC4E2A' :
			  d > acc_ref[2]   ? '#FD8D3C' :
				d > acc_ref[1]   ? '#FEB24C' :
				  d > acc_ref[0]   ? '#FED976' :
					'#FFEDA0';
	}

	function style(feature) {
	  //console.log(feature);
	  return {
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7,
		fillColor: getColor(wrapper_ml[feature.properties.NOMPROV])
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

	if (first_draw) {

		legendxx.onAdd = function (map) {

			var div = L.DomUtil.create('div', 'infox legend'),
				grades = acc_ref,
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
	}

	if (first_draw)
	{
		first_draw = false;
	}

	legendxx.addTo(map);
}

requestMap();
