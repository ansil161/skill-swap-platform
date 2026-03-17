import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Conversation, chatMessage
from userprofile.models import profile
from asgiref.sync import sync_to_async


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender']

        # save message
        await self.save_message(sender_id, message)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "message": message,
                "sender": sender_id
            }
        )


    async def chat_message(self, event):

        await self.send(text_data=json.dumps({
            "message": event["message"],
            "sender": event["sender"]
        }))


    @sync_to_async
    def save_message(self, sender_id, message):
        conversation = Conversation.objects.get(id=self.conversation_id)
        sender = profile.objects.get(id=sender_id)

        chatMessage.objects.create(
            sender=sender,
            communication=conversation,
            message=message
        )