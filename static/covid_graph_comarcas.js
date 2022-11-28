// Div reference graph
let div_graph_comarcas_total = document.getElementById('main_graph_comarcas');
let graph_comarcas_data = '';
// Registers of buttons
let graph_comarcas_exposed_status = false;
let graph_comarcas_asymtomatic_status = false;
// Default value
let graph_comarcas_infected_status = true;
let graph_comarcas_pre_hospitalized_status = false;
let graph_comarcas_pre_deceased_status = false;
let graph_comarcas_recovered_status = false;
let graph_comarcas_hospitalized_icu_status = false;
let graph_comarcas_deceased_status = false;

// Buttons ids
let graph_comarcas_exposed = document.getElementById('button_exposed_comarcas_graph');
let graph_comarcas_asymtomatic = document.getElementById('button_asymtomatic_comarcas_graph');
let graph_comarcas_infected = document.getElementById('button_infected_comarcas_graph');
let graph_comarcas_pre_hospitalized = document.getElementById('button_hospitalized_comarcas_graph');
let graph_comarcas_pre_deceased = document.getElementById('button_pre_deceased_comarcas_graph');
let graph_comarcas_recovered = document.getElementById('button_recovered_comarcas_graph');
let graph_comarcas_hospitalized_icu = document.getElementById('button_hospitalized_icu_comarcas_graph');
let graph_comarcas_deceased = document.getElementById('button_deceased_comarcas_graph');


// Traces reference
let trace1_comarcas;
let trace2_comarcas;
let trace3_comarcas;


// First button color draw
graph_comarcas_exposed.style.background = '#005cbf';
graph_comarcas_asymtomatic.style.background = '#005cbf';
// Default value
graph_comarcas_infected.style.background='#d73541';
graph_comarcas_pre_hospitalized.style.background= '#005cbf';
graph_comarcas_pre_deceased.style.background = '#005cbf';
graph_comarcas_recovered.style.background = '#005cbf';
graph_comarcas_hospitalized_icu.style.background ='#005cbf';
graph_comarcas_deceased.style.background = '#005cbf';

// Graph button initializer
function initVarComarcas(){

    graph_comarcas_exposed.style.background='#005cbf';
    graph_comarcas_exposed_status = false;

    graph_comarcas_asymtomatic.style.background='#005cbf';
    graph_comarcas_asymtomatic_status = false;

    graph_comarcas_infected.style.background='#005cbf';
    graph_comarcas_infected_status = false;

    graph_comarcas_pre_hospitalized.style.background='#005cbf';
    graph_comarcas_pre_hospitalized_status = false;

    graph_comarcas_pre_deceased.style.background='#005cbf';
    graph_comarcas_pre_deceased_status = false;

    graph_comarcas_recovered.style.background='#005cbf';
    graph_comarcas_recovered_status = false;

    graph_comarcas_hospitalized_icu.style.background='#005cbf';
    graph_comarcas_hospitalized_icu_status = false;

    graph_comarcas_deceased.style.background='#005cbf';
    graph_comarcas_deceased_status = false;
}


function clearButtonsComarcas(){

    graph_comarcas_exposed.style.background = '#005cbf';
    graph_comarcas_asymtomatic.style.background = '#005cbf';
    graph_comarcas_infected.style.background = '#005cbf';
    graph_comarcas_pre_hospitalized.style.background= '#005cbf';
    graph_comarcas_pre_deceased.style.background = '#005cbf';
    graph_comarcas_recovered.style.background = '#005cbf';
    graph_comarcas_hospitalized_icu.style.background ='#005cbf';
    graph_comarcas_deceased.style.background = '#005cbf';

    graph_comarcas_exposed_status = false;
    graph_comarcas_asymtomatic_status = false;
    graph_comarcas_infected_status = false;
    graph_comarcas_pre_hospitalized_status = false;
    graph_comarcas_pre_deceased_status = false;
    graph_comarcas_recovered_status = false;
    graph_comarcas_hospitalized_icu_status = false;
    graph_comarcas_deceased_status = false;

}

// First time draw graph.
function drawMainGraphComarcas(json_data, strata_select)
{
    //init_map_graph_var();
    graph_comarcas_data = json_data['results']['compartmental_evolution'];
    Plotly.purge(div_graph_comarcas_total);
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
}


// Listeners for button graph generators

graph_comarcas_exposed.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_exposed.style.background='#d73541';
    graph_comarcas_exposed_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_asymtomatic.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_asymtomatic.style.background='#d73541';
    graph_comarcas_asymtomatic_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_infected.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_infected.style.background='#d73541';
    graph_comarcas_infected_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_pre_hospitalized.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_pre_hospitalized.style.background='#d73541';
    graph_comarcas_pre_hospitalized_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_pre_deceased.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_pre_deceased.style.background='#d73541';
    graph_comarcas_pre_deceased_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_recovered.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_recovered.style.background='#d73541';
    graph_comarcas_recovered_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_hospitalized_icu.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_hospitalized_icu.style.background='#d73541';
    graph_comarcas_hospitalized_icu_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

graph_comarcas_deceased.addEventListener("click", function() {

    clearButtonsComarcas();
    graph_comarcas_deceased.style.background='#d73541';
    graph_comarcas_deceased_status = true;
    reDrawGraphComarcas((document.getElementById('comarca_select_id').value));
});

// Draw a vertical dashed line for the actual timestep.
function drawTimestepLineComarca(){
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

    Plotly.relayout(div_graph_comarcas_total, update);
}


document.getElementById('comarca_select_id').addEventListener('click', function(){
    reDrawGraphComarcas(document.getElementById('comarca_select_id').value);
});


function reDrawGraphComarcas(comarca_id){
    let state = getState();
    let result_comarcas = {}
    let counter = 0;

    console.log(graph_comarcas_data);

    for(let x in graph_comarcas_data){
        if(graph_comarcas_data[x]['patch'] == comarca_id.toString() && graph_comarcas_data[x]['compartment'] === state){
            result_comarcas[graph_comarcas_data[x]['strata']] = graph_comarcas_data[x]['evolution']
            counter = counter + 1;
            if(counter === 3){
                break
            }
        }
    }

    console.log(result_comarcas);

    let alt_x = Array.from({length: result_comarcas[1].length}, (x, i) => i);


    let array_display = [];


    let trace1_comarcas = {
    type: "scatter",
    mode: "lines",
    name: "<=25 years",
    visible: "true",

    x: alt_x,
    y: result_comarcas[1],
    line: {color: '#000000'}
    };
    array_display.push(trace1_comarcas);


    let trace2_comarcas = {
    type: "scatter",
    mode: "lines",
    name: "<= 65 years",
    visible: "true",

    x: alt_x,
    y: result_comarcas[2],
    line: {color: '#8c00ff'}
    };
    array_display.push(trace2_comarcas);



    let trace3_comarcas = {
    type: "scatter",
    mode: "lines",
    name: ">=66 years",
    visible: "true",

    x: alt_x,
    y: result_comarcas[3],
    line: {color: '#e6ff00'}
    };
    array_display.push(trace3_comarcas);


    let config = {responsive: true};
    let layout = {
      title: 'Covid 19 Graph (Comarques and Strata)',
      //width: 1000,
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



    //Plotly.purge(div_graph_comarcas_total);
    Plotly.newPlot(div_graph_comarcas_total, array_display, layout, config);
    drawTimestepLineComarca();
}


function getState(){
    if (graph_comarcas_exposed_status === true){
        return 'E'
    }
    else if (graph_comarcas_asymtomatic_status === true){
        return 'A'
    }
    else if(graph_comarcas_infected_status === true){
        return 'I'
    }
    else if(graph_comarcas_pre_hospitalized_status === true){
        return 'PH'
    }
    else if(graph_comarcas_pre_deceased_status === true){
        return 'PD'
    }
    else if(graph_comarcas_recovered_status === true){
        return 'R'
    }
    else if(graph_comarcas_hospitalized_icu_status === true){
        return 'HD'
    }
    else if(graph_comarcas_deceased_status === true){
        return 'D'
    }
    else{
        return 'I'
    }

}