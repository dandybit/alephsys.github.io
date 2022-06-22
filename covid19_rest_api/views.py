from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from rest_framework import permissions
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.http import HttpResponse
import hashlib
from .utils.preprocess_julia import preprocess_julia_json
from .utils.mongo_utils import create_mongo_client
import requests
import subprocess
import json

folder_julia = "flask_julia_simulation_api/covid19_simulator/main.jl"
server_julia = subprocess.Popen(["julia", folder_julia])
url_api_julia_simulation = 'http://127.0.0.1:8081/simulation'
# Create Mongo Client
mongo_client = create_mongo_client()


class SimulationList(APIView):
    """
    List all snippets, or create a new snippet.
    """
    def get(self, request, hash=None, format=None):
        json_request = request.GET.dict()
        check_hash = hashlib.md5(str(json_request).encode('utf-8')).hexdigest()

        json_simulation = requests.post(url_api_julia_simulation, json=json_request).json()
        json_simulation = json.loads(json_simulation)
        json_simulation = preprocess_julia_json(json_simulation)
        json_simulation["hash_id"] = check_hash

        return Response(json_simulation)