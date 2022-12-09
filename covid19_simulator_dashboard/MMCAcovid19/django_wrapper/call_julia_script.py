import time
from subprocess import check_output
import os
import json




def preprocess_timestep_string(timestep_info):
    timestep_info = timestep_info.split(', ')
    return_list = []
    #print(timestep_info)
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

    strata_population = generate_overall_values(strata_population)
    #print(simulation_steps)
    #print(strata_population.keys())
    return simulation_steps, strata_population

def generate_overall_values(strata):
    strata_population = strata
    for x in ['Srun01', 'Erun01', 'Arun01', 'Irun01', 'PHrun01', 'PDrun01', 'HRrun01', 'HDrun01', 'Rrun01', 'Drun01']:
        overall = 0.0
        #First time step
        check_p = int(list(strata[x][2].split(',')[1:-2])[0])
        time_s_list = []
        value_list = []
        for stratax, patch, time_s, value in zip(list(strata[x][0].split(',')[1:-2]), list(strata[x][1].split(',')[1:-2]),
                                                list(strata[x][2].split(',')[1:-2]), list(strata[x][3].split(',')[1:-2])):
            if check_p == int(time_s):
                overall = overall + float(value)
            else:
                time_s_list.append(check_p)
                value_list.append(overall)
                check_p = int(time_s)

        strata_population[x + "_overall"] = [time_s_list, value_list]


    for x in ['Srun01', 'Erun01', 'Arun01', 'Irun01', 'PHrun01', 'PDrun01', 'HRrun01', 'HDrun01', 'Rrun01', 'Drun01']:
        overall = 0.0
        #First time step
        check_p = int(list(strata[x][2].split(',')[1:-2])[0])
        time_s_list = []
        value_list = []
        for stratax, patch, time_s, value in zip(list(strata[x][0].split(',')[1:-2]), list(strata[x][1].split(',')[1:-2]),
                                                list(strata[x][2].split(',')[1:-2]), list(strata[x][3].split(',')[1:-2])):
            if check_p == int(time_s):
                overall = overall + float(value)
            else:
                time_s_list.append(check_p)
                value_list.append(overall)
                check_p = int(time_s)
                overall = 0.0

        strata_population[x + "_add"] = [time_s_list, value_list]

    #check numbers of stratas
    strata_int = list(map(lambda x : int(x), list(strata['Srun01'][0].split(',')[1:-2])))
    strata_num = int(max(strata_int))
    for x in ['Srun01', 'Erun01', 'Arun01', 'Irun01', 'PHrun01', 'PDrun01', 'HRrun01', 'HDrun01', 'Rrun01', 'Drun01']:
        strata_overall = {x:0.0 for x in range(1, strata_num+1)}
        strata_values = {x:[] for x in range(1, strata_num+1)}
        strata_time = {x:[] for x in range(1, strata_num+1)}

        #First time step
        check_p = int(list(strata[x][2].split(',')[1:-2])[0])
        time_s_list = []
        value_list = []
        for stratax, patch, time_s, value in zip(list(strata[x][0].split(',')[1:-2]), list(strata[x][1].split(',')[1:-2]),
                                                list(strata[x][2].split(',')[1:-2]), list(strata[x][3].split(',')[1:-2])):
            if check_p == int(time_s):
                strata_overall[int(stratax)] = strata_overall[int(stratax)] + float(value)

            else:
                strata_time[int(stratax)].append(check_p)
                #time_s_list.append(check_p)
                strata_values[int(stratax)].append(strata_overall[int(stratax)])
                #value_list.append(overall)
                check_p = int(time_s)
                strata_overall = {x:0.0 for x in range(1, strata_num+1)}

        strata_population[x + "_strata_add"] = [strata_time, strata_values]

    return strata_population



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
    args_julia = {"data": id_name}
    print(str(args_julia))
    #print(id_name)


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
        out = check_output(['./covid19_simulator_dashboard/MMCAcovid19/django_wrapper/wrapper.sh', str(id_name)])
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

