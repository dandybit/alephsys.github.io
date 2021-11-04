var simulator_steps = 0;
var strata_population = 0;

//add lockdonw button
document.getElementById('lockdown_button').addEventListener("click", function(){
  var parentElement = document.getElementById('form-elements');
  var newElement = document.createElement('li');
  var newElementChild = document.createElement('a');
  newElementChild.innerText = "PEPE_THE_FROG";
  newElement.appendChild(newElementChild);
  parentElement.appendChild(newElement);
  alert("pepe");
});



//Request button eventListener
document.getElementById('init_simulation').addEventListener("click", function(){
    document.getElementById('init_simulation').disabled = true;
    $.ajax({
    type: "GET",
    url: "map_query",
    data: {
        "population": document.getElementById('population_id').value,
    },
    success: function(data){

        simulator_steps = data['simulation_steps'];
        strata_population = data['strata_population'];
        //alert("success");
        //alert(data['simulation_steps']);
        document.getElementById('time_steps_title').innerText = 'Time steps Model (timestep 0)';
        document.getElementById('time_steps_range').setAttribute('min', 0);
        document.getElementById('time_steps_range').setAttribute('max', simulator_steps.length - 1) ;
        document.getElementById('time_steps_range').setAttribute('min', 0);
        document.getElementById('time_steps_range').removeAttribute('disabled');
        document.getElementById('time_steps_range').setAttribute('value', 0);

        document.getElementById('infected_id').innerText = simulator_steps[0][2];
        document.getElementById('deaths_id').innerText = simulator_steps[0][5];
        document.getElementById('cases_id').innerText = simulator_steps[0][3];
        document.getElementById('icus_id').innerText = simulator_steps[0][4];

        //console.log(strata_population['Srun01']);
        //console.log("HERE----")
        //console.log(data['test'])
        setTimeout(function(){
         document.getElementById('init_simulation').disabled = false;
        }, 1000);

    },
    error: function(data){
        alert("The simulation has throw error");
        setTimeout(function(){
         document.getElementById('init_simulation').disabled = false;
        }, 1000);
        //console.log(data);
    },
});
    //alert("TOUCH ME HARDER!");
});


document.getElementById('time_steps_range').addEventListener('input', function(){
    document.getElementById('time_steps_title').innerText =
        'Time steps Model (timestep '+ document.getElementById('time_steps_range').value +')';

    // principal stats
    document.getElementById('infected_id').innerText = simulator_steps[document.getElementById('time_steps_range').value][2];
    document.getElementById('deaths_id').innerText = simulator_steps[document.getElementById('time_steps_range').value][5];
    document.getElementById('cases_id').innerText = simulator_steps[document.getElementById('time_steps_range').value][3];
    document.getElementById('icus_id').innerText = simulator_steps[document.getElementById('time_steps_range').value][4];

    // stats for stratas
});








console.log(document.getElementById('frame_1_char').getBoundingClientRect());

var char_1_height = document.getElementById('frame_1_char').getBoundingClientRect()['height'];
var char_1_width = document.getElementById('frame_1_char').getBoundingClientRect()['width'];

// Create 2 datasets
const data1 = [
   {ser1: 0.3, ser2: 4},
   {ser1: 2, ser2: 16},
   {ser1: 3, ser2: 8}
];

const data2 = [
   {ser1: 1, ser2: 7},
   {ser1: 4, ser2: 1},
   {ser1: 6, ser2: 8}
];

// set the dimensions and margins of the graph
const margin = {top: 10, right: 30, bottom: 30, left: 50},
    width = char_1_width * 1 - margin.left - margin.right,
    height = char_1_height * 3 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg = d3.select("#graph1")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);


// Initialise a X axis:
const x = d3.scaleLinear().range([0,width]);
const xAxis = d3.axisBottom().scale(x);
svg.append("g")
  .attr("transform", `translate(0, ${height})`)
  .attr("class","myXaxis")
  .attr("stroke", "white")
  .attr("stroke-width", 0.8)

// Initialize an Y axis
const y = d3.scaleLinear().range([height, 0]);
const yAxis = d3.axisLeft().scale(y);
svg.append("g")
  .attr("class","myYaxis")
  .attr("stroke", "white")
  .attr("stroke-width", 0.8)

// Create a function that takes a dataset as input and update the plot:
function updatex(data) {

  // Create the X axis:
  x.domain([0, d3.max(data, function(d) { return d.ser1 }) ]);
  svg.selectAll(".myXaxis").transition()
    .duration(3000)
    .call(xAxis);

  // create the Y axis
  y.domain([0, d3.max(data, function(d) { return d.ser2  }) ]);
  svg.selectAll(".myYaxis")
    .transition()
    .duration(3000)
    .call(yAxis);

  // Create a update selection: bind to the new data
  var u = svg.selectAll(".lineTest")
    .data([data], function(d){ return d.ser1 });

  // Updata the line
  u
    .enter()
    .append("path")
    .attr("class","lineTest")
    .merge(u)
    .transition()
    .duration(3000)
    .attr("d", d3.line()
      .x(function(d) { return x(d.ser1); })
      .y(function(d) { return y(d.ser2); }))
      .attr("fill", "none")
      .attr("stroke", "yellow")
      .attr("stroke-width", 2.5)
}

// At the beginning, I run the update function on the first dataset:
update(data1)


// At the beginning, I run the update function on the first dataset:
updatex(data1)