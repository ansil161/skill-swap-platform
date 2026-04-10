import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillswap.settings')

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

from chatapp.routing import websocket_urlpatterns as chat_routes
from videochat.routing import websocket_urlpatterns as video_routes   
from chatapp.middleware import JWTAuthMiddleware 
from notification.routing import websocket_urlpatterns as notification
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,

    "websocket": JWTAuthMiddleware(
        URLRouter(
            chat_routes + video_routes + notification

        )
    ),
})