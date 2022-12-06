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

def get_simulation_json(json_request):
    json_result = julia_func(3, 5, 500000)
    return json_result
