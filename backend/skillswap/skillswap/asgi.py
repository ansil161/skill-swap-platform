import os
import django

from django.core.asgi import get_asgi_application

# VERY IMPORTANT: set settings first
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skillswap.settings")

# Setup Django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from chatapp.routing import websocket_urlpatterns

application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})

print(">>> ASGI server loaded <<<")