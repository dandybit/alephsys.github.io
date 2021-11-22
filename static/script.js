var simulator_steps = 0;
var strata_population = 0;
var lockdown_data_count = 0;
var lockdown_info = {};
Array.range = (start, end) => Array.from({length: (end - start+1)}, (v, k) => k + start);

//Check integer or float
function isItNumber(str) {
  return /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(str);
}

//Reset lockdown create default values.
function lockdownResetValues()
{
  document.getElementById("init_time_step").value = 0;
  document.getElementById("final_time_step").value = 0;
  document.getElementById("lockdown_severity").value = "0.00";
  document.getElementById("lockdown_permeability").value = "0.00";
  document.getElementById("lockdown_distance").value = "0.00";
  document.getElementById("lockdown_select").value = "Lockdown type";
}

//Check integrity of the vars.
function checkValuesLockdown(){
    parent_ul = document.getElementById("form-elements");
    index_objects = Object.keys(lockdown_info);

    if (lockdown_info[index_objects.at(-1)]["lockdown_type"] === "Lockdown type"){
        alert("You must select a lockdown type")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["init"] > lockdown_info[index_objects.at(-1)]["final"]){
        alert("Final timestep lockdown must be greater than or equal to the init timestep lockdown")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["final"] > 200){
        alert("Final timestep lockdown must be lesser or equal to timesteps")
        return -1
    }

    else if ( !(isItNumber(lockdown_info[index_objects.at(-1)]["severity"]))){
        alert("Lockdown Mobility Reduction must be a Float type number")
        return -1
    }

    else if ( !(isItNumber(lockdown_info[index_objects.at(-1)]["lockdown_permeability"]))){
        alert("Lockdown Permeability must be a Float type number")
        return -1
    }

    else if ( !(isItNumber(lockdown_info[index_objects.at(-1)]["lockdown_distance"]))){
        alert("Lockdown Social Distance must be a Float type number")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["severity"] > 100 || lockdown_info[index_objects.at(-1)]["severity"] < 0 ){
        alert("Lockdown Mobility Reduction must be greater or equal than 0 and lesser or equal than 100")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["lockdown_distance"] < 0 ){
        alert("Lockdown Social Distance must be greater or equal than 0 and lesser or equal than 100")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["lockdown_permeability"] < 0 ){
        alert("Lockdown Permeability must be greater or equal than 0 and lesser or equal than 100")
        return -1
    }

    try {
        //for (let i of index_objects.slice(0, -1)) {
        for (let i of Array.range(0, index_objects.length - 2)) {
            for (let ii of Array.range(lockdown_info[index_objects.at(i)]["init"], lockdown_info[index_objects.at(i)]["final"])) {
                if (Array.range(lockdown_info[index_objects.at(-1)]["init"], lockdown_info[index_objects.at(-1)]["final"]).includes(parseInt(ii, 10))) {
                    alert("There is an overlap between lockdown ranges");
                    return -1;
                }
            }
        }
    } catch (e){
        alert(e);
        return -1;
    }

    return 0

}

//add lockdonw button
document.getElementById('lockdown_button').addEventListener("click", function(){
  console.log(document.getElementById('cat_map_id').getElementsByTagName('script'))
  var parentElement = document.getElementById('form-elements');
  var newElement = document.createElement('li');
  var ulElement = document.createElement('ul');
  ulElement.id = "lockdown_data_" + lockdown_data_count.toString();
  var newElementChild = document.createElement('a');
  var divContent = document.createElement("div");
  var deleteButton = document.createElement("button");
  deleteButton.setAttribute("class", "btn btn-danger");
  deleteButton.setAttribute("type", "button");
  deleteButton.innerText = "Delete";
  deleteButton.setAttribute("id", lockdown_data_count);

  newElementChild.href = "#";
  newElementChild.className = "has-chevron";
  newElementChild.setAttribute("data-toggle", "collapse");
  newElementChild.setAttribute("data-target", "#"+ulElement.id);
  newElementChild.setAttribute("aria-expanded", "false");
  newElementChild.setAttribute("aria-controls", ulElement.id);

  ulElement.setAttribute("class", "collapse");
  ulElement.setAttribute("aria-labelledby", ulElement.id);

  var init_time_step = document.getElementById("init_time_step").value;
  var final_time_step = document.getElementById("final_time_step").value;
  var lockdown_severity = document.getElementById("lockdown_severity").value;
  var lockdown_type = document.getElementById("lockdown_select").value;
  var lockdown_permeability = document.getElementById("lockdown_permeability").value;
  var lockdown_distance = document.getElementById("lockdown_distance").value;
  divContent.setAttribute("style", "text-align: center;");
  newElement.setAttribute("style", "border:0.5px solid #FFFFFF;");

  newElementChild.innerText = "init: " + init_time_step.toString() + " final: " + final_time_step.toString() + " m_reduction: " + lockdown_severity.toString();
  divContent.innerText  = "Init: " + init_time_step.toString() +
      "\n Final: " + final_time_step.toString() + "\n Mobility reduction: "
      + lockdown_severity.toString() + " \nLockdown type: " + lockdown_type.toString() + " \nLockdown permeability: "
      + lockdown_permeability.toString() + " \nLockdown social distance: " + lockdown_distance.toString() + "\n";



  //Add new lockdown to the global dict
  lockdown_info[lockdown_data_count] = {
      "init": parseInt(init_time_step, 10),
      "final": parseInt(final_time_step, 10),
      "severity": parseInt(lockdown_severity, 10),
      "lockdown_type": lockdown_type,
      "lockdown_permeability": parseInt(lockdown_permeability, 10),
      "lockdown_distance": parseInt(lockdown_distance, 10)

  };

  //Check overlaps lockdowns
  check_int = checkValuesLockdown();
  if (check_int === -1)
  {
      return check_int
  }

  //Generate new HTML object for lockdown
  divContent.appendChild(deleteButton);
  newElement.appendChild(newElementChild);
  newElement.appendChild(ulElement);
  parentElement.appendChild(newElement);
  ulElement.appendChild(divContent);


  lockdown_data_count = lockdown_data_count + 1;
  lockdownResetValues();

  deleteButton.addEventListener("click", function(){
      newElement.remove();
      delete lockdown_info[deleteButton.id];

  });

});



//Request button eventListener
document.getElementById('init_simulation').addEventListener("click", function(){
    $('#time_steps_range').val(0);
    document.getElementById('time_steps_range').setAttribute('disabled', true);
    document.getElementById('init_simulation').disabled = true;
    $.ajax({
    type: "GET",
    url: "map_query",
    data: {
        "population": document.getElementById('population_id').value,
        "lockdown_info": JSON.stringify(lockdown_info)
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

        setTimeout(function(){
         document.getElementById('init_simulation').disabled = false;
        }, 1000);

    },
    error: function(data){
        alert("The simulation has throw error");
        setTimeout(function(){
         document.getElementById('init_simulation').disabled = false;
        }, 1000);
    },
});
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
updatex(data1)


// At the beginning, I run the update function on the first dataset:
updatex(data1)