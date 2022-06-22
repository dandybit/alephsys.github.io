from django.apps import AppConfig


class SimulatorModelConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'covid19_simulator_dashboard'


class DjangoPlotlyDashConfig(AppConfig):
    'Verbose name and other settings for the django-plotly-dash application'
    name = 'django_plotly_dash'
    verbose_name = "Django Plotly Dash"