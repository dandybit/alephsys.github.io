import json
import csv


km_l = []
with open("../../static/json/comarcas.geojson") as file:
    json_load = json.load(file)

print(len(json_load['features']))


with open("../../static/json/cat_comarques_2022_output.geojson", 'w') as fp:
    json.dump(json_load, fp)
