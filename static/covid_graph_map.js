// Div reference graph
let div_graph_map_total = document.getElementById('map_graph');
let graph_map_data_total;

// Registers of buttons
let graph_map_exposed_status = false;
let graph_map_asymtomatic_status = false;
// Default value
let graph_map_infected_status = true;
let graph_map_pre_hospitalized_status = false;
let graph_map_pre_deceased_status = false;
let graph_map_recovered_status = false;
let graph_map_hospitalized_icu_status = false;
let graph_map_deceased_status = false;

// Buttons ids
let graph_map_exposed = document.getElementById('button_exposed_strata_graph_map');
let graph_map_asymtomatic = document.getElementById('button_asymtomatic_strata_graph_map');
let graph_map_infected = document.getElementById('button_infected_strata_graph_map');
let graph_map_pre_hospitalized = document.getElementById('button_hospitalized_strata_graph_map');
let graph_map_pre_deceased = document.getElementById('button_pre_deceased_strata_graph_map');
let graph_map_recovered = document.getElementById('button_recovered_strata_graph_map');
let graph_map_hospitalized_icu = document.getElementById('button_hospitalized_icu_strata_graph_map');
let graph_map_deceased = document.getElementById('button_deceased_strata_graph_map');


// Traces reference
let trace1_map;
let trace2_map;
let trace3_map;


// First button color draw
graph_map_exposed.style.background = '#005cbf';
graph_map_asymtomatic.style.background = '#005cbf';
// Default value
graph_map_infected.style.background='#d73541';
graph_map_pre_hospitalized.style.background= '#005cbf';
graph_map_pre_deceased.style.background = '#005cbf';
graph_map_recovered.style.background = '#005cbf';
graph_map_hospitalized_icu.style.background ='#005cbf';
graph_map_deceased.style.background = '#005cbf';

// Graph button initializer
function init_map_graph_var(){

    graph_map_exposed.style.background='#005cbf';
    graph_map_exposed_status = false;

    graph_map_asymtomatic.style.background='#005cbf';
    graph_map_asymtomatic_status = false;

    graph_map_infected.style.background='#005cbf';
    graph_map_infected_status = false;

    graph_map_pre_hospitalized.style.background='#005cbf';
    graph_map_pre_hospitalized_status = false;

    graph_map_pre_deceased.style.background='#005cbf';
    graph_map_pre_deceased_status = false;

    graph_map_recovered.style.background='#005cbf';
    graph_map_recovered_status = false;

    graph_map_hospitalized_icu.style.background='#005cbf';
    graph_map_hospitalized_icu_status = false;

    graph_map_deceased.style.background='#005cbf';
    graph_map_deceased_status = false;
}


function clearButtons(){

    graph_map_exposed.style.background = '#005cbf';
    graph_map_asymtomatic.style.background = '#005cbf';
    graph_map_infected.style.background = '#005cbf';
    graph_map_pre_hospitalized.style.background= '#005cbf';
    graph_map_pre_deceased.style.background = '#005cbf';
    graph_map_recovered.style.background = '#005cbf';
    graph_map_hospitalized_icu.style.background ='#005cbf';
    graph_map_deceased.style.background = '#005cbf';

    graph_map_exposed_status = false;
    graph_map_asymtomatic_status = false;
    graph_map_infected_status = false;
    graph_map_pre_hospitalized_status = false;
    graph_map_pre_deceased_status = false;
    graph_map_recovered_status = false;
    graph_map_hospitalized_icu_status = false;
    graph_map_deceased_status = false;

     var update = {
             visible: "legendonly",
        };

     for(let button_c in Array.from({length: 8}, (x, i) => i)){
          Plotly.restyle(div_graph_map_total, update, [button_c]);
     }
     //Plotly.restyle(div_graph_map_total, update, [1]);

}

// First time draw graph.
function drawMapGraph(json_data, strata_select)
{
    //init_map_graph_var();
    //graph_map_data_total = json_data["results"]["total_states"];

    console.log(json_data)

    let strata_1_y = Array(simulator_steps).fill(0);
    let strata_2_y = Array(simulator_steps).fill(0);
    let strata_3_y = Array(simulator_steps).fill(0);

    let strata_1_display = false;
    let strata_2_display = false;
    let strata_3_display = false;

    let counter_pos = 0;


    for(let strata_i in json_data){
        for(let strata_d in json_data[strata_i]){
            for(let strata_pos in json_data[strata_i][strata_d]) {
                if (strata_i === 'strata_1') {
                    strata_1_y[counter_pos] += json_data[strata_i][strata_d][strata_pos];
                    strata_1_display = true;
                }
                if (strata_i === 'strata_2') {
                    strata_2_y[counter_pos] += json_data[strata_i][strata_d][strata_pos];
                    strata_2_display = true;
                }
                if (strata_i === 'strata_3') {
                    strata_3_y[counter_pos] += json_data[strata_i][strata_d][strata_pos];
                    strata_3_display = true;
                }
                counter_pos += 1;
            }
            counter_pos = 0;
        }
    }



    let alt_x = Array.from({length: strata_1_y.length}, (x, i) => i);

    let array_display = [];

    if(strata_1_display === true){
        trace1_map = {
        type: "scatter",
        mode: "lines",
        name: "<=25 years",
        visible: "true",

        x: alt_x,
        y: strata_1_y,
        line: {color: '#000000'}
    };
        array_display.push(trace1_map);
    }


    if(strata_2_display === true){
        trace2_map = {
        type: "scatter",
        mode: "lines",
        name: "<= 65 years",
        visible: "true",

        x: alt_x,
        y: strata_2_y,
        line: {color: '#8c00ff'}
        };
        array_display.push(trace2_map);
    }

    if(strata_3_display === true){
        trace3_map = {
        type: "scatter",
        mode: "lines",
        name: ">=66 years",
        visible: "true",

        x: alt_x,
        y: strata_3_y,
        line: {color: '#e6ff00'}
        };
        array_display.push(trace3_map);
    }



    let config = {responsive: true};
    let layout = {
      title: 'Covid 19 Graph (Strata)',
      //width: 3000,
      height: 572,
      margin: {
        l: 35,
        r: 5,
        b: 20,
        t: 30,
      },
      shapes: [{
            type: 'line',
            x0: 0,
            y0: 0,
            x1: 0,
            y1: 1,
            yref: 'paper',
            line: {
              color: 'grey',
              width: 1.5,
              dash: 'dot'
            }}],
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#c7c7c7',
      legend: { orientation: 'h', site: 'top'},
    };


    Plotly.purge(div_graph_map_total);
    Plotly.newPlot(div_graph_map_total, array_display, layout, config);
    drawTimestepLineMap();
}


// Listeners for button graph generators

graph_map_exposed.addEventListener("click", function() {

    clearButtons();

    if (graph_map_exposed_status === false){

        graph_map_exposed.style.background='#d73541';
        graph_map_exposed_status = true;
        redrawMap();
    }


    drawTimestepLineMap();
});

graph_map_asymtomatic.addEventListener("click", function() {

    clearButtons();

    if (graph_map_asymtomatic_status === false){

        graph_map_asymtomatic.style.background='#d73541';
        graph_map_asymtomatic_status = true;
        redrawMap();
    }


    drawTimestepLineMap();

});

graph_map_infected.addEventListener("click", function() {

    clearButtons();

    if (graph_map_infected_status === false){

        graph_map_infected.style.background='#d73541';
        graph_map_infected_status = true;
        redrawMap();
    }

    drawTimestepLineMap();

});

graph_map_pre_hospitalized.addEventListener("click", function() {

    clearButtons();

    if (graph_map_pre_hospitalized_status === false){

        graph_map_pre_hospitalized.style.background='#d73541';
        graph_map_pre_hospitalized_status = true;
        redrawMap();
    }

    drawTimestepLineMap();

});

graph_map_pre_deceased.addEventListener("click", function() {

    clearButtons();

    if (graph_map_pre_deceased_status === false){

        graph_map_pre_deceased.style.background='#d73541';
        graph_map_pre_deceased_status = true;
        redrawMap();
    }

    drawTimestepLineMap();

});

graph_map_recovered.addEventListener("click", function() {

    clearButtons();

    if (graph_map_recovered_status === false){

        graph_map_recovered.style.background='#d73541';
        graph_map_recovered_status = true;

        redrawMap();
    }

    drawTimestepLineMap();

});

graph_map_hospitalized_icu.addEventListener("click", function() {

    clearButtons();

    if (graph_map_hospitalized_icu_status === false){

        graph_map_hospitalized_icu.style.background='#d73541';
        graph_map_hospitalized_icu_status = true;
        redrawMap();
    }

    drawTimestepLineMap();

});

graph_map_deceased.addEventListener("click", function() {

    clearButtons();

    if (graph_map_deceased_status === false){

        graph_map_deceased.style.background='#d73541';
        graph_map_deceased_status = true;
        redrawMap();
    }

    drawTimestepLineMap();

});

// Draw a vertical dashed line for the actual timestep.
function drawTimestepLineMap(){
    let update = {
        shapes: [{
            type: 'line',
            x0: parseInt(document.getElementById('time_steps_range').value),
            y0: 0,
            x1: parseInt(document.getElementById('time_steps_range').value),
            y1: 1,
            yref: 'paper',
            line: {
              color: 'grey',
              width: 3.5,
              dash: 'dot'
            }
        }]
    }

    Plotly.relayout(div_graph_map_total, update);
}