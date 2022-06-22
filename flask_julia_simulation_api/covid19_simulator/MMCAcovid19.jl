"""
Module that contains all the required material to analyze the epidemic spreading
of COVID-19 using MMCA reported in
"""
module MMCAcovid19

MMCAcovid19_version = "MMCAcovid19-0.1.0"

using Statistics
using DataFrames
using CSV
using Printf
using OrderedCollections
using Dates
using JSON

export run_epidemic_spreading_mmca!,
    Epidemic_Params,
    Population_Params,
    set_initial_infected!,
    reset_params!,
    compute_R_eff,
    store_compartment,
    store_R_eff,
    save_json

# Load source from files
include("markov_aux.jl")
include("markov.jl")
include("markov_json.jl")

end
