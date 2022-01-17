//Global var for graphs info size
Array.range = (start, end) => Array.from({length: (end - start+1)}, (v, k) => k + start);
var char_1_height = 150;
var char_1_width = 600;

//Global vars for graphs data
var data_susceptible = [];
var data_exposed = [];
var data_asymptomatic = [];
var data_infected = [];
var data_pre_hospitalized = [];
var data_pre_deceased = [];
var data_recovered = [];
var data_hospitalized_icu = [];
var data_hospitalized_icu_fatal = [];
var data_deceased = [];


//In every simulation we need initialize the vars.
function initGraphVar()
{
    data_susceptible = [];
    data_exposed = [];
    data_asymptomatic = [];
    data_infected = [];
    data_pre_hospitalized = [];
    data_pre_deceased = [];
    data_recovered = [];
    data_hospitalized_icu = [];
    data_hospitalized_icu_fatal = [];
    data_deceased = [];

    for (let x in Array.range(0, strata_population["Drun01_add"][1].length - 1))
    {
        data_susceptible.push({ser1: x, ser2: strata_population["Srun01_add"][1][x]})
        data_exposed.push({ser1: x, ser2: strata_population["Erun01_add"][1][x]})
        data_asymptomatic.push({ser1: x, ser2: strata_population["Arun01_add"][1][x]})
        data_infected.push({ser1: x, ser2: strata_population["Irun01_add"][1][x]})
        data_pre_hospitalized.push({ser1: x, ser2: strata_population["PHrun01_add"][1][x]})
        data_pre_deceased.push({ser1: x, ser2: strata_population["PDrun01_add"][1][x]})
        data_recovered.push({ser1: x, ser2: strata_population["Rrun01_add"][1][x]})
        data_hospitalized_icu.push({ser1: x, ser2: strata_population["HRrun01_add"][1][x]})
        data_hospitalized_icu_fatal.push({ser1: x, ser2: strata_population["HDrun01_add"][1][x]})
        data_deceased.push({ser1: x, ser2: strata_population["Drun01_add"][1][x]})
    }

}

// set the dimensions and margins of the graph
const margin = {top: 10, right: 15, bottom: 25, left: 60},
    width = char_1_width * 1 - margin.left - margin.right,
    height = char_1_height * 3 - margin.top - margin.bottom;


var svg = d3.select("div#graph1")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 600")
  .classed("svg-content", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//chart title
svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill", "white")
        .text("COVID-19 OVERALL STATS");


// Initialise a X axis:
const x = d3.scaleLinear().range([0, width]);
const xAxis = d3.axisBottom().scale(x);
svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "myXaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)

// Initialize an Y axis
const y = d3.scalePow().exponent(0.5).range([height, 0]);
const yAxis = d3.axisLeft().scale(y);
svg.append("g")
    .attr("class", "myYaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)



// Create a function that takes a dataset as input and update the plot:
function updatex(data) {

    // Create the X axis:
    x.domain([0, parseInt(data.at(-1)['ser1'], 10)]);
    svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(xAxis);

    // create the Y axis
    y.domain([0, d3.max(data, function (d) {
        return d.ser2
    })]);
    svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)
        .call(yAxis);

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest")
        .data([data], function (d) {
            return d.ser1
        });

    // Updata the line
    u
        .enter()
        .append("path")
        .attr("class", "lineTest")
        .merge(u)
        .transition()
        .duration(3000)
        .attr("d", d3.line()
            .x(function (d) {
                return x(d.ser1);
            })
            .y(function (d) {
                return y(d.ser2);
            }))
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 2.5)
}


//Listeners from the buttons main graph.
document.getElementById("button_susceptible").addEventListener("click", function() {

  updatex(data_susceptible);

});

document.getElementById("button_exposed").addEventListener("click", function() {

  updatex(data_exposed);

});

document.getElementById("button_asymtomatic").addEventListener("click", function() {

  updatex(data_asymptomatic);

});

document.getElementById("button_infected").addEventListener("click", function() {

  updatex(data_infected);

});

document.getElementById("button_hospitalized").addEventListener("click", function() {

  updatex(data_pre_hospitalized);

});

document.getElementById("button_pre_deceased").addEventListener("click", function() {

  updatex(data_pre_deceased);

});

document.getElementById("button_recovered").addEventListener("click", function() {

  updatex(data_recovered);

});

document.getElementById("button_hospitalized_icu").addEventListener("click", function() {

  updatex(data_hospitalized_icu);

});

document.getElementById("button_deceased").addEventListener("click", function() {

  updatex(data_deceased);
  drawStrataGraph(svg2, data_deceased);
  drawStrataGraph(svg3, data_deceased);
  drawStrataGraph(svg4, data_deceased);

});



var svg2 = d3.select("div#graph2")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 600")
  .classed("svg-content", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//chart title
svg2.append("text")
        .attr("x", (width / 2))
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill", "white")
        .text("STRATA 1");


// Initialise a X axis:
svg2.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "myXaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)

// Initialize an Y axis
svg2.append("g")
    .attr("class", "myYaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)


var svg3 = d3.select("div#graph3")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 600")
  .classed("svg-content", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//chart title
svg3.append("text")
        .attr("x", (width / 2))
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill", "white")
        .text("STRATA 2");

// Initialise a X axis:
svg3.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "myXaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)

// Initialize an Y axis
svg3.append("g")
    .attr("class", "myYaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)



var svg4 = d3.select("div#graph4")
  .append("svg")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("viewBox", "0 0 600 600")
  .classed("svg-content", true)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

//chart title
svg4.append("text")
        .attr("x", (width / 2))
        .attr("y", 10)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .attr("fill", "white")
        .text("STRATA 3");


// Initialise a X axis:
svg4.append("g")
    .attr("transform", `translate(0, ${height})`)
    .attr("class", "myXaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)

// Initialize an Y axis
svg4.append("g")
    .attr("class", "myYaxis")
    .attr("stroke", "white")
    .attr("stroke-width", 0.8)



// Function for draw the strata graphs. Takes as a argument the SVG vector and data.
function drawStrataGraph(svg, data) {

    // Create the X axis:
    x.domain([0, parseInt(data.at(-1)['ser1'], 10)]);
    svg.selectAll(".myXaxis").transition()
        .duration(3000)
        .call(xAxis);

    // create the Y axis
    y.domain([0, d3.max(data, function (d) {
        return d.ser2
    })]);
    svg.selectAll(".myYaxis")
        .transition()
        .duration(3000)
        .call(yAxis);

    // Create a update selection: bind to the new data
    var u = svg.selectAll(".lineTest")
        .data([data], function (d) {
            return d.ser1
        });

    // Updata the line
    u
        .enter()
        .append("path")
        .attr("class", "lineTest")
        .merge(u)
        .transition()
        .duration(3000)
        .attr("d", d3.line()
            .x(function (d) {
                return x(d.ser1);
            })
            .y(function (d) {
                return y(d.ser2);
            }))
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 2.5)
}



initGraphVar();

//window.addEventListener('resize', initGraphVar );
