div_map = document.getElementById('map');

//Request map from server
function drawMap(data_covid) {

	$.ajax({
		type: "GET",
		url: "request_json_map",

		success: function (data_map) {

            var data = [{
                type: "choroplethmapbox", name: "Catalunya Comarques", geojson: data_map['map'], locations: data_map['test_data'],
            z: data_map['test_data'],
            zmin: 25, zmax: 280, colorbar: {y: 0, yanchor: "bottom", title: {text: "Catalunya Comarques", side: "right"}}}
             ];

            var layout = {mapbox: {style: "dark", center: {lon: 1.670047, lat: 41.687016}, zoom: 6.8}, margin: {l:0, r:0, b:0, t:0}};

            var config = {mapboxAccessToken:"pk.eyJ1IjoiZGFuZHlsaW9uIiwiYSI6ImNrdWUyczE5MDA4Z24yd3FrdnVxNXNvdTMifQ.9267FYgF4tibdnqHBCiLiA",
            };

            Plotly.newPlot(div_map, data, layout, config);
		},
	});

}
