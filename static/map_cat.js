div_map = document.getElementById('map');


function requestDataStrata(data, mode){
    let barrier_mode = false;
    let data_pre = data;

    let strata_1 = {};
    let strata_2 = {};
    let strata_3 = {};

    for(let item_map in data){
        if (data[item_map]['compartment'] === mode){
            barrier_mode = true;
        }
        if (barrier_mode === true){
            if (data[item_map]['compartment'] !== mode){
                break
            }
            if(data[item_map]['strata'] === 1){
                strata_1[data[item_map]['patch']] = data[item_map]['evolution'];
            }
            else if(data[item_map]['strata'] === 2){
                strata_2[data[item_map]['patch']] = data[item_map]['evolution'];
            }
            else if(data[item_map]['strata'] === 3){
                strata_3[data[item_map]['patch']] = data[item_map]['evolution'];
            }
        }
    }

    //console.log(strata_1);
    //console.log(strata_2);
    //console.log(strata_3);

    let strata_1_final = {};
    let strata_2_final = {};
    let strata_3_final = {};
    // reindex
    for(let id_comar in Array.from({length: 3}, (x, i) => i)){
        if(id_comar === '0'){
            strata_1_final[0] = strata_1[1];
            strata_1_final[1] = strata_1[2];
            strata_1_final[2] = strata_1[3];
            strata_1_final[3] = strata_1[4];
            strata_1_final[4] = strata_1[5];
            strata_1_final[5] = strata_1[6];
            strata_1_final[6] = strata_1[8];
            strata_1_final[7] = strata_1[9];
            strata_1_final[8] = strata_1[10];
            strata_1_final[9] = strata_1[11];
            strata_1_final[10] = strata_1[12]; //
            strata_1_final[11] = strata_1[13]; //
            strata_1_final[12] = strata_1[14]; //
            strata_1_final[13] = strata_1[14]; //
            strata_1_final[14] = strata_1[15]; //
            strata_1_final[15] = strata_1[15]; //
            strata_1_final[16] = strata_1[16]; //
            strata_1_final[17] = strata_1[16]; //
            strata_1_final[18] = strata_1[17]; //
            strata_1_final[19] = strata_1[18]; //
            strata_1_final[20] = strata_1[19]; //
            strata_1_final[21] = strata_1[20]; //
            strata_1_final[22] = strata_1[21]; //
            strata_1_final[23] = strata_1[22]; //
            strata_1_final[24] = strata_1[24]; //
            strata_1_final[25] = strata_1[25]; //
            strata_1_final[26] = strata_1[26]; //
            strata_1_final[27] = strata_1[27]; //
            strata_1_final[28] = strata_1[27]; //
            strata_1_final[29] = strata_1[28]; //
            strata_1_final[30] = strata_1[29]; //
            strata_1_final[31] = strata_1[29]; //
            strata_1_final[32] = strata_1[30]; //
            strata_1_final[33] = strata_1[31]; //
            strata_1_final[34] = strata_1[32]; //
            strata_1_final[35] = strata_1[33]; //
            strata_1_final[36] = strata_1[33]; //
            strata_1_final[37] = strata_1[34]; //
            strata_1_final[38] = strata_1[35]; //
            strata_1_final[39] = strata_1[35]; //
            strata_1_final[40] = strata_1[36]; //
            strata_1_final[41] = strata_1[37]; //
            strata_1_final[42] = strata_1[37]; //
            strata_1_final[43] = strata_1[38]; //
            strata_1_final[44] = strata_1[39]; //
            strata_1_final[45] = strata_1[40]; //
            strata_1_final[46] = strata_1[40]; //
            strata_1_final[47] = strata_1[7]; //
            strata_1_final[48] = strata_1[41]; //
            strata_1_final[49] = strata_1[42];
        }
        else if(id_comar === '1'){
            strata_2_final[0] = strata_2[1];
            strata_2_final[1] = strata_2[2];
            strata_2_final[2] = strata_2[3];
            strata_2_final[3] = strata_2[4];
            strata_2_final[4] = strata_2[5];
            strata_2_final[5] = strata_2[6];
            strata_2_final[6] = strata_2[8];
            strata_2_final[7] = strata_2[9];
            strata_2_final[8] = strata_2[10];
            strata_2_final[9] = strata_2[11];
            strata_2_final[10] = strata_2[12]; //
            strata_2_final[11] = strata_2[13]; //
            strata_2_final[12] = strata_2[14]; //
            strata_2_final[13] = strata_2[14]; //
            strata_2_final[14] = strata_2[15]; //
            strata_2_final[15] = strata_2[15]; //
            strata_2_final[16] = strata_2[16]; //
            strata_2_final[17] = strata_2[16]; //
            strata_2_final[18] = strata_2[17]; //
            strata_2_final[19] = strata_2[18]; //
            strata_2_final[20] = strata_2[19]; //
            strata_2_final[21] = strata_2[20]; //
            strata_2_final[22] = strata_2[21]; //
            strata_2_final[23] = strata_2[22]; //
            strata_2_final[24] = strata_2[24]; //
            strata_2_final[25] = strata_2[25]; //
            strata_2_final[26] = strata_2[26]; //
            strata_2_final[27] = strata_2[27]; //
            strata_2_final[28] = strata_2[27]; //
            strata_2_final[29] = strata_2[28]; //
            strata_2_final[30] = strata_2[29]; //
            strata_2_final[31] = strata_2[29]; //
            strata_2_final[32] = strata_2[30]; //
            strata_2_final[33] = strata_2[31]; //
            strata_2_final[34] = strata_2[32]; //
            strata_2_final[35] = strata_2[33]; //
            strata_2_final[36] = strata_2[33]; //
            strata_2_final[37] = strata_2[34]; //
            strata_2_final[38] = strata_2[35]; //
            strata_2_final[39] = strata_2[35]; //
            strata_2_final[40] = strata_2[36]; //
            strata_2_final[41] = strata_2[37]; //
            strata_2_final[42] = strata_2[37]; //
            strata_2_final[43] = strata_2[38]; //
            strata_2_final[44] = strata_2[39]; //
            strata_2_final[45] = strata_2[40]; //
            strata_2_final[46] = strata_2[40]; //
            strata_2_final[47] = strata_2[7]; //
            strata_2_final[48] = strata_2[41]; //
            strata_2_final[49] = strata_2[42];
        }
        else if(id_comar === '2'){
            strata_3_final[0] = strata_3[1];
            strata_3_final[1] = strata_3[2];
            strata_3_final[2] = strata_3[3];
            strata_3_final[3] = strata_3[4];
            strata_3_final[4] = strata_3[5];
            strata_3_final[5] = strata_3[6];
            strata_3_final[6] = strata_3[8];
            strata_3_final[7] = strata_3[9];
            strata_3_final[8] = strata_3[10];
            strata_3_final[9] = strata_3[11];
            strata_3_final[10] = strata_3[12]; //
            strata_3_final[11] = strata_3[13]; //
            strata_3_final[12] = strata_3[14]; //
            strata_3_final[13] = strata_3[14]; //
            strata_3_final[14] = strata_3[15]; //
            strata_3_final[15] = strata_3[15]; //
            strata_3_final[16] = strata_3[16]; //
            strata_3_final[17] = strata_3[16]; //
            strata_3_final[18] = strata_3[17]; //
            strata_3_final[19] = strata_3[18]; //
            strata_3_final[20] = strata_3[19]; //
            strata_3_final[21] = strata_3[20]; //
            strata_3_final[22] = strata_3[21]; //
            strata_3_final[23] = strata_3[22]; //
            strata_3_final[24] = strata_3[24]; //
            strata_3_final[25] = strata_3[25]; //
            strata_3_final[26] = strata_3[26]; //
            strata_3_final[27] = strata_3[27]; //
            strata_3_final[28] = strata_3[27]; //
            strata_3_final[29] = strata_3[28]; //
            strata_3_final[30] = strata_3[29]; //
            strata_3_final[31] = strata_3[29]; //
            strata_3_final[32] = strata_3[30]; //
            strata_3_final[33] = strata_3[31]; //
            strata_3_final[34] = strata_3[32]; //
            strata_3_final[35] = strata_3[33]; //
            strata_3_final[36] = strata_3[33]; //
            strata_3_final[37] = strata_3[34]; //
            strata_3_final[38] = strata_3[35]; //
            strata_3_final[39] = strata_3[35]; //
            strata_3_final[40] = strata_3[36]; //
            strata_3_final[41] = strata_3[37]; //
            strata_3_final[42] = strata_3[37]; //
            strata_3_final[43] = strata_3[38]; //
            strata_3_final[44] = strata_3[39]; //
            strata_3_final[45] = strata_3[40]; //
            strata_3_final[46] = strata_3[40]; //
            strata_3_final[47] = strata_3[7]; //
            strata_3_final[48] = strata_3[41]; //
            strata_3_final[49] = strata_3[42];
        }

    }


    return {'strata_1': strata_1_final, 'strata_2': strata_2_final, 'strata_3': strata_3_final}
}

function redrawMap(data){

}

//Request map from server
function drawMap(data_covid) {

	$.ajax({
		type: "GET",
		url: "request_json_map",

		success: function (data_map) {

            //console.log(data_map);
            //console.log(data_covid['results']['compartmental_evolution']);

            let data_infected = data_covid['results']['compartmental_evolution'];
            data_infected = requestDataStrata(data_infected, "I");

            let data_display = []
            for(let datax in data_infected['strata_1']){
                data_display.push(data_infected['strata_1'][datax][0])
            }
            console.log("***");
            console.log(data_map['test_data']);
            console.log(data_display);
            console.log("***");

            var data = [{
                type: "choroplethmapbox", name: "Catalunya Comarques", geojson: data_map['map'], locations: data_map['nom_comarques'],
            z: data_display,
            zmin: 25, zmax: 280, colorbar: {y: 0, yanchor: "bottom", title: {text: "Catalunya Comarques", side: "right"}}}
             ];

            var layout = {mapbox: {style: "dark", center: {lon: 1.670047, lat: 41.687016}, zoom: 6.8}, margin: {l:0, r:0, b:0, t:0}};

            var config = {mapboxAccessToken:"pk.eyJ1IjoiZGFuZHlsaW9uIiwiYSI6ImNrdWUyczE5MDA4Z24yd3FrdnVxNXNvdTMifQ.9267FYgF4tibdnqHBCiLiA", responsive: false};

            Plotly.newPlot(div_map, data, layout, config);
		},
	});

}



