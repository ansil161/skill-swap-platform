import jwt
from django.conf import settings
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from userprofile.models import profile
from asgiref.sync import sync_to_async


class JWTAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):
        headers = dict(scope["headers"])

        cookies = headers.get(b'cookie', b'').decode()
        token = None

       
        for cookie in cookies.split(';'):
            if 'access_token=' in cookie:
                token = cookie.split('=')[1].strip()

        if token:
            try:
                decoded = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded.get("user_id")

                scope["user"] = await self.get_user(user_id)

            except Exception as e:
                print("JWT ERROR:", e)
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    @sync_to_async
    def get_user(self, user_id):
        try:
            return profile.objects.get(user__id=user_id).user
        except:
            return AnonymousUser()