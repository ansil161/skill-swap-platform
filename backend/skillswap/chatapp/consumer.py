import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatMessage, Conversation
from userprofile.models import profile

class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        print("🔥 RECEIVE CALLED")
    
        data = json.loads(text_data)
        message = data.get("message")
    
        print("MESSAGE:", message)
    
        user = self.scope["user"]
        print("USER:", user)
    
        saved_message = await self.save_message(user, message)
    
        print("✅ SAVED:", saved_message)
    
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": saved_message["content"],
                "sender": saved_message["sender"], 
            }
        )
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"],
            "current_user": self.scope["user"].username
        }))

    
    @database_sync_to_async
    def save_message(self, user, message):
        conversation = Conversation.objects.get(id=self.conversation_id)
    
        if user.is_anonymous:
            raise Exception("User not authenticated")
    
        sender_profile = profile.objects.select_related("user").get(user=user)
    
        msg = ChatMessage.objects.create(
            conversation=conversation,
            sender=sender_profile,
            content=message
        )
    
        return {
            "content": msg.content,
            "sender": sender_profile.user.username   
        }