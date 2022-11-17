// Div reference graph
let div_graph_total = document.getElementById('main_graph');
let graph_data_total;

// Registers of buttons
let graph_exposed_status = false;
let graph_asymtomatic_status = false;
let graph_infected_status = false;
let graph_pre_hospitalized_status = false;
let graph_pre_deceased_status = false;
let graph_recovered_status = false;
let graph_hospitalized_icu_status = false;
let graph_deceased_status = false;

// Buttons ids
let graph_exposed = document.getElementById('button_exposed_strata_graph');
let graph_asymtomatic = document.getElementById('button_asymtomatic_strata_graph');
let graph_infected = document.getElementById('button_infected_strata_graph');
let graph_pre_hospitalized = document.getElementById('button_hospitalized_strata_graph');
let graph_pre_deceased = document.getElementById('button_pre_deceased_strata_graph');
let graph_recovered = document.getElementById('button_recovered_strata_graph');
let graph_hospitalized_icu = document.getElementById('button_hospitalized_icu_strata_graph');
let graph_deceased = document.getElementById('button_deceased_strata_graph');

// Traces reference
let trace1;
let trace2;
let trace3;
let trace4;
let trace5;
let trace6;
let trace7;
let trace8;

// First button color draw
graph_exposed.style.background = '#005cbf';
graph_asymtomatic.style.background = '#005cbf';
graph_infected.style.background = '#005cbf';
graph_pre_hospitalized.style.background= '#005cbf';
graph_pre_deceased.style.background = '#005cbf';
graph_recovered.style.background = '#005cbf';
graph_hospitalized_icu.style.background ='#005cbf';
graph_deceased.style.background = '#005cbf';

// Graph button initializer
function init_graph_var(){

    graph_exposed.style.background='#005cbf';
    graph_exposed_status = false;

    graph_asymtomatic.style.background='#005cbf';
    graph_asymtomatic_status = false;

    graph_infected.style.background='#005cbf';
    graph_infected_status = false;

    graph_pre_hospitalized.style.background='#005cbf';
    graph_pre_hospitalized_status = false;

    graph_pre_deceased.style.background='#005cbf';
    graph_pre_deceased_status = false;

    graph_recovered.style.background='#005cbf';
    graph_recovered_status = false;

    graph_hospitalized_icu.style.background='#005cbf';
    graph_hospitalized_icu_status = false;

    graph_deceased.style.background='#005cbf';
    graph_deceased_status = false;
}



// First time draw graph.
function drawMainGraph(json_data)
{
    init_graph_var();
    graph_data_total = json_data["results"]["total_states"];

    let alt_x = [];
    let alt_y_exposed = [];
    let alt_y_asymtomatic = [];
    let alt_y_infected = [];
    let alt_y_pre_hospitalized = [];
    let alt_y_recovered = [];
    let alt_y_hospitalized_icu = [];
    let alt_y_deceased = [];
    let alt_y_pre_deceased = [];

    // Default button is deceases
    graph_deceased_status = true;
    graph_deceased.style.background='#d73541';


    for (let x in Array.range(0, graph_data_total["D"].length - 1))
    {
        alt_x.push(parseInt(x));
        alt_y_deceased.push(graph_data_total["D"][x]);
        alt_y_exposed.push(graph_data_total["E"][x]);
        alt_y_asymtomatic.push(graph_data_total["A"][x]);
        alt_y_infected.push(graph_data_total["I"][x]);
        alt_y_pre_hospitalized.push(graph_data_total["PH"][x]);
        alt_y_recovered.push(graph_data_total["R"][x]);
        alt_y_hospitalized_icu.push(graph_data_total["HD"][x]);
        alt_y_pre_deceased.push(graph_data_total["PD"][x]);
    }

    trace1 = {
        type: "scatter",
        mode: "lines",
        name: "Deceased",
        visible: "true",

        x: alt_x,
        y: alt_y_deceased,
        line: {color: '#000000'}
    };

    trace2 = {
        type: "scatter",
        mode: "lines",
        name: "Exposed",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_exposed,
        line: {color: '#8c00ff'}
    };

    trace3 = {
        type: "scatter",
        mode: "lines",
        name: "Asymtomatic",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_asymtomatic,
        line: {color: '#e6ff00'}
    };

    trace4 = {
        type: "scatter",
        mode: "lines",
        name: "Infected",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_infected,
        line: {color: '#08ff00'}
    };

    trace5 = {
        type: "scatter",
        mode: "lines",
        name: "Pre Hospitalized",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_pre_hospitalized,
        line: {color: '#ee00ff'}
    };

    trace6 = {
        type: "scatter",
        mode: "lines",
        name: "Recovered",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_recovered,
        line: {color: '#000dff'}
    };

    trace7 = {
        type: "scatter",
        mode: "lines",
        name: "Hospitalized Icu",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_hospitalized_icu,
        line: {color: '#ff6800'}
    };

    trace8 = {
        type: "scatter",
        mode: "lines",
        name: "Pre Deceased",
        visible: "legendonly",

        x: alt_x,
        y: alt_y_pre_deceased,
        line: {color: '#ff0000'}
    };


    let config = {responsive: true};
    let layout = {
      title: 'Covid 19 Graph (Overall)',
      //width: 3000,
      height: 850,
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


    Plotly.newPlot(div_graph_total, [trace1, trace2, trace3, trace4, trace5, trace6, trace7, trace8], layout, config);
}


// Listeners for button graph generators

graph_exposed.addEventListener("click", function() {

    if (graph_exposed_status === false){

        graph_exposed.style.background='#d73541';
        graph_exposed_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [1]);
    }
    else {
        graph_exposed.style.background='#005cbf';
        graph_exposed_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [1]);

    }

    drawTimestepLine();
});

graph_asymtomatic.addEventListener("click", function() {

    if (graph_asymtomatic_status === false){

        graph_asymtomatic.style.background='#d73541';
        graph_asymtomatic_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [2]);
    }
    else {
        graph_asymtomatic.style.background='#005cbf';
        graph_asymtomatic_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [2]);
    }

    drawTimestepLine();

});

graph_infected.addEventListener("click", function() {

    if (graph_infected_status === false){

        graph_infected.style.background='#d73541';
        graph_infected_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [3]);
    }
    else {
        graph_infected.style.background='#005cbf';
        graph_infected_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [3]);
    }

    drawTimestepLine();

});

graph_pre_hospitalized.addEventListener("click", function() {

    if (graph_pre_hospitalized_status === false){

        graph_pre_hospitalized.style.background='#d73541';
        graph_pre_hospitalized_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [4]);
    }
    else {
        graph_pre_hospitalized.style.background='#005cbf';
        graph_pre_hospitalized_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [4]);
    }

    drawTimestepLine();

});

graph_pre_deceased.addEventListener("click", function() {

    if (graph_pre_deceased_status === false){

        graph_pre_deceased.style.background='#d73541';
        graph_pre_deceased_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [7]);
    }
    else {
        graph_pre_deceased.style.background='#005cbf';
        graph_pre_deceased_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [7]);
    }

    drawTimestepLine();

});

graph_recovered.addEventListener("click", function() {

    if (graph_recovered_status === false){

        graph_recovered.style.background='#d73541';
        graph_recovered_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [5]);
    }
    else {
        graph_recovered.style.background='#005cbf';
        graph_recovered_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [5]);
    }

    drawTimestepLine();

});

graph_hospitalized_icu.addEventListener("click", function() {

    if (graph_hospitalized_icu_status === false){

        graph_hospitalized_icu.style.background='#d73541';
        graph_hospitalized_icu_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [6]);
    }
    else {
        graph_hospitalized_icu.style.background='#005cbf';
        graph_hospitalized_icu_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [6]);
    }

    drawTimestepLine();

});

graph_deceased.addEventListener("click", function() {

    if (graph_deceased_status === false){

        graph_deceased.style.background='#d73541';
        graph_deceased_status = true;

        var update = {
             visible: "true",
        };
        Plotly.restyle(div_graph_total, update, [0]);
    }
    else {
        graph_deceased.style.background='#005cbf';
        graph_deceased_status = false;

        var update = {
             visible: "legendonly",
        };
        Plotly.restyle(div_graph_total, update, [0]);
    }

    drawTimestepLine();

});

// Draw a vertical dashed line for the actual timestep.
function drawTimestepLine(){
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

    Plotly.relayout(div_graph_total, update);
}