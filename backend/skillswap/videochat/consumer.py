import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from session.models import Session
from django.core.cache import cache


class VideoCallConsumer(AsyncWebsocketConsumer):


    async def connect(self):
        self.user = self.scope["user"]
    
        if self.user is None or self.user.is_anonymous:
            await self.close()
            return
    
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"video_{self.room_name}"
    
        if not await self.is_user_allowed():
            await self.close()
            return
    
      
        if cache.get(self.room_group_name) is None:
            cache.set(self.room_group_name, 0)
    
        count = cache.incr(self.room_group_name)
    
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
    
        await self.accept()
    
        await self.send(text_data=json.dumps({
            "type": "role",
            "initiator": count == 1
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
       
        count = cache.get(self.room_group_name, 1)
    
        if count <= 1:
            cache.delete(self.room_group_name)
        else:
            cache.decr(self.room_group_name)
    async def receive(self, text_data):
        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "signal_message",
                "message": data,
                "sender": self.channel_name
            }
        )

    async def signal_message(self, event):
       
        if self.channel_name == event["sender"]:
            return

        await self.send(text_data=json.dumps(event["message"]))

    @sync_to_async
    def is_user_allowed(self):
        try:
            session = Session.objects.get(internal_room_id=self.room_name)
            return (
                self.user == session.mentor.user or
                self.user == session.learner.user
            )
        except Session.DoesNotExist:
            return False