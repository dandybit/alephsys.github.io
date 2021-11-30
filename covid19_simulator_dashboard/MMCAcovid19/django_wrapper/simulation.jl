#=
example:
- Julia version: 
- Author: konata
- Date: 2021-09-28
=#
using MMCAcovid19

# Number of strata
G = 3

# Number of patches
M = 4

# Random population
using Random
using Distributions

argx_list = split(ARGS[1], '-')
argx_population = parse(Int64, split(argx_list[1], '_')[2],)
argx_lockdown = split(argx_list[2], '_')
argx_lockdown = argx_lockdown[2:lastindex(argx_lockdown)]

timesteps_list = Int64[]
mobility_reduction = Float64[]
lockdown_type = []
lockdown_permability = Float64[]
lockdown_social_distance = Float64[]


counter = 0
init_range = 0
counter_t = 0

for i in argx_lockdown
    if counter % 6 == 0
        global init_range = i
    elseif counter % 6 == 1
        global counter_t = i
        for ii in [parse(Int64, init_range):1:parse(Int64,i);]
            append!(timesteps_list, ii)
        end
    elseif counter % 6 == 2
        for ii in [parse(Int64, init_range):1:parse(Int64,counter_t);]
            append!(mobility_reduction, parse(Float64, i))
        end
    elseif counter % 6 == 3
        for ii in [parse(Int64, init_range):1:parse(Int64,counter_t);]
            append!(lockdown_type, i)
        end
    elseif counter % 6 == 4
        for ii in [parse(Int64, init_range):1:parse(Int64,counter_t);]
            append!(lockdown_permability, parse(Float64,i))
        end
    elseif counter % 6 == 5
        for ii in [parse(Int64, init_range):1:parse(Int64,counter_t);]
            append!(lockdown_social_distance, parse(Float64,i))
        end
    end
    global counter = counter + 1
end



g_probs = [0.1, 0.6, 0.3]
#m_probs = [0.05, 0.10, 0.15, 0.30, 0.40]
m_probs = [0.15, 0.15, 0.30, 0.40]
probs = transpose(m_probs) .* g_probs
#total_population = argx_population
#total_population = parse(Int64,ARGS[1])
total_population = argx_population



distrib = Multinomial(total_population, reshape(probs, (1, G * M))[1, :])
nᵢᵍ = convert.(Float64, reshape(rand(distrib), (G, M)))


# Strata contacts
C = [0.5980 0.3849 0.0171
     0.2440 0.7210 0.0350
     0.1919 0.5705 0.2376]

# Random mobility
using LightGraphs

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


# Average number of contacts per strata
kᵍ = [11.8, 13.3, 6.6]

# Average number of contacts at home per strata
kᵍ_h = [3.15, 3.17, 3.28]

# Average number of contacts at work per strata
kᵍ_w = [1.72, 5.18, 0.0]

# Degree of mobility per strata
pᵍ = [0.0, 1.0, 0.05]

# Patch surfaces (in km²)
sᵢ = [12150.0, 5905.0, 7726.0, 6303.0]

# Density factor
ξ = 0.01

# Average household size
σ = 2.5


population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)


# Infectivity of infected
βᴵ = 0.075

# Infectivity of asymptomatic
βᴬ = 0.5 * βᴵ

# Exposed rate
ηᵍ = [1/2.444, 1/2.444, 1/2.444]

# Asymptomatic infectious rate
αᵍ = [1/5.671, 1/2.756, 1/2.756]

# Infectious rate
μᵍ = [1/1.0, 1/3.915, 1/3.915]

# Direct death probability
θᵍ = [0.0, 0.008, 0.047]

# ICU probability
γᵍ = [0.0003, 0.003, 0.026]

# Pre-deceased rate
ζᵍ = [1/7.084, 1/7.084, 1/7.084]

# Pre-hospitalized in ICU rate
λᵍ = [1/4.084, 1/4.084, 1/4.084]

# Fatality probability in ICU
ωᵍ = [0.3, 0.3, 0.3]

# Death rate in iCU
ψᵍ = [1/7.0, 1/7.0, 1/7.0]

# ICU discharge rate
χᵍ = [1/20.0, 1/20.0, 1/20.0]

# Number of timesteps
T = 200


# Epidemic parameters
epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)

# Initial number of exposed individuals
E₀ = zeros(G, M)

# Initial number of infectious asymptomatic individuals
A₀ = zeros(G, M)
#A₀[2, 5] = 2.0
A₀[2, 4] = 2.0
A₀[3, 3] = 1.0

# Initial number of infectious symptomatic individuals
I₀ = zeros(G, M)
#I₀[2, 5] = 1.0
I₀[2, 4] = 1.0


set_initial_infected!(epi_params, population, E₀, A₀, I₀)

# Timestep of application of containment
tᶜ = 30

# Mobility reduction
κ₀ = 0.65

# Permeability of confined households
ϕ = 0.174

# Social distancing
δ = 0.207

# List of timesteps of application of containments
#tᶜs = [30, 60, 90, 120]
tᶜs = timesteps_list

# List of mobility reductions
#κ₀s = [0.65, 0.75, 0.65, 0.55]
κ₀s = mobility_reduction

# List of permeabilities of confined households
#ϕs = [0.174, 0.174, 0.174, 0.174]
ϕs = lockdown_permability

# List of social distancings
#δs = [0.207, 0.207, 0.207, 0.207]
δs = lockdown_social_distance


using MMCAcovid19

# Geographic and population data
population = Population_Params(G, M, nᵢᵍ, kᵍ, kᵍ_h, kᵍ_w, C, pᵍ, edgelist, Rᵢⱼ, sᵢ, ξ, σ)

# Epidemic parameters
epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)

# Initialization of infectious people
set_initial_infected!(epi_params, population, E₀, A₀, I₀)


# Run the model
run_epidemic_spreading_mmca!(epi_params, population; verbose = true)

# Run the model with a single containment strategy
run_epidemic_spreading_mmca!(epi_params, population; tᶜ = tᶜ, κ₀ = κ₀, ϕ = ϕ, δ = δ)

# Run the model with a single containment strategy
run_epidemic_spreading_mmca!(epi_params, population, tᶜs, κ₀s, ϕs, δs; verbose = false)


# Output path and suffix for results files
output_path = "null"
suffix = "run01"
using DataFrames

# Store compartments
function store_compartment_v2(epi_params::Epidemic_Params,
                           population::Population_Params,
                           compartment::String,
                           suffix::String,
                           folder::String)

    M = population.M
    G = population.G
    T = epi_params.T

    # Init. dataframe
    df = DataFrame()
    df.strata = repeat(1:G, outer = T * M)
    df.patch = repeat(1:M, inner = G, outer = T)
    df.time = repeat(1:T, inner = G * M)

    # Store number of cases
    if compartment == "S"
        df.cases = reshape(epi_params.ρˢᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "E"
        df.cases = reshape(epi_params.ρᴱᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "A"
        df.cases = reshape(epi_params.ρᴬᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "I"
        df.cases = reshape(epi_params.ρᴵᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "PH"
        df.cases = reshape(epi_params.ρᴾᴴᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "PD"
        df.cases = reshape(epi_params.ρᴾᴰᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "HR"
        df.cases = reshape(epi_params.ρᴴᴿᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "HD"
        df.cases = reshape(epi_params.ρᴴᴰᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "D"
        df.cases = reshape(epi_params.ρᴰᵍ .* population.nᵢᵍ, G * M * T)
    elseif compartment == "R"
        df.cases = reshape(epi_params.ρᴿᵍ .* population.nᵢᵍ, G * M * T)
    end
    #CSV.write(@sprintf("%s/output_%s_%s.csv", folder, compartment, suffix), df)
    print(compartment)
    print(suffix)
    print('\n')
    print(df.strata)
    print('\n')
    print(df.patch)
    print('\n')
    print(df.time)
    print('\n')
    print(df.cases)
    print('\n')
end

#print(timesteps_list)
#print(lockdown_permability)
#print(lockdown_social_distance)
#print(mobility_reduction)
print("barrier_\n")
#store_compartment(epi_params, population, "S", suffix, output_path)
store_compartment_v2(epi_params, population, "S", suffix, output_path)
store_compartment_v2(epi_params, population, "E", suffix, output_path)
store_compartment_v2(epi_params, population, "A", suffix, output_path)
store_compartment_v2(epi_params, population, "I", suffix, output_path)
store_compartment_v2(epi_params, population, "PH", suffix, output_path)
store_compartment_v2(epi_params, population, "PD", suffix, output_path)
store_compartment_v2(epi_params, population, "HR", suffix, output_path)
store_compartment_v2(epi_params, population, "HD", suffix, output_path)
store_compartment_v2(epi_params, population, "R", suffix, output_path)
store_compartment_v2(epi_params, population, "D", suffix, output_path)


# Optional kernel length
τ = 21

# Calculate effective reproduction number R
Rᵢᵍ_eff, R_eff = compute_R_eff(epi_params, population, τ)

# Calculate and store effective reproduction number R
#store_R_eff(epi_params, population, suffix, output_path, τ=τ)
