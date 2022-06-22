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
from .utils.preprocess_julia import preprocess_julia_json
from .utils.mongo_utils import create_mongo_client

# Julia preload libraries
from julia import Distributions
from julia import Graphs
from julia import Printf
from julia import Revise
from julia import Random
from julia import Dates
from julia import Main
Main.include('covid19_rest_api/covid19_simulator/MMCAcovid19.jl')
julia_func = Main.include("covid19_rest_api/covid19_simulator/main.jl")

# Preload hashmap_simulations
try:
    with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'rb') as handle:
        hashmap_simulations = pickle.load(handle)
# First call dict
except FileNotFoundError:
    hashmap_simulations = {}
    with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'wb') as handle:
        pickle.dump(hashmap_simulations, handle, protocol=pickle.HIGHEST_PROTOCOL)

# Create Mongo Client
mongo_client = create_mongo_client()


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
            json_simulation["hash_id"] = check_hash
            hashmap_simulations[check_hash] = json_simulation
            with open('covid19_rest_api/covid19_simulator/results/hashmap_simulations.pickle', 'wb') as handle:
                pickle.dump(hashmap_simulations, handle)

            #serializer = SimulationSerializer(snippets)
            return Response(hashmap_simulations[check_hash])