import pickle
import json

with open("hashmap_simulations.pickle", 'rb') as file:
    julia_json = pickle.load(file)
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
print(julia_json.keys())
timesteps = len(julia_json['6be49b21896b862f413bd9f8201cb346']['results']['compartmental_evolution'][0]['evolution'])
total_strata = {'S': [0. for _ in range(timesteps)], 'E': [0.0 for _ in range(timesteps)], 'A': [0.0 for _ in range(timesteps)],
                'I': [0.0 for _ in range(timesteps)], 'R': [0.0 for _ in range(timesteps)], 'PH': [0.0 for _ in range(timesteps)],
                'PD': [0.0 for _ in range(timesteps)], 'HR': [0.0 for _ in range(timesteps)], 'HD': [0.0 for _ in range(timesteps)],
                'D': [0.0 for _ in range(timesteps)]}

for timesteps_data in julia_json['6be49b21896b862f413bd9f8201cb346']['results']['compartmental_evolution']:
    for data in range(len(timesteps_data['evolution'])):
        total_strata[timesteps_data["compartment"]][data] += timesteps_data['evolution'][data]

print(total_strata)