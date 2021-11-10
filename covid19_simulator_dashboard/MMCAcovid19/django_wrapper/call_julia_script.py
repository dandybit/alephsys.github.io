import time
from subprocess import check_output
import os
import json




def preprocess_timestep_string(timestep_info):
    timestep_info = timestep_info.split(', ')
    return_list = []
    for x in timestep_info:
        return_list.append(x.split(': ')[1])

    return return_list

def process_text(text):
    #time, players, infected, cases, icus, deaths
    simulation_steps = []
    #strata, patch, time, cases
    strata_population = {}
    text = text.split('\n')
    time_steps = True
    first_line_strata = True
    counter_population = 0
    name_population = ''
    for x in text:
        if x == "barrier_":
            time_steps = False
            continue
        if time_steps:
            simulation_steps.append(preprocess_timestep_string(x))
        elif time_steps == False:
            if first_line_strata:
                strata_population[x] = []
                name_population = x
                first_line_strata = False
            else:
                strata_population[name_population].append(x)
                counter_population = counter_population + 1
                if counter_population == 4:
                    counter_population = 0
                    first_line_strata = True
    #print(simulation_steps)
    #print(strata_population)
    return simulation_steps, strata_population


def generate_name_cache(argsx):
    dict_arg = {}
    error_log = []
    list_arg = []

    try:
        dict_arg['population'] = argsx['population']
    except KeyError:
        dict_arg['population'] = 1000000

    list_arg = int(dict_arg['population'])

    name = 'p' + "_" + str(dict_arg['population'])
    return name

def generate_lockdown_config(argx, id_name):
    lockdown_json_parsed = json.loads(argx["lockdown_info"])
    id_name = id_name + '-' + 'l'
    for x in lockdown_json_parsed.keys():
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["init"])
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["final"])
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["severity"])
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["lockdown_type"][:3])
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["lockdown_permeability"])
        id_name = id_name + "_" + str(lockdown_json_parsed[x]["lockdown_distance"])
    return id_name

def main(argsx, cache=True):
    id_name = generate_name_cache(argsx)
    id_name = generate_lockdown_config(argsx, id_name)
    print(str(argsx))

    if os.path.isdir(os.path.abspath(os.getcwd())+'/cache/'+id_name):
        simulation_steps = []
        strata_population = {}
        with open(os.path.abspath(os.getcwd())+'/cache/'+id_name + '/' + 'simulation_steps', 'r') as f:
            for x in f:
                simulation_steps.append(x.replace('\'', '').replace(']', '').split(', '))
            f.close()
        with open(os.path.abspath(os.getcwd())+'/cache/'+id_name + '/' + 'strata_population', 'r') as f:
            strata_population = json.load(f)
            #strata_population = list(f.read())
            f.close()
        return simulation_steps, strata_population

    else:
        out = check_output(['./covid19_simulator_dashboard/MMCAcovid19/django_wrapper/wrapper.sh', str(argsx)])
        simulation_steps, strata_population = process_text(out.decode('utf-8'))
        try:
            os.makedirs(os.path.abspath(os.getcwd()) + '/cache/' + id_name)
            with open(os.path.abspath(os.getcwd())+'/cache/'+id_name + '/' + 'simulation_steps', 'w') as f:
                for x in simulation_steps:
                    f.write(str(x) + '\n')
                f.close()
            with open(os.path.abspath(os.getcwd())+'/cache/'+id_name + '/' + 'strata_population', 'w') as f:
                json.dump(strata_population, f)
                f.close()
        except FileExistsError:
            None
        return simulation_steps, strata_population




def edgy_mode():
    out = check_output(['./wrapper_edgy.sh', "-p"])
    simulation_steps, strata_population = process_text(out.decode('utf-8'))
    #strata_population = preprocess_strata_population(strata_population)
    #print(strata_population)


if __name__ == '__main__':
    import sys
    argsx = sys.argv[1:]
    main(argsx)
    #edgy_mode()

