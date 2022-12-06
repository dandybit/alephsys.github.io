import json
import csv

'''
km_l = []
with open("map_model/s_i.csv") as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        km_l.append(float(row[0]))
print(km_l)
'''

'''
init_node = []
final_node = []


with open("map_model/edgelist.csv") as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        #print(row[0])
        edge_i, edge_f = row[0].split(';')
        edge_i = int(edge_i)
        edge_f = int(edge_f)
        print(f"{edge_i} and {edge_f}")
        init_node.append(edge_i)
        final_node.append(edge_f)

print(init_node)
print(final_node)
'''

''''
prob_r = []
with open("map_model/R_ij.csv") as file:
    print(file)
    csv_reader = csv.reader(file)
    for row in csv_reader:
        print(row[0])
        prob_r.append(float(row[0]))

print(prob_r)
'''

strata_0 = []
strata_1 = []
strata_2 = []
population_total = 0
poputation_0 = 0
population_1 = 0
population_2 = 0
counter = 0
with open("map_model/n_gi.csv") as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        strata_tmp = row[0].split(';')
        for data  in strata_tmp:
            if counter == 0:
                strata_0.append(float(data))
                population_total += float(data)
                poputation_0 += float(data)
            elif counter == 1:
                strata_1.append(float(data))
                population_total += float(data)
                population_1 += float(data)
            else:
                strata_2.append(float(data))
                population_total += float(data)
                population_2 += float(data)
        counter += 1

print("************")
print(strata_0)
print(strata_1)
print(strata_2)
print(population_total)
print("************")




'''
prob_g_0 = 0.0
prob_g_1 = 0.0
prob_g_2 = 0.0

strata_0_prob = []
strata_1_prob = []
strata_2_prob = []

counter = 0
for index_s in range(3):
    for index_p in range(len(strata_0)):
        if counter == 0:
            strata_0_prob.append(strata_0[index_p] / population_total)
            prob_g_0 += strata_0[index_p]
        elif counter == 1:
            prob_g_1 += strata_1[index_p]
            print(strata_1_prob)
            strata_1_prob.append(strata_1[index_p] / population_total)
        else:
            prob_g_2 += strata_2[index_p]
            strata_2_prob.append(strata_2[index_p] / population_total)
    counter += 1

print(prob_g_1)
print(prob_g_2)
print("************")
print(prob_g_0 / population_total)
print(prob_g_1 / population_total)
print(prob_g_2 / population_total)
print(strata_0_prob + strata_1_prob + strata_2_prob)
print("************")

'''

# https://www.idescat.cat/indicadors/?id=aec&n=15224&lang=es
population = {
    "Alt Camp": 45198,
    "Alt Empordà": 140429,
    "Alt Penedès": 110502,
    "Alt Urgell": 20240,
    "Alta Ribagorça": 3972,
    "Anoia": 124399,
    "Bages": 179770 + 4703, # <--
    "Baix Camp": 196718, # <-- 7
    "Baix Ebre": 78953, # <-- 8
    "Baix Empordà": 135555, # <-- 9
    "Baix Llobregat": 828732, # <-- 10
    "Baix Penedès": 110086, # <-- 11
    "Barcelonès": 2283173, # <-- 12
    "Barcelonès ": 2283173, # <-- 13
    "Berguedà": 40009, # <-- 14
    "Berguedà ": 40009, # <-- 15
    "Cerdanya": 19107, # <-- 16
    "Cerdanya ": 19107, # <-- 17
    "Conca de Barberà": 19990, # <-- 18
    "Garraf": 152192, # <-- 19
    "Garrigues": 19085, # <-- 20
    "Garrotxa": 58100, # <-- 21
    "Gironès": 191798, # <-- 22
    "Maresme": 455504, # <-- 23
    #"Moianès": 14110, #? valles oriental, Bages y osona
    "Montsià": 69494, # <-- 24
    "Noguera": 38649, # <-- 25
    "Osona": 162499 + 4703, # <-- 26
    "Pallars Jussà": 12994, # <-- 27
    "Pallars Jussà ": 12994, # <-- 28
    "Pallars Sobirà": 7099, # <-- 29
    "Pla d'Urgell": 37532, # <-- 30
    "Pla d'Urgell ": 37532, # <-- 31
    "Pla de l'Estany": 32673, # <--32
    "Priorat": 9223, # <-- 33
    "Ribera d'Ebre": 21641, # <-- 34
    "Ripollès": 25352, # <-- 35
    "Ripollès ": 25352, # <-- 36
    "Segarra": 23028, # <-- 37
    "Segrià": 208510, # <-- 38
    "Segrià ": 208510, # <-- 39
    "Selva": 172416, # <-- 40
    "Solsonès": 13897, # <-- 41
    "Solsonès ": 13897, # <--42
    "Tarragonès": 264320, # <-- 43
    "Terra Alta": 11302,# <-- 44
    "Urgell": 37235, # <-- 45
    "Urgell ": 37235, # <-- 46
    "Val d'Aran": 10265, # <-- 47
    "Vallès Occidental": 938516, # <-- 48
    "Vallès Oriental": 415491 + 4703, # <--49
}

cat_total = 0
for comarca in population:
    cat_total += population[comarca]
#print(cat_total)
print(len(population))

final_list = []

for x in population:
    final_list.append((population[x] / cat_total))

#print(final_list)

km = [538, 1357.5, 592.7, 1447, 426.9, 866.9, 1092.3, 697.3, 1035, 701.7, 486, 296.4, 145.75, 145.75, 1185.2, 1185.2,
      1086, 1086, 650.2, 185.3, 797.6, 734.5, 575.6, 398.5, 733.40, 1784.06, 1245, 1343, 1343, 1377.9, 305.1, 305.1,
      262.8, 498.6, 827.3, 956.6, 956.6, 722.8, 1396, 1396, 995, 1001.2, 1001.2, 318.9, 743.4, 579.7, 579.7, 633.6,
      583.1, 735]

#print(len(km))

#print(len(population))

zone_1 = "11925.574797821519;38060.70560737966;29167.819438907587;5414.8913606358865;1044.4309596493704;32858.40691102729;2745.966517993224;47909.33214703913;51651.810232109725;20841.22929646593;36341.43193134342;220617.70642518025;29238.507161651916;603881.5089324577;10590.980002487557;5091.104525743319;5322.494299820264;40841.08936865665;5032.859960186192;15663.28741843744;52093.93943429336;121684.81110997258;3770.8061237733796;18107.970683685166;10369.915401395738;43439.061740529716;3486.7314926697613;1879.9757273688667;9734.520140772547;8703.85607843668;2446.007005374026;5788.450824277271;6737.572494833163;6198.2807673792295;56023.064877172015;46516.7575341733;3600.573143531416;69364.24736605695;3018.3922359854173;9868.747389579195;248180.62333496378;110079.31667469"
zone_2 = "24940.66101681808;79598.60826062385;61000.388623485;11324.483067532028;2184.2803354722464;68718.73282538186;5742.802443477348;100195.62435176897;108022.49046640412;43586.49741158699;76002.98937632555;461390.87830495526;61148.22204542951;1.2629331721067484e6;22149.543863176612;10647.328479374219;11131.24762087048;85413.38952377455;10525.518169157769;32757.560833344614;108947.14145759263;254486.65378743503;7886.1102200586065;37870.27176306596;21687.21836758236;90846.68304265646;7292.008116139285;3931.7046038500434;20358.378619766547;18202.88981216364;5115.479345862632;12105.730102602076;14090.68447590195;12962.831739943278;117164.35424814868;97283.25057113932;7530.091904289619;145065.55948645476;6312.542485353379;20639.096016492636;519034.8391987488;230215.39579357917"
zone_3 = "8178.764185360403;26102.6861319965;20003.79193760742;3713.6255718320863;716.2887048783837;22534.86026359086;1883.2310385294284;32857.0435011919;35423.69930148616;14293.273291947082;24923.578692331044;151303.41526986455;20052.27079291858;414152.31896079396;7263.476134335832;3491.566994882463;3650.2580793092584;28009.521107568813;3451.621870656039;10742.15174821795;35726.919108114016;83453.53510259242;2586.083656168015;12418.757553248874;7111.866231021903;29791.255216813828;2391.2603911909537;1289.3196687810905;6676.10123946091;5969.254109399681;1677.5136487633426;3969.8190731206537;4620.743029264889;4250.887492677495;38421.58087467931;31901.99189468739;2469.334952178965;47571.19314748831;2070.0652786612045;6768.156593928169;170206.5374662875;75494.28753173086"

print(zone_3.replace(';', ' '))