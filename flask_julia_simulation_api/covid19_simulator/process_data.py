import json
import csv


km_l = []
with open("map_model/s_i.csv") as file:
    csv_reader = csv.reader(file)
    for row in csv_reader:
        km_l.append(float(row[0]))
print(km_l)


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
''''
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
    "Bages": 179770 + 4703,
    "Baix Camp": 196718,
    "Baix Ebre": 78953,
    "Baix Empordà": 135555,
    "Baix Llobregat": 828732,
    "Baix Penedès": 110086,
    "Barcelonès": 2283173,
    "Barcelonès ": 2283173,
    "Berguedà": 40009,
    "Berguedà ": 40009,
    "Cerdanya": 19107,
    "Cerdanya ": 19107,
    "Conca de Barberà": 19990,
    "Garraf": 152192,
    "Garrigues": 19085,
    "Garrotxa": 58100,
    "Gironès": 191798,
    "Maresme": 455504,
    #"Moianès": 14110, #? valles oriental, Bages y osona
    "Montsià": 69494,
    "Noguera": 38649,
    "Osona": 162499 + 4703,
    "Pallars Jussà": 12994,
    "Pallars Jussà ": 12994,
    "Pallars Sobirà": 7099,
    "Pla d'Urgell": 37532,
    "Pla d'Urgell ": 37532,
    "Pla de l'Estany": 32673,
    "Priorat": 9223,
    "Ribera d'Ebre": 21641,
    "Ripollès": 25352,
    "Ripollès ": 25352,
    "Segarra": 23028,
    "Segrià": 208510,
    "Segrià ": 208510,
    "Selva": 172416,
    "Solsonès": 13897,
    "Solsonès ": 13897,
    "Tarragonès": 264320,
    "Terra Alta": 11302,
    "Urgell": 37235,
    "Urgell ": 37235,
    "Val d'Aran": 10265,
    "Vallès Occidental": 938516,
    "Vallès Oriental": 415491 + 4703,
}

cat_total = 0
for comarca in population:
    cat_total += population[comarca]
#print(cat_total)
#print(len(population))

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