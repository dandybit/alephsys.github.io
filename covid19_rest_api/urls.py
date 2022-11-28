from django.urls import include, path
from rest_framework import routers
from . import views


# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('', views.SimulationList.as_view()),
    path('simulation/', views.SimulationList.as_view()),
    path('simulation/<str:hash>/', views.SimulationList.as_view()),
    path('prevalence/', views. PrevalenceApp.as_view()),
    path('prevalence/<str:hash>/', views. PrevalenceApp.as_view()),
]