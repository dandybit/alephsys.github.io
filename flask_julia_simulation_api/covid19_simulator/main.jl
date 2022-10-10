using JuliaWebAPI
using Revise
include("MMCAcovid19.jl")
using .MMCAcovid19
using Random
using Distributions
using Graphs
using HTTP
using Sockets
using JSON2
using JSON

function generate_simulation(json_params)

    #------ Geographic and population data ------#

    # Number of strata
    G = 3

    # Number of patches
    M = 5


    # Random population
    Random.seed!(666)

    g_probs = [0.1, 0.6, 0.3]
    m_probs = [0.05, 0.10, 0.15, 0.30, 0.40]
    probs = transpose(m_probs) .* g_probs
    #total_population = 500000
    total_population = parse(Int64, json_params["population"])
    distrib = Multinomial(total_population, reshape(probs, (1, G * M))[1, :])
    nᵢᵍ = convert.(Float64, reshape(rand(distrib), (G, M)))

    # show population
    #println(string("Total population: ", total_population))
    #println("Matrix nᵢᵍ: ")
    #for g in 1:G
     # print(string("  ", g, ":"))
      #for i in 1:M
       # @printf("%10.1f", nᵢᵍ[g, i])
      #end
      #println()
    #end


    # Strata contacts
    C = [0.5980 0.3849 0.0171
      0.2440 0.7210 0.0350
      0.1919 0.5705 0.2376]


    # Random mobility

    # network
    network = erdos_renyi(M, 0.7, is_directed=true)
    for i in 1:M
      add_edge!(network, i, i)   # add self-loops
    end

    # list of edges
    L = ne(network)
    edgelist = zeros(Int64, L, 2)
    edgelist[:, 1] .= src.(edges(network))
    edgelist[:, 2] .= dst.(edges(network))

    # list of commuting probabilities
    Rᵢⱼ = rand(L)
    sum_r = zeros(M)
    for e in 1:L   # find output strengths
      i = edgelist[e, 1]
      sum_r[i] += Rᵢⱼ[e]
    end
    for e in 1:L   # normalize weights
      i = edgelist[e, 1]
      Rᵢⱼ[e] /= sum_r[i]
    end

    # show mobility matrix
    #println("Mobility matrix R:")
    #for e in 1:L
     # printf("  %d -> %d : %.6f\n", edgelist[e, 1], edgelist[e, 2], Rᵢⱼ[e])
    #end


    # Average number of contacts per strata
    kᵍ = [11.8, 13.3, 6.6]

    # Average number of contacts at home per strata
    kᵍ_h = [3.15, 3.17, 3.28]

    # Average number of contacts at work per strata
    kᵍ_w = [1.72, 5.18, 0.0]

    # Degree of mobility per strata
    pᵍ = [0.0, 1.0, 0.05]

    # Patch surfaces (in km²)
    sᵢ = [10.6, 23.0, 26.6, 5.7, 61.6]

    # Density factor
    ξ = 0.01

    # Average household size
    σ = 2.5


    # Collect all population data
    population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)




    #------ Epidemic parameters ------#

    # Infectivity of infected
    βᴵ = 0.075

    # Infectivity of asymptomatic
    βᴬ = 0.5 * βᴵ

    # Exposed rate
    ηᵍ = [1 / 2.444, 1 / 2.444, 1 / 2.444]

    # Asymptomatic infectious rate
    αᵍ = [1 / 5.671, 1 / 2.756, 1 / 2.756]

    # Infectious rate
    μᵍ = [1 / 1.0, 1 / 3.915, 1 / 3.915]

    # Direct death probability
    θᵍ = [0.0, 0.008, 0.047]

    # ICU probability
    γᵍ = [0.0003, 0.003, 0.026]

    # Pre-deceased rate
    ζᵍ = [1 / 7.084, 1 / 7.084, 1 / 7.084]

    # Pre-hospitalized in ICU rate
    λᵍ = [1 / 4.084, 1 / 4.084, 1 / 4.084]

    # Fatality probability in ICU
    ωᵍ = [0.3, 0.3, 0.3]

    # Death rate in iCU
    ψᵍ = [1 / 7.0, 1 / 7.0, 1 / 7.0]

    # ICU discharge rate
    χᵍ = [1 / 20.0, 1 / 20.0, 1 / 20.0]


    # Number of timesteps
    #T = 200
    T = parse(Int64, json_params["timesteps"])
    # Epidemic parameters
    epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)




    #------ Initialization of the epidemics ------#

    # Initial number of exposed individuals
    E₀ = zeros(G, M)

    # Initial number of infectious asymptomatic individuals
    A₀ = zeros(G, M)
    A₀[2, 5] = 2.0
    A₀[3, 3] = 1.0

    # Initial number of infectious symptomatic individuals
    I₀ = zeros(G, M)
    I₀[2, 5] = 1.0

    # show initial exposed
    #println("Initial number of exposed E₀:")
    #for g in 1:G
     # print(string("  ", g, ":"))
      #for i in 1:M
       # printf("%5.1f", E₀[g, i])
      #end
      println()
    #end

    # show initial asymptomatic
    #println("Initial number of infectious asymptomatic A₀:")
    #for g in 1:G
     # print(string("  ", g, ":"))
      #for i in 1:M
       # printf("%5.1f", A₀[g, i])
      #end
      #println()
    #end

    # show initial symptomatic
    #println("Initial number of infectious symptomatic I₀:")
    #for g in 1:G
      #print(string("  ", g, ":"))
      #for i in 1:M
       # printf("%5.1f", I₀[g, i])
      #end
      #println()
    #end


    # Apply initialization
    set_initial_infected!(epi_params, population, E₀, A₀, I₀)




    #------ Containment strategy ------#

    # Single containment parameters

    # Timestep of application of containment
    tᶜ = 30

    # Mobility reduction
    κ₀ = 0.65

    # Permeability of confined households
    ϕ = 0.174

    # Social distancing
    δ = 0.207


    # Multiple containments parameters

    # List of timesteps of application of containments
    tᶜs = [30, 60, 90, 120]

    # List of mobility reductions
    κ₀s = [0.65, 0.75, 0.65, 0.55]

    # List of permeabilities of confined households
    ϕs = [0.174, 0.174, 0.174, 0.174]

    # List of social distancings
    δs = [0.207, 0.207, 0.207, 0.207]


    # No containment as particular case of multiple containments
    tᶜs = [-1]
    κ₀s = [0.0]
    ϕs = [1.0]
    δs = [0.0]

    # Single containment as particular case of multiple containments
    tᶜs = [30]
    κ₀s = [0.65]
    ϕs = [0.174]
    δs = [0.207]

    # Multiple containments
    tᶜs = [30, 60, 90, 120]
    κ₀s = [0.65, 0.75, 0.65, 0.55]
    ϕs = [0.174, 0.174, 0.174, 0.174]
    δs = [0.207, 0.207, 0.207, 0.207]




    #------ Running the model ------#

    # Run the model without containment strategies
    population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)
    epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)
    set_initial_infected!(epi_params, population, E₀, A₀, I₀)

    run_epidemic_spreading_mmca!(epi_params, population; verbose=true)


    # Run the model with a single containment strategy
    population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)
    epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)
    set_initial_infected!(epi_params, population, E₀, A₀, I₀)

    run_epidemic_spreading_mmca!(epi_params, population; tᶜ=tᶜ, κ₀=κ₀, ϕ=ϕ, δ=δ)


    # Run the model with multiple containment strategies
    population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)
    epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)
    set_initial_infected!(epi_params, population, E₀, A₀, I₀)

    run_epidemic_spreading_mmca!(epi_params, population, tᶜs, κ₀s, ϕs, δs; verbose=false)




    #------ Saving results ------#

    # Output path and suffix for results files
    #output_path = "./results/no_containment"
    #output_path = "./results/single_containment"
    output_path = "covid19_rest_api/covid19_simulator/results/json_database"
    suffix = "run01"

    mkpath(output_path)


    # Store compartments
    # store_compartment(epi_params, population, "S", suffix, output_path)
    # store_compartment(epi_params, population, "E", suffix, output_path)
    # store_compartment(epi_params, population, "A", suffix, output_path)
    # store_compartment(epi_params, population, "I", suffix, output_path)
    # store_compartment(epi_params, population, "PH", suffix, output_path)
    # store_compartment(epi_params, population, "PD", suffix, output_path)
    # store_compartment(epi_params, population, "HR", suffix, output_path)
    # store_compartment(epi_params, population, "HD", suffix, output_path)
    # store_compartment(epi_params, population, "R", suffix, output_path)
    # store_compartment(epi_params, population, "D", suffix, output_path)


    # Optional kernel length
    τ = 21

    # Calculate effective reproduction number R
    Rᵢᵍ_eff, R_eff = compute_R_eff(epi_params, population, τ)

    # Calculate and store effective reproduction number R
    # store_R_eff(epi_params, population, suffix, output_path, τ)


    # Save all to json
    @eval using Dates
    start_date = Date("2020-03-01")
    indent = 0
    indent = 2
    json_return = save_json(output_path, suffix, start_date, epi_params, population,
      E₀, A₀, I₀, tᶜs, κ₀s, ϕs, δs, τ, Rᵢᵍ_eff, R_eff, indent)




    #------ Analysis and plots ------#

    # g = 2
    # m = 4

    # plot()
    # plot!(epi_params.ρˢᵍ[g, m, :], lab="S")
    # plot!(epi_params.ρᴱᵍ[g, m, :], lab="E")
    # plot!(epi_params.ρᴬᵍ[g, m, :], lab="A")
    # plot!(epi_params.ρᴵᵍ[g, m, :], lab="I")
    # plot!(epi_params.ρᴿᵍ[g, m, :], lab="R")
    # plot!(epi_params.ρᴰᵍ[g, m, :], lab="D")
    # plot!(epi_params.ρᴴᴿᵍ[g, m, :], lab="H_R")
    # plot!(epi_params.ρᴴᴰᵍ[g, m, :], lab="H_D")
    # plot!(epi_params.ρᴾᴰᵍ[g, m, :], lab="P_D")
    # plot!(epi_params.ρᴾᴴᵍ[g, m, :], lab="P_H")

    # plot!(R_eff.R_eff, lab="R_eff")

    return json_return
end


# "service" functions to actually do the work
function simulation_post(req::HTTP.Request)
    params = JSON.parse(IOBuffer(HTTP.payload(req)))
    simulation = generate_simulation(params)
    return HTTP.Response(200, JSON2.write(JSON.json(simulation)))
end


# define REST endpoints to dispatch to "service" functions
const SIMULATION_ROUTER = HTTP.Router()
HTTP.@register(SIMULATION_ROUTER, "POST", "/simulation", simulation_post)

HTTP.serve(SIMULATION_ROUTER, Sockets.localhost, 8081)

