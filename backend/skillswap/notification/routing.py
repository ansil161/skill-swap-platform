from django.urls import path
from .consumer import Notificationconsumer

websocket_urlpatterns = [
    path("ws/notifications/", Notificationconsumer.as_asgi()),
]