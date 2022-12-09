from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json
from django.shortcuts import render
import urllib.request
import dash
from dash import dcc, html
from django_plotly_dash import DjangoDash
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd
import plotly.graph_objs as go
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
import plotly.express as px

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
    with open('static/json/comarcas_cat.geojson') as f:
        json_map = json.load(f)
    data = {}
    locations = [k for k in range(42)]
    nombre_comarques = []

    dup = ''
    dup_c = 1
    for local in locations:
        #json_map['features'][local]['id'] = local
        json_map['features'][local]['id'] = json_map['features'][local]['properties']['NOMCOMAR']

        if dup == json_map['features'][local]['properties']['NOMCOMAR']:
            json_map['features'][local]['id'] = (json_map['features'][local]['properties']['NOMCOMAR']) + str(' ')
            json_map['features'][local]['properties']['NOMCOMAR'] = json_map['features'][local]['id']
            dup_c += 1
        else:
            dup_c = 1
            dup = json_map['features'][local]['properties']['NOMCOMAR']


    for x in range(len(json_map['features'])):
        nombre_comarques.append(json_map['features'][x]['properties']['NOMCOMAR'])


    if json_map:
        data = {'map': json_map, 'nom_comarques': nombre_comarques, 'test_data': [x for x in range(42)]}
    return JsonResponse(data)

# Create your views here.
def test_plot(request):
    template = loader.get_template('covid19_simulator_dashboard/index2.html')
    context = {
        'test_ko': 'test'
    }
    return HttpResponse(template.render(context, request))



def map(request):
    template = loader.get_template('covid19_simulator_dashboard/map.html')
    context = {
        'test_ko': 'test'
    }
    app = DjangoDash('SimpleExample')  # replaces dash.Dash

    china_url = 'https://raw.githubusercontent.com/aariste/GeoJSON-Mapas/master/comarques-compressed.geojson'

    def read_geojson(url):
        with urllib.request.urlopen(url) as url:
            jdata = json.loads(url.read().decode())
        return jdata

    jdata = read_geojson(china_url)

    locations = [k for k in range(50)]
    text = []

    for local in locations:
        jdata['features'][local]['id'] = local

    for x in range(len(jdata['features'])):
        text.append(jdata['features'][x]['properties']['nom_comar'])

    z = [x for x in range(50)]

    fig = go.Figure(go.Choroplethmapbox(z=z,
                                        locations=locations,
                                        colorscale='reds',
                                        colorbar=dict(thickness=20, ticklen=3),
                                        geojson=jdata,
                                        text=text,
                                        hoverinfo='all',
                                        marker_line_width=0.1, marker_opacity=0.75))

    fig.update_layout(title_text='Choroplethmapbox',
                      title_x=0.1,
                      # autosize=False,
                      # width=1200,
                      height=500,
                      margin=dict(l=0, r=0, b=0, t=0),
                      # paper_bgcolor="Black",
                      mapbox=dict(center=dict(lat=41.687016, lon=1.670047),
                                  accesstoken="pk.eyJ1IjoiZGFuZHlsaW9uIiwiYSI6ImNrdWUyczE5MDA4Z24yd3FrdnVxNXNvdTMifQ.9267FYgF4tibdnqHBCiLiA",
                                  style='basic',
                                  zoom=6.8,
                                  ))

    # style = {'heigth': '1000px'}

    app.layout = html.Div([dcc.Graph(
        id='map_container',
        figure=fig,
    )])

    app2 = DjangoDash('SimpleExample2')  # replaces dash.Dash

    df2 = px.data.gapminder().query("continent=='Oceania'")
    fig2 = px.line(df2, x="year", y="lifeExp", color='country')

    fig2.update_layout(title_text='Choroplethmapbox',
                       # autosize=False,
                       # width=1200,
                       height=500,
                       margin=dict(l=0, r=0, b=0, t=50),
                       # paper_bgcolor="Black",
                       )

    app2.layout = html.Div([dcc.Graph(
        id='map_container',
        figure=fig2,
    )])

    return HttpResponse(template.render(context, request))