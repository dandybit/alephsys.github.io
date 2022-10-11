from urllib.request import urlopen
import json
import ssl
ssl._create_default_https_context = ssl._create_unverified_context
import pandas as pd
import plotly
import numpy as np
import json
import plotly.graph_objs as go
import urllib.request
import plotly.express as px



df = px.data.gapminder().query("continent=='Oceania'")
fig = px.line(df, x="year", y="lifeExp", color='country')

fig.update_layout(title_text='Choroplethmapbox',
                  #autosize=False,
                  #width=1200,
                  height=500,
                  margin=dict(l=0, r=0, b=0, t=50),
                  #paper_bgcolor="Black",
                )


fig.show()