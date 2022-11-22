div_map = document.getElementById('map');

// Map data
let data_map_draw = ''
let data_map_covid = ''

// Buttons ids strata
let strata_1_button = document.getElementById('button_strata_1');
strata_1_button.style.background='#d73541';
let strata_2_button = document.getElementById('button_strata_2');
let strata_3_button = document.getElementById('button_strata_3');

// Buttons control
let strata_1_button_status = true;
let strata_2_button_status = false;
let strata_3_button_status = false;


// Get the strata data from GET petition and preprocess data.
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

    let strata_1_final = {};
    let strata_2_final = {};
    let strata_3_final = {};

    // reindex data from mao.
    for(let id_comar in Array.from({length: 3}, (x, i) => i)){
        if(id_comar === '0'){
            strata_1_final[0] = strata_1[1];
            strata_1_final[1] = strata_1[2];
            strata_1_final[2] = strata_1[3];
            strata_1_final[3] = strata_1[4]; //
            strata_1_final[4] = strata_1[5]; //
            strata_1_final[5] = strata_1[6]; //
            strata_1_final[6] = strata_1[8]; //
            strata_1_final[7] = strata_1[9]; //
            strata_1_final[8] = strata_1[10]; //
            strata_1_final[9] = strata_1[11]; //
            strata_1_final[10] = strata_1[12]; //
            strata_1_final[11] = strata_1[13]; //
            strata_1_final[12] = strata_1[14]; //
            strata_1_final[13] = strata_1[15]; //
            strata_1_final[14] = strata_1[16]; //
            strata_1_final[15] = strata_1[17]; //
            strata_1_final[16] = strata_1[18]; //
            strata_1_final[17] = strata_1[19]; //
            strata_1_final[18] = strata_1[20]; //
            strata_1_final[19] = strata_1[21]; //
            strata_1_final[20] = strata_1[22]; //
            strata_1_final[21] = strata_1[24]; //
            strata_1_final[22] = strata_1[25]; //
            strata_1_final[23] = strata_1[26]; //
            strata_1_final[24] = strata_1[27]; //
            strata_1_final[25] = strata_1[28]; //
            strata_1_final[26] = strata_1[29]; //
            strata_1_final[27] = strata_1[30]; //
            strata_1_final[28] = strata_1[31]; //
            strata_1_final[29] = strata_1[32]; //
            strata_1_final[30] = strata_1[33]; //
            strata_1_final[31] = strata_1[34]; //
            strata_1_final[32] = strata_1[35]; //
            strata_1_final[33] = strata_1[36]; //
            strata_1_final[34] = strata_1[37]; //
            strata_1_final[35] = strata_1[38]; //
            strata_1_final[36] = strata_1[39]; //
            strata_1_final[37] = strata_1[40]; //
            strata_1_final[38] = strata_1[7]; //
            strata_1_final[39] = strata_1[41]; //
            strata_1_final[40] = strata_1[42];
            strata_1_final[41] = strata_1[23];

        }
        else if(id_comar === '1'){
            strata_2_final[0] = strata_2[1];
            strata_2_final[1] = strata_2[2];
            strata_2_final[2] = strata_2[3];
            strata_2_final[3] = strata_2[4]; //
            strata_2_final[4] = strata_2[5]; //
            strata_2_final[5] = strata_2[6]; //
            strata_2_final[6] = strata_2[8]; //
            strata_2_final[7] = strata_2[9]; //
            strata_2_final[8] = strata_2[10]; //
            strata_2_final[9] = strata_2[11]; //
            strata_2_final[10] = strata_2[12]; //
            strata_2_final[11] = strata_2[13]; //
            strata_2_final[12] = strata_2[14]; //
            strata_2_final[13] = strata_2[15]; //
            strata_2_final[14] = strata_2[16]; //
            strata_2_final[15] = strata_2[17]; //
            strata_2_final[16] = strata_2[18]; //
            strata_2_final[17] = strata_2[19]; //
            strata_2_final[18] = strata_2[20]; //
            strata_2_final[19] = strata_2[21]; //
            strata_2_final[20] = strata_2[22]; //
            strata_2_final[21] = strata_2[24]; //
            strata_2_final[22] = strata_2[25]; //
            strata_2_final[23] = strata_2[26]; //
            strata_2_final[24] = strata_2[27]; //
            strata_2_final[25] = strata_2[28]; //
            strata_2_final[26] = strata_2[29]; //
            strata_2_final[27] = strata_2[30]; //
            strata_2_final[28] = strata_2[31]; //
            strata_2_final[29] = strata_2[32]; //
            strata_2_final[30] = strata_2[33]; //
            strata_2_final[31] = strata_2[34]; //
            strata_2_final[32] = strata_2[35]; //
            strata_2_final[33] = strata_2[36]; //
            strata_2_final[34] = strata_2[37]; //
            strata_2_final[35] = strata_2[38]; //
            strata_2_final[36] = strata_2[39]; //
            strata_2_final[37] = strata_2[40]; //
            strata_2_final[38] = strata_2[7]; //
            strata_2_final[39] = strata_2[41]; //
            strata_2_final[40] = strata_2[42];
            strata_2_final[41] = strata_2[23];
        }
        else if(id_comar === '2'){
            strata_3_final[0] = strata_3[1];
            strata_3_final[1] = strata_3[2];
            strata_3_final[2] = strata_3[3];
            strata_3_final[3] = strata_3[4]; //
            strata_3_final[4] = strata_3[5]; //
            strata_3_final[5] = strata_3[6]; //
            strata_3_final[6] = strata_3[8]; //
            strata_3_final[7] = strata_3[9]; //
            strata_3_final[8] = strata_3[10]; //
            strata_3_final[9] = strata_3[11]; //
            strata_3_final[10] = strata_3[12]; //
            strata_3_final[11] = strata_3[13]; //
            strata_3_final[12] = strata_3[14]; //
            strata_3_final[13] = strata_3[15]; //
            strata_3_final[14] = strata_3[16]; //
            strata_3_final[15] = strata_3[17]; //
            strata_3_final[16] = strata_3[18]; //
            strata_3_final[17] = strata_3[19]; //
            strata_3_final[18] = strata_3[20]; //
            strata_3_final[19] = strata_3[21]; //
            strata_3_final[20] = strata_3[22]; //
            strata_3_final[21] = strata_3[24]; //
            strata_3_final[22] = strata_3[25]; //
            strata_3_final[23] = strata_3[26]; //
            strata_3_final[24] = strata_3[27]; //
            strata_3_final[25] = strata_3[28]; //
            strata_3_final[26] = strata_3[29]; //
            strata_3_final[27] = strata_3[30]; //
            strata_3_final[28] = strata_3[31]; //
            strata_3_final[29] = strata_3[32]; //
            strata_3_final[30] = strata_3[33]; //
            strata_3_final[31] = strata_3[34]; //
            strata_3_final[32] = strata_3[35]; //
            strata_3_final[33] = strata_3[36]; //
            strata_3_final[34] = strata_3[37]; //
            strata_3_final[35] = strata_3[38]; //
            strata_3_final[36] = strata_3[39]; //
            strata_3_final[37] = strata_3[40]; //
            strata_3_final[38] = strata_3[7]; //
            strata_3_final[39] = strata_3[41]; //
            strata_3_final[40] = strata_3[42];
            strata_3_final[41] = strata_3[23];
        }

    }


    return {'strata_1': strata_1_final, 'strata_2': strata_2_final, 'strata_3': strata_3_final}
}

// Update map.
function redrawMap(){
    // Default value infected
    let data_mode = 'I'

    // check mode data.
    if(graph_map_exposed_status === true){
        data_mode = 'E';
    }
    else if(graph_map_asymtomatic_status === true){
        data_mode = 'A';
    }
    else if(graph_map_infected_status === true){
        data_mode = 'I';
    }
    else if(graph_map_pre_hospitalized_status === true){
        data_mode = 'PH';
    }
    else if(graph_map_pre_deceased_status === true){
        data_mode = 'PD';
    }
    else if(graph_map_recovered_status === true){
        data_mode = 'R';
    }
    else if(graph_map_hospitalized_icu_status === true){
        data_mode = 'HD';
    }
    else if(graph_map_deceased_status === true){
        data_mode = 'D';
    }

    let data_infected = data_map_covid['results']['compartmental_evolution'];
    data_infected = requestDataStrata(data_infected, data_mode);

    let strata_select = checkStrataSelect();


    let data_display = Array(50).fill(0);
    let label_display = Array(50).fill('');
    let counter_data = 0;
    let round_number;

    for(let strata_n of strata_select){
        for(let data_strata in data_infected[strata_n]){
            round_number = Number((data_infected[strata_n][data_strata][document.getElementById('time_steps_range').value]).toFixed(1));
            data_display[counter_data] += round_number;
            if(strata_n === 'strata_1'){
                label_display[counter_data] += '(<=25) years' + ":" + round_number.toString() + "<br>";
            }
            else if(strata_n === 'strata_2'){
                label_display[counter_data] += '(<= 65) years' + ":" + round_number.toString() + "<br>";
            }
            else{
                label_display[counter_data] += '(>=66) years' + ":" + round_number.toString();
            }
            counter_data += 1;
        }
        counter_data = 0;
    }

    let max_value = Math.max(data_display);
    let min_value = Math.min(data_display);

    // <---------

    var data = [{
    type: 'choropleth', geojson: data_map_draw['map'], locations: data_map_draw['nom_comarques'],
    z: data_display, text: label_display, zmin: min_value, zmax: max_value,
    },];

    var layout = {
        style: "dark",
        margin: {l:0, r:0, b:0, t:0},
        geo: {showframe: false, showcoastlines: false, center: {lon: 1.670047, lat: 41.687016},
          projection: { scale: 110},
            "lataxis": {"dtick": 10, "range": [-300, -100], "tick0": 15, "showgrid": false},
            "lonaxis": {"dtick": 30, "range": [-50, 10], "tick0": -180, "showgrid": false},
        },
    }

    //var config = {responsive: true};

    Plotly.purge(div_map);
    Plotly.newPlot(div_map, data, layout, {showLink: false});

    let drawOnlyStrata = {};

    for(let strata_id in strata_select){
        drawOnlyStrata[strata_select[strata_id]] = data_infected[strata_select[strata_id]]
    }

    drawMapGraph(drawOnlyStrata);


}




// Request map from server. Initial draw.
function drawMap(data_covid) {

	$.ajax({
		type: "GET",
		url: "request_json_map",

		success: function (data_map) {

            data_map_draw = data_map;
            data_map_covid = data_covid;
            console.log(data_map);
            console.log(data_covid);
            redrawMap();
		},
	});

}



// Strata buttons event functions,
strata_1_button.addEventListener("click", function() {
    if(strata_1_button_status === false){
        strata_1_button_status = true;
        strata_1_button.style.background='#d73541';
    }
    else{
        strata_1_button_status = false;
        strata_1_button.style.background='#005cbf';
    }
    redrawMap();
});

strata_2_button.addEventListener("click", function() {
    if(strata_2_button_status === false){
        strata_2_button_status = true;
        strata_2_button.style.background='#d73541';
    }
    else{
        strata_2_button_status = false;
        strata_2_button.style.background='#005cbf';
    }
    redrawMap();
});

strata_3_button.addEventListener("click", function() {
    if(strata_3_button_status === false){
        strata_3_button_status = true;
        strata_3_button.style.background='#d73541';
    }
    else{
        strata_3_button_status = false;
        strata_3_button.style.background='#005cbf';
    }
    redrawMap();
});


function checkStrataSelect(){
    let return_status = [];
    if(strata_1_button_status === true){
        return_status.push("strata_1");
    }
    if(strata_2_button_status === true){
        return_status.push("strata_2");
    }
    if(strata_3_button_status === true){
        return_status.push("strata_3");
    }

    return return_status;
}