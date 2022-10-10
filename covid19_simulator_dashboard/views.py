from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from django.http import JsonResponse
import json
from django.shortcuts import render

import dash
from dash import dcc, html
from django_plotly_dash import DjangoDash
from dash.dependencies import Input, Output
import plotly.express as px
import pandas as pd

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

# Create your views here.
def test_plot(request):
    template = loader.get_template('covid19_simulator_dashboard/index2.html')
    context = {
        'test_ko': 'test'
    }
    return HttpResponse(template.render(context, request))



external_stylesheets = ['https://codepen.io/chriddyp/pen/bWLwgP.css']
app = DjangoDash('SimpleExample')   # replaces dash.Dash

styles = {
    'pre': {
        'border': 'thin lightgrey solid',
        'overflowX': 'scroll'
    }
}

df = pd.DataFrame({
    "x": [1,2,1,2],
    "y": [1,2,3,4],
    "customdata": [1,2,3,4],
    "fruit": ["apple", "apple", "orange", "orange"]
})

fig = px.scatter(df, x="x", y="y", color="fruit", custom_data=["customdata"])

fig.update_layout(clickmode='event+select')

fig.update_traces(marker_size=20)

app.layout = html.Div([
    dcc.Graph(
        id='basic-interactions',
        figure=fig
    ),

    html.Div(className='row', children=[
        html.Div([
            dcc.Markdown("""
                **Hover Data**

                Mouse over values in the graph.
            """),
            html.Pre(id='hover-data', style=styles['pre'])
        ], className='three columns'),

        html.Div([
            dcc.Markdown("""
                **Click Data**

                Click on points in the graph.
            """),
            html.Pre(id='click-data', style=styles['pre']),
        ], className='three columns'),

        html.Div([
            dcc.Markdown("""
                **Selection Data**

                Choose the lasso or rectangle tool in the graph's menu
                bar and then select points in the graph.

                Note that if `layout.clickmode = 'event+select'`, selection data also
                accumulates (or un-accumulates) selected data if you hold down the shift
                button while clicking.
            """),
            html.Pre(id='selected-data', style=styles['pre']),
        ], className='three columns'),

        html.Div([
            dcc.Markdown("""
                **Zoom and Relayout Data**

                Click and drag on the graph to zoom or click on the zoom
                buttons in the graph's menu bar.
                Clicking on legend items will also fire
                this event.
            """),
            html.Pre(id='relayout-data', style=styles['pre']),
        ], className='three columns')
    ])
])


@app.callback(
    Output('hover-data', 'children'),
    Input('basic-interactions', 'hoverData'))
def display_hover_data(hoverData):
    return json.dumps(hoverData, indent=2)


@app.callback(
    Output('click-data', 'children'),
    Input('basic-interactions', 'clickData'))
def display_click_data(clickData):
    return json.dumps(clickData, indent=2)


@app.callback(
    Output('selected-data', 'children'),
    Input('basic-interactions', 'selectedData'))
def display_selected_data(selectedData):
    return json.dumps(selectedData, indent=2)


@app.callback(
    Output('relayout-data', 'children'),
    Input('basic-interactions', 'relayoutData'))
def display_relayout_data(relayoutData):
    return json.dumps(relayoutData, indent=2)
