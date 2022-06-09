## ----------------------------------------------------------------------------
## JSON MANAGEMENT
## ----------------------------------------------------------------------------


function compartment_to_dicts(ρn::Array{Float64, 3}, compartment::String, G::Int64, M::Int64)
  ds = OrderedDict[]

  for m in 1:M
    for g in 1:G
      d = OrderedDict()
      d["compartment"] = compartment
      d["patch"] = m
      d["strata"] = g
      d["evolution"] = ρn[g, m, :]
      push!(ds, d)
    end
  end
  return ds
end


function R_eff_to_dicts(Rᵢᵍ_eff::DataFrame, G::Int64, M::Int64)
  ds = OrderedDict[]

  for m in 1:M
    for g in 1:G
      d = OrderedDict()
      d["compartment"] = "R_eff"
      d["patch"] = m
      d["strata"] = g
      d["evolution"] = Rᵢᵍ_eff[Rᵢᵍ_eff.patch .== m .&& Rᵢᵍ_eff.strata .== g, :].R_eff
      push!(ds, d)
    end
  end
  return ds
end


"""
    save_json(folder::String,
              suffix::String,
              start_date::Date,
              epi_params::Epidemic_Params,
              population::Population_Params,
              E₀::Array{Float64, 2},
              A₀::Array{Float64, 2},
              I₀::Array{Float64, 2},
              tᶜs::Array{Int64, 1},
              κ₀s::Array{Float64, 1},
              ϕs::Array{Float64, 1},
              δs::Array{Float64, 1},
              τ::Int64,
              Rᵢᵍ_eff::DataFrame,
              R_eff::DataFrame,
              indent::Int64 = 0)

Save a full simulation.

# Arguments

- `folder::String`: String containing the path to the folder where the results
  will be stored.
- `suffix::String`: String used to identify the experiment.
- `start_date::Date`: Date corresponding to the first data.
- `epi_params::Epidemic_Params`: Structure that contains all epidemic parameters
  and the epidemic spreading information.
- `population::Population_Params`: Structure that contains all the parameters
  related with the population.
- `E₀::Array{Float64, 2}`: Matrix of size ``G \\times M`` containing the number
  of exposed individuals of each strata on each patch.
- `A₀::Array{Float64, 2}`: Matrix of size ``G \\times M`` containing the number
  of asymptomatic infected individuals of each strata on each patch.
- `I₀::Array{Float64, 2}`: Matrix of size ``G \\times M`` containing the number
  of symptomatic infected individualsof each strata on each patch.
- `tᶜs::Array{Int64, 1}`: List of timesteps of application of containments.
- `κ⁰s::Array{Float64, 1}`: List of mobility reductions.
- `ϕs::Array{Float64, 1}`: List of permeabilities of confined households.
- `δs::Array{Float64, 1}`: List of social distancings.
- `τ::Int64`: kernel length.
- `Rᵢᵍ_eff::DataFrame`: DataFrame containing information about the evolution of the effective
  reproduction number R for each strata and patch.
- `R_eff::DataFrame`: DataFrame containing information about the evolution of the total effective
  reproduction number R.
"""
function save_json(folder::String,
  suffix::String,
  start_date::Date,
  epi_params::Epidemic_Params,
  population::Population_Params,
  E₀::Array{Float64,2},
  A₀::Array{Float64,2},
  I₀::Array{Float64,2},
  tᶜs::Array{Int64,1},
  κ₀s::Array{Float64,1},
  ϕs::Array{Float64,1},
  δs::Array{Float64,1},
  τ::Int64,
  Rᵢᵍ_eff::DataFrame,
  R_eff::DataFrame,
  indent::Int64 = 0)


  # General information
  json_all = OrderedDict(
    "simulation_id" => hash(epi_params),
    "date_run" => today(),
    "model_id" => MMCAcovid19_version
  )

  G = population.G
  M = population.M
  T = epi_params.T


  # All parameters, classified in sevaral groups
  params = OrderedDict()

  params["start_date"] = start_date
  params["end_date"] = start_date + Day(T - 1)
  params["num_timesteps"] = epi_params.T


  # Geographic and population parameters
  population_params = OrderedDict()
  population_params["num_strata"] = population.G
  population_params["num_patches"] = population.M
  population_params["population"] = population.nᵢᵍ
  population_params["contacts"] = population.kᵍ
  population_params["contacts_home"] = population.kᵍ_h
  population_params["contacts_work"] = population.kᵍ_w
  population_params["strata_mixing"] = population.C
  population_params["mobility"] = population.pᵍ
  population_params["strata_mixing"] = population.C
  population_params["edgelist"] = population.edgelist
  population_params["transitions"] = population.Rᵢⱼ
  population_params["patch_surface"] = population.sᵢ
  population_params["density"] = population.ξ
  population_params["household_size"] = population.σ

  params["population_params"] = population_params


  # Epidemic parameters
  epidemic_params = OrderedDict()
  epidemic_params["beta_I"] = epi_params.βᴵ
  epidemic_params["beta_A"] = epi_params.βᴬ
  epidemic_params["eta"] = epi_params.ηᵍ
  epidemic_params["alpha"] = epi_params.αᵍ
  epidemic_params["mu"] = epi_params.μᵍ
  epidemic_params["theta"] = epi_params.θᵍ
  epidemic_params["gamma"] = epi_params.γᵍ
  epidemic_params["zeta"] = epi_params.ζᵍ
  epidemic_params["lambda"] = epi_params.λᵍ
  epidemic_params["omega"] = epi_params.ωᵍ
  epidemic_params["psi"] = epi_params.ψᵍ
  epidemic_params["chi"] = epi_params.χᵍ

  params["epidemic_params"] = epidemic_params


  # Initialization parameters
  initialization_params = OrderedDict()
  initialization_params["initial_E"] = E₀
  initialization_params["initial_A"] = A₀
  initialization_params["initial_I"] = I₀

  params["initialization_params"] = initialization_params


  # Containment parameters
  containment_params = OrderedDict()
  containment_params["containment_timestep"] = tᶜs
  containment_params["mobility_reduction"] = κ₀s
  containment_params["permeability"] = ϕs
  containment_params["social_distancing"] = δs

  params["containment_params"] = containment_params


  # R_eff parameters
  R_eff_params = OrderedDict()
  R_eff_params["kernel_tau"] = τ

  params["R_eff_params"] = R_eff_params


  # Collect all parameters
  json_all["params"] = params



  # All results, classified in three groups
  results = OrderedDict()

  # Compartment evolution results
  compartmental_evolution = OrderedDict[]
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρˢᵍ  .* population.nᵢᵍ, "S" , G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴱᵍ  .* population.nᵢᵍ, "E" , G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴬᵍ  .* population.nᵢᵍ, "A" , G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴵᵍ  .* population.nᵢᵍ, "I" , G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴾᴴᵍ .* population.nᵢᵍ, "PH", G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴾᴰᵍ .* population.nᵢᵍ, "PD", G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴴᴿᵍ .* population.nᵢᵍ, "HR", G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴴᴰᵍ .* population.nᵢᵍ, "HD", G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴰᵍ  .* population.nᵢᵍ, "D" , G, M))
  append!(compartmental_evolution, compartment_to_dicts(epi_params.ρᴿᵍ  .* population.nᵢᵍ, "R" , G, M))

  results["compartmental_evolution"] = compartmental_evolution


  # R_eff results
  results["R_eff_total_evolution"] = R_eff.R_eff
  results["R_eff_evolution"] = R_eff_to_dicts(Rᵢᵍ_eff, G, M)


  # Collect all results
  json_all["results"] = results



  # Save to file
  simulation_id = json_all["simulation_id"]
  mkpath(folder)
  fn_json = @sprintf("%s/%s.json", folder, simulation_id)

  open(fn_json, "w") do io
    JSON.print(io, json_all, indent)

  return json_all

  end

end

