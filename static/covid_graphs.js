let div_graph_total = document.getElementById('main_graph');
let graph_data_total;

// registers of buttons
let graph_exposed_status = false;
let graph_asymtomatic_status = false;
let graph_infected_status = false;
let graph_pre_hospitalized_status = false;
let graph_pre_deceased_status = false;
let graph_recovered_status = false;
let graph_hospitalized_icu_status = false;
let graph_deceased_status = false;

// buttons ids
let graph_exposed = document.getElementById('button_exposed_strata_graph');
let graph_asymtomatic = document.getElementById('button_exposed_strata_graph');
let graph_infected = document.getElementById('button_exposed_strata_graph');
let graph_pre_hospitalized = document.getElementById('button_exposed_strata_graph');
let graph_pre_deceased = document.getElementById('button_exposed_strata_graph');
let graph_recovered = document.getElementById('button_exposed_strata_graph');
let graph_hospitalized_icu = document.getElementById('button_exposed_strata_graph');
let ggraph_deceased = document.getElementById('button_exposed_strata_graph');

function drawMainGraph(json_data)
{
    graph_data_total = json_data["results"]["total_states"]

    let alt_x = [];
    let alt_y = [];

    for (let x in Array.range(0, graph_data_total["D"].length - 1))
    {
        alt_x.push(parseInt(x));
        alt_y.push(graph_data_total["D"][x]);
    }

    let trace1 = {
        type: "scatter",
        mode: "lines",
        name: "Deceased",

        x: alt_x,
        y: alt_y,
        line: {color: '#cf1717'}
    };


    let config = {responsive: true};
    let layout = {
      title: 'Covid 19 Graph (Overall)',
      margin: {

        l: 30,

        r: 5,

        b: 20,

        t: 30,



      },
      paper_bgcolor: '#ffffff',
      plot_bgcolor: '#c7c7c7',
      legend: { orientation: 'h', site: 'top'},
    };

    Plotly.newPlot(div_graph_total, [trace1, trace1], layout, config);
}
