import os
import django
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.security.websocket import AllowedHostsOriginValidator # Import this

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skillswap.settings')
django.setup()

from chatapp.routing import websocket_urlpatterns as chat_routes
from videochat.routing import websocket_urlpatterns as video_routes
from chatapp.middleware import JWTAuthMiddleware
from notification.routing import websocket_urlpatterns as notification

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AllowedHostsOriginValidator( 
        JWTAuthMiddleware(
            URLRouter(
                chat_routes + video_routes + notification
            )
        )
    ),
})