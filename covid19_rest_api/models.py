from django.db import models

# Create your models here.
class Simulation(models.Model):
    hash_simulation = models.TextField(max_length=1024, unique=True)
    json_file = models.TextField(max_length=16384)