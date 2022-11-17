var simulator_steps = 0;
var strata_population = 0;
var lockdown_data_count = 0;
var lockdown_info = {};
var lockdown_info_map = {};
var lockdown_info_map_acc = {};
var acc_ref = 0;
var json_data_map = {};
Array.range = (start, end) => Array.from({length: (end - start+1)}, (v, k) => k + start);

//Check integer or float
function isItNumber(str) {
  return /^\-?[0-9]+(e[0-9]+)?(\.[0-9]+)?$/.test(str);
}

//Reset lockdown create default values.
function lockdownResetValues()
{
  document.getElementById("init_time_step").value = 1;
  document.getElementById("final_time_step").value = 1;
  document.getElementById("lockdown_severity").value = "0.00";
  document.getElementById("lockdown_permeability").value = "0.00";
  document.getElementById("lockdown_distance").value = "0.00";
  document.getElementById("lockdown_select").value = "Lockdown type";
}

//Check integrity of the vars.
function checkValuesLockdown(){
    parent_ul = document.getElementById("form-elements");
    index_objects = Object.keys(lockdown_info);

    //if (lockdown_info[index_objects.at(-1)]["lockdown_type"] === "Lockdown type"){
      //  alert("You must select a lockdown type")
        //return -1
    //}

    if (lockdown_info[index_objects.at(-1)]["init"] > lockdown_info[index_objects.at(-1)]["final"]){
        alert("Final timestep lockdown must be greater than or equal to the init timestep lockdown")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["init"] <= 0) {
        alert("Init timestep lockdown must be equal or greater than 1")
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

    else if (lockdown_info[index_objects.at(-1)]["severity"] > 1.0 || lockdown_info[index_objects.at(-1)]["severity"] < 0 ){
        alert("Lockdown Mobility Reduction must be greater or equal than 0 and equal or lesser than 1.0")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["lockdown_distance"] < 0 ){
        alert("Lockdown Social Distance must be greater or equal than 0")
        return -1
    }

    else if (lockdown_info[index_objects.at(-1)]["lockdown_permeability"] < 0 || lockdown_info[index_objects.at(-1)]["lockdown_permeability"] > 1.0){
        alert("Lockdown Permeability must be greater or equal than 0 and equal or lesser than 1.0")
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

function stringToListInt(string_l)
{
    string_l = string_l.slice(1, -1).split(',');
    string_l = string_l.map(function(item) {
    return parseInt(item, 10);
    });
    return string_l;
}

function stringToListFloat(string_l)
{
    string_l = string_l.slice(1, -1).split(',');
    string_l = string_l.map(function(item) {
    return parseFloat(item);
    });
    return string_l;
}

function processInfoMap(data)
{
    deaths_list_turn = stringToListInt(strata_population["Drun01"][2]);
    deaths_list_strata = stringToListInt(strata_population["Drun01"][1]);
    deaths_list_value = stringToListFloat(strata_population["Drun01"][3]);

    var init = 0;
    var acc = {1:0, 2:0, 3:0, 4:0};
    var x_val = 0;
    var count_x = 0

    for (var x of deaths_list_turn)
    {
        if (x !== init)
        {
            lockdown_info_map[x] = {};
            lockdown_info_map[x][deaths_list_strata[count_x]] = deaths_list_value[count_x];

            init = x;
            x_val = x;
            lockdown_info_map_acc[x - 1] = {};
            Object.assign(lockdown_info_map_acc[x - 1], acc);


        }
        else
        {
            lockdown_info_map[x][deaths_list_strata[count_x]] = deaths_list_value[count_x];
            acc[deaths_list_strata[count_x]] += deaths_list_value[count_x];
            x_val = x;

        }

        count_x += 1;

    }

    lockdown_info_map_acc[x_val] = acc;

    var val_i = 0;
    //max value deaths
    for (var x of Object.keys(acc))
    {
        if (val_i < acc[x])
        {
            val_i = acc[x];
        }
    }

    val_cut = parseInt(val_i / 6, 10);
    acc_ref = [];

    for (var x in Array.range(0, 6))
    {
        acc_ref.push(parseInt( Math.pow(val_cut , x/5.2), 10))
    }
}


//add lockdonw button
document.getElementById('lockdown_button').addEventListener("click", function(){
  //console.log(document.getElementById('cat_map_id').getElementsByTagName('script'))
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



  //Add new lockdown to global dict
  lockdown_info[lockdown_data_count] = {
      "init": parseInt(init_time_step, 10),
      "final": parseInt(final_time_step, 10),
      "severity": parseFloat(lockdown_severity),
      "lockdown_type": lockdown_type,
      "lockdown_permeability": parseFloat(lockdown_permeability),
      "lockdown_distance": parseFloat(lockdown_distance),

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



// Init simulation button eventListener
document.getElementById('init_simulation').addEventListener("click", function(){
    $('#time_steps_range').val(0);
    document.getElementById('time_steps_range').setAttribute('disabled', true);
    document.getElementById('init_simulation').disabled = true;

    $.ajax({
    type: "GET",
    url: "api/simulation",
    data: {
        "population": document.getElementById('population_id').value,
        "timesteps": document.getElementById('timesteps_id').value,
        "lockdown_info": JSON.stringify(lockdown_info),
    },

    success: function(data){

        json_data_map = data
        simulator_steps = data['params']['num_timesteps'];
        strata_population = data['params']['population_params']['num_strata'];
        //alert("success");
        //alert(data['simulation_steps']);
        document.getElementById('time_steps_title').innerText = 'Time steps Model (timestep 0)';
        document.getElementById('time_steps_range').setAttribute('min', 0);
        document.getElementById('time_steps_range').setAttribute('max', simulator_steps - 1) ;
        document.getElementById('time_steps_range').setAttribute('min', 0);
        document.getElementById('time_steps_range').removeAttribute('disabled');
        document.getElementById('time_steps_range').setAttribute('value', 0);

        //document.getElementById('infected_id').innerText = data['results']['total_states']['I'][0];
        document.getElementById('infected_id').innerText = 0;
        document.getElementById('deaths_id').innerText = data['results']['total_states']['D'][0];
        document.getElementById('cases_id').innerText = data['results']['total_states']['S'][0];
        document.getElementById('icus_id').innerText = data['results']['total_states']['PD'][0];

        //Process info for map
        //Redraw map for the new simulation
        //redrawMap(0);
        drawMap(data);
        //Redraw graphs for the new simulation
        drawMainGraph(data);

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
    document.getElementById('infected_id').innerText =  Math.trunc(json_data_map['results']['total_states']['I'][document.getElementById('time_steps_range').value]);
    document.getElementById('deaths_id').innerText =  Math.trunc(json_data_map['results']['total_states']['D'][document.getElementById('time_steps_range').value]);
    document.getElementById('cases_id').innerText = Math.trunc(json_data_map['results']['total_states']['S'][document.getElementById('time_steps_range').value]);
    document.getElementById('icus_id').innerText = Math.trunc(json_data_map['results']['total_states']['PD'][document.getElementById('time_steps_range').value]);

    // stats for stratas
    //redrawMap(document.getElementById('time_steps_range').value)
    drawTimestepLine();
    redrawMap();
});
