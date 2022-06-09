from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from .serializers import SimulationSerializer
from .models import Simulation
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import pickle
import hashlib

# Julia preload libraries
from julia import Julia
j = Julia()
from julia import Distributions
from julia import Graphs
from julia import Printf
from julia import Revise
from julia import Random
from julia import Dates
from julia import Main
Main.include('covid19_rest_api/covid19_simulator/MMCAcovid19.jl')
julia_func = j.include("covid19_rest_api/covid19_simulator/main.jl")

# Preload hashmap_simulations
try:
    with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'rb') as handle:
        hashmap_simulations = pickle.load(handle)
# First call dict
except FileNotFoundError:
    hashmap_simulations = {}
    with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'wb') as handle:
        pickle.dump(hashmap_simulations, handle, protocol=pickle.HIGHEST_PROTOCOL)

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

    # float to int
    for strata_key in total_states.keys():
        total_states[strata_key] = map(int, total_states[strata_key])

    julia_json['results']['total_states'] = total_states
    julia_json['results']['total_patches'] = total_patches


    return julia_json

class SimulationList(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, hash=None, format=None):
        json_request = request.GET.dict()
        check_hash = hashlib.md5(str(json_request).encode('utf-8')).hexdigest()
        if check_hash in hashmap_simulations.keys():
            return Response(hashmap_simulations[check_hash])
        else:
            json_simulation = julia_func(int(json_request["population"]), int(json_request["timesteps"]),
                                        json_request["lockdown_info"])
            json_simulation = preprocess_julia_json(json_simulation)
            hashmap_simulations[check_hash] = json_simulation
            with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'wb') as handle:
                pickle.dump(hashmap_simulations, handle, protocol=pickle.HIGHEST_PROTOCOL)
            #serializer = SimulationSerializer(snippets)
            return Response(json_simulation)