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
    M = 42


    # Random population
    Random.seed!(666)

    g_probs = [1.0]
    #m_probs = [0.05, 0.10, 0.15, 0.30, 0.40]
    m_probs = [0.26474802525966307, 0.5536832282565899, 0.18156874648374752]
    m_probs = [0.001536135349326944, 0.004902606062602732, 0.0037571118593861265, 0.0006974930913482958, 0.0001345333322920367, 0.004232497069056847, 0.0003537084214278846, 0.006171209348094182, 0.0066532785965809325, 0.002684562345085278, 0.004681146123463447, 0.028417804866651887, 0.0037662171571610247, 0.0777860814596122, 0.0013642259632473098, 0.0006557860532258215, 0.0006855914099870991, 0.005260747775082067, 0.0006482835606772162, 0.0020175907575142632, 0.006710229335472618, 0.015674241534785138, 0.00048571818804448135, 0.0023324908311225436, 0.0013357505938014667, 0.005595393044988722, 0.0004491264857506017, 0.00024215999812566609, 0.0012539052205439538, 0.0011211452046724967, 0.0003150705848025671, 0.0007456113503759419, 0.0008678678766793516, 0.0007984016161270378, 0.007216340662353763, 0.0059918315717048, 0.00046379044845923936, 0.008934820682850675, 0.0003887996252120432, 0.0012711950556446034, 0.03196818895408508, 0.014179335792236666, 0.0032126108529807176, 0.010253110477216427, 0.007857470593730528, 0.0014587086197361443, 0.00028135752725072554, 0.008851671843382014, 0.0007397313745613498, 0.012906215677147222, 0.013914395653120923, 0.00561438425924065, 0.009789958187744637, 0.05943183871948202, 0.007876513042342935, 0.16267864001533727, 0.0028530865703771924, 0.0013714842202868064, 0.001433817928478729, 0.011002113455971083, 0.0013557938131904415, 0.004219507068373808, 0.014033500106988785, 0.03278046982575785, 0.0010158112194251162, 0.004878076246227598, 0.002793534343443262, 0.011701976932501214, 0.0009392848248142091, 0.000506443549051306, 0.002622366266028372, 0.002344717380454969, 0.0006589257780150705, 0.0015593411852496484, 0.0018150235008881402, 0.0016697445951822526, 0.015091960705703112, 0.012531072307479588, 0.000969952438684377, 0.018685919771157754, 0.000813119687752984, 0.0026585255223822673, 0.06685696727767544, 0.029654084891774884, 0.0010535080272387667, 0.0033622915087556794, 0.0025766918942601706, 0.00047835275127349305, 9.226527178281573e-05, 0.002902719242461046, 0.00024257931531847016, 0.004232321448000482, 0.004562932824913507, 0.0018411190012712388, 0.003210410475813321, 0.019489419051934537, 0.0025829364639853958, 0.053347031731973096, 0.000935609615310459, 0.0004497493476257405, 0.0004701903736176749, 0.003607911251281188, 0.0004446040092753681, 0.0013836984219231247, 0.004601990620573152, 0.010749664269499793, 0.0003331138823834333, 0.0015996623052292136, 0.0009160807174806361, 0.0038374167296093935, 0.00030801866397457114, 0.00016607748920906832, 0.0008599497536583908, 0.0007689006527583903, 0.00021608082281405187, 0.0005113530804206547, 0.0005951987076301338, 0.0005475575520860031, 0.004949090468108962, 0.004109301085623394, 0.0003180754616593901, 0.006127653605163372, 0.0002666454660572578, 0.0008718074197658401, 0.021924333486740354, 0.009724432215286481]
    #m_probs = [0.004338633419745073, 0.013480020188976965, 0.010607276210201116, 0.001942872260180545, 0.000381279081889186, 0.011941273038250969, 0.01770787917254376, 0.0188832976916105, 0.007578833673815937, 0.013012156582449298, 0.0795514038499972, 0.010567343657817958, 0.2191656861113239, 0.2191656861113239, 0.0038405324237926596, 0.0038405324237926596, 0.0018341136499639167, 0.0018341136499639167, 0.0019188743320656667, 0.014609170702638218, 0.0018320018322898074, 0.005577118493897711, 0.018411018466309693, 0.043724608992158055, 0.0066708480656614035, 0.0037099836948477215, 0.01605000630665551, 0.0012473163116989133, 0.0012473163116989133, 0.0006814451667500835, 0.0036027609520304454, 0.0036027609520304454, 0.0031363372211896715, 0.0008853315640140893, 0.002077356649336323, 0.002433581894273576, 0.002433581894273576, 0.0022104971545176674, 0.020015231964933076, 0.020015231964933076, 0.01655050709541941, 0.0013339968280498536, 0.0013339968280498536, 0.0253725294372985, 0.001084898334217417, 0.00357425141342997, 0.00357425141342997, 0.000985354928396902, 0.09008975801065239, 0.040335141625212644]


    probs = transpose(m_probs) .* g_probs
    total_population = 7763362
    #total_population = parse(Int64, json_params["population"])

    distrib = Multinomial(total_population, reshape(probs, (1, G * M))[1, :])


    nᵢᵍ = convert.(Float64, reshape(rand(distrib), (G, M)))



    # Strata contacts
    C = [0.5980 0.3849 0.0171
      0.2440 0.7210 0.0350
      0.1919 0.5705 0.2376]


    # Random mobility

    #target_i = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 27, 27, 27, 28, 28, 28, 28, 28, 28, 28, 28, 29, 29, 29, 29, 30, 30, 30, 31, 31, 31, 31, 31, 32, 32, 32, 32, 33, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 36, 36, 37, 37, 37, 37, 37, 38, 39, 39, 39, 40, 40, 41]
    #target_f = [0, 2, 8, 9, 11, 12, 13, 16, 17, 18, 21, 31, 33, 34, 35, 37, 38, 39, 40, 41, 1, 2, 5, 8, 10, 11, 12, 13, 15, 19, 20, 21, 25, 29, 32, 33, 35, 40, 41, 2, 5, 7, 8, 9, 11, 12, 13, 15, 16, 17, 20, 21, 22, 32, 33, 34, 37, 40, 41, 3, 7, 11, 13, 14, 15, 18, 21, 22, 24, 25, 26, 34, 36, 39, 40, 4, 5, 6, 9, 13, 24, 27, 34, 5, 7, 9, 11, 12, 13, 14, 16, 17, 20, 21, 22, 23, 24, 25, 28, 33, 34, 37, 39, 40, 41, 6, 10, 13, 23, 26, 27, 34, 40, 7, 9, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 25, 32, 33, 34, 35, 36, 37, 39, 40, 41, 8, 9, 11, 12, 13, 16, 17, 18, 20, 21, 23, 24, 30, 31, 33, 34, 37, 38, 40, 41, 9, 11, 13, 15, 17, 20, 23, 31, 34, 37, 38, 40, 41, 10, 11, 13, 15, 19, 20, 21, 25, 29, 32, 34, 35, 37, 39, 40, 41, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 12, 13, 16, 17, 21, 23, 25, 29, 31, 34, 35, 37, 39, 40, 41, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 14, 15, 16, 18, 20, 21, 22, 25, 32, 33, 36, 39, 40, 41, 15, 20, 21, 25, 32, 34, 40, 41, 16, 17, 18, 20, 28, 31, 33, 34, 37, 39, 40, 41, 17, 21, 22, 23, 24, 34, 35, 37, 40, 41, 18, 20, 21, 24, 26, 28, 31, 33, 34, 35, 37, 39, 40, 19, 20, 21, 25, 29, 32, 33, 34, 35, 36, 40, 41, 20, 21, 23, 25, 28, 29, 32, 34, 35, 37, 39, 40, 41, 21, 22, 24, 25, 35, 37, 40, 41, 22, 25, 36, 40, 41, 23, 29, 31, 32, 34, 37, 40, 24, 26, 28, 33, 34, 36, 39, 41, 25, 29, 30, 32, 33, 34, 35, 40, 41, 26, 27, 28, 34, 39, 40, 27, 34, 40, 28, 29, 33, 34, 36, 37, 39, 40, 29, 35, 40, 41, 30, 31, 37, 31, 34, 37, 38, 40, 32, 37, 40, 41, 33, 34, 36, 39, 40, 41, 34, 36, 37, 39, 40, 41, 35, 37, 39, 40, 41, 36, 40, 37, 38, 39, 40, 41, 38, 39, 40, 41, 40, 41, 41]

    target_i = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 7, 7, 7, 7, 7, 7, 7, 7, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 25, 25, 25, 25, 25, 25, 25, 25, 26, 26, 26, 26, 26, 26, 26, 26, 26, 27, 27, 27, 27, 27, 27, 28, 28, 28, 29, 29, 29, 29, 29, 29, 29, 29, 30, 30, 30, 30, 31, 31, 31, 32, 32, 32, 32, 32, 33, 33, 33, 33, 34, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 35, 36, 36, 36, 36, 36, 37, 37, 38, 38, 38, 38, 38, 39, 40, 40, 40, 41, 41, 42]
    target_f = [1, 3, 9, 10, 12, 13, 14, 17, 18, 19, 22, 32, 34, 35, 36, 38, 39, 40, 41, 42, 2, 3, 6, 9, 11, 12, 13, 14, 16, 20, 21, 22, 26, 30, 33, 34, 36, 41, 42, 3, 6, 8, 9, 10, 12, 13, 14, 16, 17, 18, 21, 22, 23, 33, 34, 35, 38, 41, 42, 4, 8, 12, 14, 15, 16, 19, 22, 23, 25, 26, 27, 35, 37, 40, 41, 5, 6, 7, 10, 14, 25, 28, 35, 6, 8, 10, 12, 13, 14, 15, 17, 18, 21, 22, 23, 24, 25, 26, 29, 34, 35, 38, 40, 41, 42, 7, 11, 14, 24, 27, 28, 35, 41, 8, 10, 11, 12, 13, 14, 15, 16, 18, 19, 20, 21, 22, 23, 24, 26, 33, 34, 35, 36, 37, 38, 40, 41, 42, 9, 10, 12, 13, 14, 17, 18, 19, 21, 22, 24, 25, 31, 32, 34, 35, 38, 39, 41, 42, 10, 12, 14, 16, 18, 21, 24, 32, 35, 38, 39, 41, 42, 11, 12, 14, 16, 20, 21, 22, 26, 30, 33, 35, 36, 38, 40, 41, 42, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 24, 25, 26, 27, 28, 29, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 13, 14, 17, 18, 22, 24, 26, 30, 32, 35, 36, 38, 40, 41, 42, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 15, 16, 17, 19, 21, 22, 23, 26, 33, 34, 37, 40, 41, 42, 16, 21, 22, 26, 33, 35, 41, 42, 17, 18, 19, 21, 29, 32, 34, 35, 38, 40, 41, 42, 18, 22, 23, 24, 25, 35, 36, 38, 41, 42, 19, 21, 22, 25, 27, 29, 32, 34, 35, 36, 38, 40, 41, 20, 21, 22, 26, 30, 33, 34, 35, 36, 37, 41, 42, 21, 22, 24, 26, 29, 30, 33, 35, 36, 38, 40, 41, 42, 22, 23, 25, 26, 36, 38, 41, 42, 23, 26, 37, 41, 42, 24, 30, 32, 33, 35, 38, 41, 25, 27, 29, 34, 35, 37, 40, 42, 26, 30, 31, 33, 34, 35, 36, 41, 42, 27, 28, 29, 35, 40, 41, 28, 35, 41, 29, 30, 34, 35, 37, 38, 40, 41, 30, 36, 41, 42, 31, 32, 38, 32, 35, 38, 39, 41, 33, 38, 41, 42, 34, 35, 37, 40, 41, 42, 35, 37, 38, 40, 41, 42, 36, 38, 40, 41, 42, 37, 41, 38, 39, 40, 41, 42, 39, 40, 41, 42, 41, 42, 42]


    # network m number of patches
    network = Graph(M)

    L = ne(network)
    for i in 1:length(target_i)
      add_edge!(network, target_i[i], target_f[i])   # add self-loops
    end

    # list of edges
    L = ne(network)
    edgelist = zeros(Int64, L, 2)
    edgelist[:, 1] .= src.(edges(network))
    edgelist[:, 2] .= dst.(edges(network))





    # list of commuting probabilities
    Rᵢⱼ = [0.727432071450862, 0.004236671599500106, 0.06381840087806054, 0.0006939208542916807, 0.0008421528400800788, 0.016881306421611238, 0.012373516368001707, 0.028609098042906143, 0.001808922832240077, 0.0015119944572698201, 0.00033375384185990454, 0.0003118804038866875, 0.0003851951931378977, 0.0023796776358725002, 0.0014312591636807294, 0.13419153444102205, 0.0005184531117121343, 0.00031034455562396914, 0.001456455631986477, 0.0004733902763942274, 0.9196236445299987, 0.000566006269246263, 0.0004752101980003587, 0.001007455568427401, 0.012361865258256981, 0.0038726256228485225, 0.0004241769152299097, 0.011624763993200763, 0.00015979379420143772, 0.005108439301259906, 0.03250652532783943, 0.0019254012647143923, 0.0011323993562792633, 0.0028930234294126497, 0.0001417335406130041, 0.0002031952443388214, 0.0024492393442193637, 0.0023759248976036687, 0.001148576144309292, 0.7489312471169103, 0.021026337196440367, 0.0011455233559952449, 0.0010204349003514399, 0.00028539603333308796, 0.048916342200451136, 0.0329438196114395, 0.07502986166156983, 0.0001836203256736855, 0.00030914880733015675, 0.039869487801142585, 0.00015559326774403502, 0.001532493555258557, 0.000681848776525587, 0.0001591143049434894, 0.000495144336974273, 0.00017342284191671411, 0.003230909584993855, 0.018537674484198997, 0.00293587454932523, 0.9192705134945696, 0.0026297895833253026, 0.0016527711098345474, 0.029300203190520163, 0.001003793642826536, 0.010482225497172225, 0.0010199030803457216, 0.0009228069315855192, 0.0015466410938898443, 0.008606714507465493, 0.0007289095976579715, 0.002340715378663458, 0.0068047163367386315, 0.007868861735268769, 0.002782933909404933, 0.003038500910731253, 0.894011120115868, 0.010797216325651565, 0.023929726025138542, 0.0033273225948277597, 0.0073694874050800815, 0.005942863066997401, 0.005398608162825782, 0.049223656303610856, 0.781287538583999, 0.012079381113602341, 0.00026326399102041847, 0.07721386020626105, 0.0022233760693843195, 0.06268870224495775, 0.0005469090346279664, 0.003287149338106935, 0.0006947721274431277, 0.00018704788501674248, 0.00136015486198074, 0.0003317264788940907, 0.00014756570098019238, 0.0009233970117119353, 0.000817478131133894, 0.00046452104541268936, 0.007255934535137287, 0.0038728219076729696, 0.0019285777399247292, 0.0032358433749201734, 0.013107526741273082, 0.0027927187628596205, 0.9147201923175399, 0.002411127343273635, 0.03715465041408976, 0.006527754887162298, 0.0032824565598542268, 0.0037641311122944233, 0.01817846068653829, 0.0051741302999422185, 0.8618439449617918, 9.388207512823997e-05, 0.0002739317296016664, 0.015327753043633352, 0.0006711994214878768, 0.03605005363791768, 0.014852933803146303, 0.00020369192295889628, 0.000421502146656894, 9.60446904649749e-05, 0.000530812372711758, 0.0003912705835063826, 0.0010435216738017134, 0.006218561609303245, 0.0006947787207694507, 0.006956183707247009, 0.00010125091608751876, 0.0012145130753443564, 0.0010131042676531318, 0.00030128588450829927, 0.0038811702213930334, 0.00013651716096633884, 0.0002224478104066729, 0.035534643597205685, 0.0034699603522633034, 0.7629727567753001, 0.005284511240425202, 0.0019821800667388797, 0.004133590725323204, 0.010444925291185332, 0.0029156360700596045, 0.001539249340677989, 0.00026707264649522127, 0.00012090123301243344, 0.0010481857188453275, 0.0011389985885815856, 0.0001195280902591901, 0.0027914437745267984, 0.003331290867500825, 8.085954054085367e-05, 0.0017662298997071569, 0.17953270144015165, 0.0006694455347636868, 0.0011629795490944112, 0.0002712990418290976, 0.86144250282284, 0.001790838601415913, 0.009378388455611873, 0.0002354887710529512, 0.0002888451355534476, 0.0005893780629725858, 0.07694268453799812, 0.009239597191136673, 0.001134103444678326, 0.017918593877361184, 0.003707980933653559, 0.0026114873623308953, 0.0004418782516581907, 0.8781975129029849, 0.0009010777467804548, 0.014372425840684655, 0.00033093496094316127, 0.0010670083761182359, 0.06625446722377058, 0.003783692964693946, 0.0011763771943138792, 0.0006980598922866723, 0.0009573394905438593, 0.00023107380621700666, 0.013450859644200753, 0.0003112270457318766, 0.00016114765649711144, 0.002030257184292956, 0.0018140122344531718, 0.6462859256546379, 0.003635710914203001, 0.2544551269960793, 0.0001941529722780739, 0.00010507829443561348, 4.936478618855738e-05, 0.009454025762659489, 9.41921166047402e-05, 2.4877582914656356e-05, 0.0005300261482761308, 0.006440956980893364, 5.7542891473382614e-05, 6.990458435946364e-05, 0.0004103980843426608, 4.2392692712262934e-05, 2.347509313918937e-05, 0.00017578022931719002, 0.0001327429923659356, 0.00012064482981398548, 0.0007049388716054303, 0.0007717184557960483, 1.7560212478890325e-05, 0.0013991763684478929, 3.1188965290485856e-05, 4.261100092436091e-05, 0.0458801340471643, 0.008333059902664416, 0.694916650676486, 0.07986816818749702, 0.0006598444924409663, 0.04833922921613001, 0.0009134974306819554, 0.0004624301231988911, 0.0009194790474147539, 0.0003665915919717498, 0.001012960360595805, 0.0008514198757344003, 0.00031755760979454835, 0.052221430266459735, 0.0005203028819821611, 0.008995969526100852, 0.001209079578922856, 0.7850078765865031, 0.00043511710331728507, 0.00022380892649903822, 0.0001335360152605729, 0.006684916438265026, 6.368807070910111e-05, 0.00011042545206639383, 0.0012143302661805832, 0.024888945296032312, 0.00023191878399335435, 0.0001450758896259718, 0.00012545375735243416, 0.0020531733044416283, 7.783104864395717e-05, 5.72432604366703e-05, 0.000172427549583432, 9.862878454017235e-05, 1.6034379602108857e-05, 3.9600913062037314e-05, 0.00018146420888511157, 0.0001909198640166913, 0.0006245088849048501, 0.0017504441093866476, 6.257012866351973e-05, 0.0018824168117859662, 4.781750000579668e-05, 0.00014509230511544803, 0.058372760654273784, 0.020961797244340948, 0.8554870089602669, 0.004499477136624699, 0.0009099915347804959, 0.0008811952166357211, 0.0009492360723854616, 0.0010923318672830286, 0.0005055559946869985, 0.0038467012919139545, 0.0008708971227716839, 0.00045498766617866503, 0.002722610430881198, 0.0010707526306507312, 0.011899679945926639, 0.0005951017680188051, 0.9220187405462542, 0.0017611873562014134, 0.0031793927078136476, 0.004037088594944673, 0.0008115773594958492, 0.0025150866346079215, 0.002956195766890523, 0.0037120589097814917, 0.7862811075189728, 0.002411851617511278, 0.006948631696702918, 0.0007508495690399911, 0.002576509515685139, 0.0025681853821205715, 0.001636971768796808, 0.010562531130476232, 0.04858206004791016, 0.006148990962776721, 0.0013820582295393177, 0.0019717691710410346, 0.7158795488023131, 0.0013165084045268546, 0.0002702592703063804, 0.0002338042962098282, 0.0002479084116014797, 0.000549215760579564, 0.00024265770820854567, 0.006837694718106934, 0.010880314509248768, 0.002992320312281795, 0.7747347853180643, 0.0022467099403471113, 0.001347666411612837, 0.0021836238042648795, 0.0007845029165679732, 0.05829753971842702, 0.004520562656463361, 0.0013811430727615913, 0.11428231336926155, 0.0023100708839162752, 0.001403019233300329, 0.003177039827590791, 0.0020801051356530696, 0.8979827018929496, 0.03444554664791776, 0.0008848381385809603, 0.0033847894953387588, 0.025113168984790924, 0.006801470189743543, 0.00038099859554612035, 0.0005562317818636996, 0.007891441676074803, 0.00038015915870008576, 0.0009613209131366879, 0.0011865909692906683, 0.7983728101331342, 0.005337842602687168, 0.00013127833515345647, 0.0020459811528465966, 9.716870720403656e-05, 0.024166884320332208, 0.0018549312767634383, 0.0003027477865980414, 0.07587288918992255, 8.452196908175764e-05, 9.836309275995702e-05, 0.0029541718771248994, 0.003576855107736279, 0.7293032334200573, 3.6336975017298066e-05, 4.1071602024890585e-05, 0.0009015054226412406, 0.025049786694520928, 0.0003720507019115317, 0.019344579317338094, 0.02995267546276311, 0.7253910643030388, 0.02676689546101544, 0.004005910073998361, 0.017486710284385552, 0.054120158412765934, 0.8825632362737278, 0.00035700502948737915, 0.000272296512617751, 0.0006664161206950887, 0.00032830746399944354, 0.006019135867415169, 0.000992767741922606, 0.8317933561087175, 0.0005611705388794552, 0.010291751262869447, 0.008227547957708083, 0.09596432738326992, 0.001248093404653346, 0.0281188664030011, 0.0009927936056384724, 0.8986172637146542, 0.00023295025492374354, 0.00012079926421045204, 0.006979363944984945, 0.00013380002779417356, 0.00033568539475354534, 0.0041003872523165145, 0.007911592957582828, 0.022892916473089078, 0.9019232415734548, 0.023918660350434655, 0.0013448079049542976, 0.03731429855543148, 0.0014314489802505742, 0.003489734436153607, 0.9051597558362409, 0.01302133713636321, 0.0028377455110292792, 0.7777063941609047, 0.0006654837730786607, 0.0027780112861827515, 0.11317009002553434, 0.0006432175279689564, 0.0019307228695566467, 0.04008979560169008, 0.0029090154856123086, 0.7590570511868652, 0.01707226398780429, 0.003139470509455013, 0.00044143560182998743, 0.8550547318379625, 0.038030914006477866, 0.03568403095723591, 0.841189773555785, 0.016423479334763052, 0.027223703892293758, 0.026445553799831892, 0.0011613310681346089, 0.8926043456525465, 0.0007503347298547213, 0.002905017515584288, 0.0035254211472200018, 0.821508442230214, 0.027330878789066083, 0.0013477029529767343, 0.05520106906606083, 0.0022431173315998554, 0.0017507637593071731, 0.9188556882314319, 0.0003503286405968536, 0.0016050814106480554, 0.005820475861713933, 0.0004983857120051659, 0.00021498725631177539, 0.7584330638773628, 0.0004564494414972679, 0.0004112475641327224, 0.009605598974461874, 0.018724274254205853, 0.8975380338299727, 0.006423822673871779, 0.7880829789296836, 0.0005774306845450985, 0.00014574083334337637, 0.0035210676678257857, 0.0010289368245704291, 0.8825082300408702, 0.8158627640349276, 0.0010589277251151954, 0.0028634016272055226, 0.7281103904518945, 0.03920543835156351, 0.7064506487103409]


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
    sᵢ = [538.0, 1358.0, 593.0, 1447.0, 427.0, 866.0, 634.0, 1092.0, 697.0, 1003.0, 702.0, 486.0, 296.0, 146.0, 1185.0, 547.0, 650.0, 185.0, 798.0, 735.0, 576.0, 399.0, 338.0, 735.0, 1784.0, 1245.0, 1343.0, 1378.0, 305.0, 263.0, 499.0, 827.0, 957.0, 723.0, 1397.0, 995.0, 1001.0, 319.0, 743.0, 580.0, 583.0, 735.0]

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
    T = parse(Int64, json_params["timesteps"])
    # Epidemic parameters
    epi_params = Epidemic_Params(βᴵ, βᴬ, ηᵍ, αᵍ, μᵍ, θᵍ, γᵍ, ζᵍ, λᵍ, ωᵍ, ψᵍ, χᵍ, G, M, T)




    #------ Initialization of the epidemics ------#

    # Initial number of exposed individuals
    E₀ = zeros(G, M)

    # Initial number of infectious asymptomatic individuals
    A₀ = zeros(G, M)
    A₀[1, 5] = 2.0
    A₀[1, 3] = 1.0

    # Initial number of infectious symptomatic individuals
    I₀ = zeros(G, M)
    I₀[1, 5] = 1.0

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




    #------ Containment strategy ------# #-----------------------WEB SITE

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



     # List of timesteps of application of containments
    tᶜs = Int[]

    # List of mobility reductions
    κ₀s = Float64[]

    # List of permeabilities of confined households
    ϕs = Float64[]

    # List of social distancings
    δs = Float64[]

    for lockdown in Dict(JSON.parse(json_params["lockdown_info"]))
        # lockdown timesteps
        tᶜs = append!(tᶜs, [timestep for timestep in lockdown.second["init"]:lockdown.second["final"]])
        # severity
        κ₀s = append!(κ₀s, [convert(AbstractFloat, lockdown.second["severity"]) for x in lockdown.second["init"]:lockdown.second["final"]])
        # lockdown_permeability
        ϕs = append!(ϕs, [convert(AbstractFloat, lockdown.second["lockdown_permeability"]) for x in lockdown.second["init"]:lockdown.second["final"]])
        # lockdown_distance
        δs = append!(δs, [convert(AbstractFloat, lockdown.second["lockdown_distance"]) for x in lockdown.second["init"]:lockdown.second["final"]])
    end

    if length(Dict(JSON.parse(json_params["lockdown_info"]))) == 0
        tᶜs = [-1]
        κ₀s = [0.0]
        ϕs = [1.0]
        δs = [0.0]
    end

    # No containment as particular case of multiple containments # <----------------------------------------------
    #tᶜs = [-1]
    #κ₀s = [0.0]
    #ϕs = [1.0]
    #δs = [0.0]

    # Single containment as particular case of multiple containments
    #tᶜs = [30]
    #κ₀s = [0.65]
    #ϕs = [0.174]
    #δs = [0.207]

    # Multiple containments
    #tᶜs = [30, 60, 90, 120]
    #κ₀s = [0.65, 0.75, 0.65, 0.55]
    #ϕs = [0.174, 0.174, 0.174, 0.174]
    #δs = [0.207, 0.207, 0.207, 0.207]



    #------ Running the model ------#

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

#generate_simulation(1)