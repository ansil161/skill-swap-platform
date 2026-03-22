
from django.urls import re_path
from .consumer import VideoCallConsumer

websocket_urlpatterns = [
    re_path(r'^ws/video/(?P<room_id>[0-9a-f-]+)/$', VideoCallConsumer.as_asgi()),
]