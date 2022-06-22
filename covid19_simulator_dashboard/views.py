from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json
from django.shortcuts import render

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


#pylint: disable=unused-argument

def dash_example_1_view(request, template_name="demo_six.html", **kwargs):
    'Example view that inserts content into the dash context passed to the dash application'

    context = {}

    # create some context to send over to Dash:
    dash_context = request.session.get("django_plotly_dash", dict())
    dash_context['django_to_dash_context'] = "I am Dash receiving context from Django"
    request.session['django_plotly_dash'] = dash_context

    return render(request, template_name=template_name, context=context)

def session_state_view(request, template_name, **kwargs):
    'Example view that exhibits the use of sessions to store state'

    session = request.session

    demo_count = session.get('django_plotly_dash', {})

    ind_use = demo_count.get('ind_use', 0)
    ind_use += 1
    demo_count['ind_use'] = ind_use

    context = {'ind_use' : ind_use}

    session['django_plotly_dash'] = demo_count

    return render(request, template_name=template_name, context=context)