from rest_framework.views import APIView
from rest_framework.response import Response
import hashlib
from .utils.preprocess_julia import preprocess_julia_json
from .utils.mongo_utils import create_mongo_client
import requests
import subprocess
import json
import pandas as pd
from .prevalence_app.machinescientist.mcmc import *
from .prevalence_app.machinescientist.parallel import *
from .prevalence_app.machinescientist.Prior.fit_prior import read_prior_par
from .prevalence_app.BMS_prevalence import *

folder_julia = "covid19_julia_model/covid19_simulator/main.jl"
server_julia = subprocess.Popen(["julia", folder_julia])
url_api_julia_simulation = 'http://127.0.0.1:8081/simulation'

# Create Mongo Client
mongo_client = create_mongo_client()
predictions_db = mongo_client["predictions"]
db = predictions_db["predictions"]

# Prevalence app initialization
country = "Catalonia"
file_traces = "covid19_rest_api/prevalence_app/best_traces/exponent_TP_NOTEST_global.csv"
traces_df = pd.read_csv(file_traces, sep='\t', header=0,
                                names=['t', 'H', 'expr', 'parvals', 'sse', 'bic', 'Hp'])

closest_arg = 416
model_loaded = ensamble_model(traces_df)


class SimulationList(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, hash=None, format=None):
        json_request = request.GET.dict()
        check_hash = hashlib.md5(str(json_request).encode('utf-8')).hexdigest()

        check_simulation = db.find_one({'hash_id': str(check_hash)})
        # check_simulation = None
        if check_simulation:
            del (check_simulation["_id"])
            return Response(check_simulation)
        else:
            json_simulation = requests.post(url_api_julia_simulation, json=json_request).json()
            json_simulation = json.loads(json_simulation)
            json_simulation = preprocess_julia_json(json_simulation)
            json_simulation["hash_id"] = str(check_hash)
            json_simulation["simulation_id"] = str(json_simulation["simulation_id"])
            json_file = json.dumps(json_simulation)
            json_file = json.loads(json_file)
            db.insert_one(json_file)

        return Response(json_simulation)

class PrevalenceApp(APIView):
    """
    List all snippets, or create a new snippet.
    """

    def get(self, request, hash=None, format=None):
        json_request = request.GET.dict()
        results_model = model_loaded.get_dic_predicts_closest(float(json_request['P']), float(json_request['T']))
        return Response(results_model)
