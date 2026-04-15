import json
from channels.generic.websocket import AsyncWebsocketConsumer
class Notificationconsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f"chat_{self.conversation_id}"
        user = self.scope["user"] 
        
        print(f"Connecting: {self.room_group_name} - User: {user}")

      
        if user.is_anonymous:
            print(f"Chat rejection: Anonymous user tried to connect to room {self.conversation_id}")
            await self.close()
            return

     
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept() 
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )
    async def send_notification(self,event):
        await self.send(text_data=json.dumps({
            'message':event['message'],
            'type':event.get('type','info')
        }))