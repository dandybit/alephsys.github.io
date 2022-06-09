from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json

from .MMCAcovid19.django_wrapper import call_julia_script

# Create your views here.
def index(request):
    template = loader.get_template('covid19_simulator_dashboard/index.html')
    context = {
        'test_ko': 'test'
    }
    return HttpResponse(template.render(context, request))

def cat_map(request):
    template = loader.get_template('covid19_simulator_dashboard/cat_map.html')
    context = {
        'test_ko': 'test'
    }
    return HttpResponse(template.render(context, request))


def map_query(request, *a, **kw):
    values_request = request.GET
    simulation_steps, strata_population = call_julia_script.main(values_request.dict())
    data = {}
    if simulation_steps:
        data = {'simulation_steps': simulation_steps, 'strata_population': strata_population, 'test': request.GET}
    return JsonResponse(data)


def request_json_map(request, *a, **kw):
    with open('static/json/cat_provincias.json') as f:
        json_map = json.load(f)
    data = {}
    if json_map:
        data = {'map': json_map, 'test': request.GET}
    return JsonResponse(data)