import jwt
from django.conf import settings
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from asgiref.sync import sync_to_async
from django.contrib.auth import get_user_model

User = get_user_model()

@sync_to_async
def get_user(validated_token):
    try:
        user_id = validated_token["user_id"]
        return User.objects.get(id=user_id)
    except:
        return AnonymousUser()

class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):

        # 🍪 Extract cookies
        headers = dict(scope["headers"])
        cookies = {}

        if b"cookie" in headers:
            cookie_header = headers[b"cookie"].decode()
            for item in cookie_header.split(";"):
                key, value = item.strip().split("=")
                cookies[key] = value

        token = cookies.get("access_token")  

        if token:
            try:
                validated_token = AccessToken(token)
                scope["user"] = await get_user(validated_token)
            except:
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)