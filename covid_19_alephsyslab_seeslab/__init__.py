# This will make sure the app is always imported when
# Django starts so that shared_task will use this app.
from .celery import app as celery_app
import os
import celery

#__all__ = ('celery_app',)
#os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'proj.settings')
#app = celery.Celery('covid_19_alephsyslab_seeslab')
#app.config_from_object('django.conf:settings', namespace='CELERY')
#app.autodiscover_tasks()