from rest_framework import serializers
from .models import Simulation

class SimulationSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Simulation
        fields = ['hash_simulation', 'json_file']
