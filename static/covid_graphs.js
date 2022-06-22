function drawMainGraph(json_data)
{
    div_graph = document.getElementById('main_graph');
    graph_data = json_data["results"]["total_patches"]

    alt_x = []
    alt_y = []
    alt_y_1 = []
    for (var x in Array.range(0, graph_data["D"][1].length - 1))
    {
        alt_x.push(parseInt(x));
        alt_y.push(graph_data["D"][1][x]);
        alt_y_1.push(graph_data["D"][2][x]);
    }

    console.log(alt_x)
    console.log(alt_y)

    var trace1 = {
        name: 'Deaths strata 1',
        type: "scatter",
        mode: "lines",
        x: alt_x,
        y: alt_y,
        line: {color: '#17BECF'}
    };

    var trace2 = {
        name: 'Deaths strata 2',
        type: "scatter",
        mode: "lines",
        x: alt_x,
        y: alt_y_1,
        line: {color: '#cf17b0'}
    };

    var config = {responsive: true};
    var layout = {
      title: 'Covid 19 Graph',
      margin: {

        l: 40,

        r: 30,

        b: 40,

        t: 50,

        pad: 4

      },
      paper_bgcolor: '#7f7f7f',
      plot_bgcolor: '#c7c7c7',
      legend: {
        x: 1,
        xanchor: 'right',
        y: 1,
        bgcolor: 'transparent',
      },
    };

    Plotly.newPlot(div_graph, [trace1,trace2], layout, config);
}
