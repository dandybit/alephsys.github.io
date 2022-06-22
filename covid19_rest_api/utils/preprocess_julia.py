# Merge some information from julia json
def preprocess_julia_json(julia_json):
    # Susceptible
    # Exposed
    # Asymtomatic
    # Infected
    # Recovered
    # Pre-Hospitalized
    # Pre-Deceased
    # Hospitalized in ICU (Good prognosis)
    # Hospitalized in ICU (you're dying)
    # Deceased
    timesteps = int(julia_json['params']['num_timesteps'])
    patches = int(julia_json['params']['population_params']['num_patches'])
    total_states = {'S': [0.0 for _ in range(timesteps)], 'E': [0.0 for _ in range(timesteps)],
                    'A': [0.0 for _ in range(timesteps)], 'I': [0.0 for _ in range(timesteps)],
                    'R': [0.0 for _ in range(timesteps)], 'PH': [0.0 for _ in range(timesteps)],
                    'PD': [0.0 for _ in range(timesteps)], 'HR': [0.0 for _ in range(timesteps)],
                    'HD': [0.0 for _ in range(timesteps)], 'D': [0.0 for _ in range(timesteps)]}

    total_patches = {'S': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'E': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'A': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'I': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'R': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'PH': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'PD': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'HR': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'HD': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)],
                     'D': [[0.0 for _ in range(timesteps)] for _ in range(patches + 1)]}

    for timesteps_data in julia_json['results']['compartmental_evolution']:
        for data in range(len(timesteps_data['evolution'])):
            total_states[timesteps_data["compartment"]][data] += timesteps_data['evolution'][data]
            total_patches[timesteps_data["compartment"]][timesteps_data['patch']][data] += timesteps_data['evolution'][data]

    julia_json['results']['total_states'] = total_states
    julia_json['results']['total_patches'] = total_patches


    return julia_json