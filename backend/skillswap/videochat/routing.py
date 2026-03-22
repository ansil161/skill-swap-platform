
from django.urls import re_path
from .consumer import VideoCallConsumer

websocket_urlpatterns = [
    re_path(r'ws/video/(?P<room_id>\w+)/$', VideoCallConsumer.as_asgi()),
]