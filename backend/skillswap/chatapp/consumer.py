
from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import ChatMessage, Conversation
from channels.db import database_sync_to_async

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f"chat_{self.conversation_id}"
        user = self.scope["user"] 
        print(self.room_group_name)
        print(user)
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
            self.room_group_name, 
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data["message"]
        user = self.scope["user"]

     
        msg = await self.save_message(user.id, self.conversation_id, message)

      
        await self.channel_layer.group_send(
            self.room_group_name, 
            {
                "type": "chat.message",
                "message": message,
                "sender": user.username,
                "id": msg.id, 
            },
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "id": event["id"], 
        }))

    @database_sync_to_async
    def save_message(self, user_id, conversation_id, message):
        conversation = Conversation.objects.get(id=conversation_id)
        return ChatMessage.objects.create(
            conversation=conversation,
            sender_id=user_id,
            content=message
        )