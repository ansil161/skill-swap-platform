from __future__ import absolute_import, unicode_literals
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skillswap.settings")

app = Celery("skillswap")

# Load settings from Django settings file, CELERY_* keys
app.config_from_object("django.conf:settings", namespace="CELERY")

# Auto-discover tasks in installed apps
app.autodiscover_tasks()