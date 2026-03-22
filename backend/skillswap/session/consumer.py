import json
from channels.generic.websocket import AsyncWebsocketConsumer

class VideoCallConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_id"]
        self.room_group_name = f"video_{self.room_name}"

        if not hasattr(self.channel_layer, "rooms"):
            self.channel_layer.rooms = {}

        if self.room_group_name not in self.channel_layer.rooms:
            self.channel_layer.rooms[self.room_group_name] = []

        self.channel_layer.rooms[self.room_group_name].append(self.channel_name)

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        users = self.channel_layer.rooms[self.room_group_name]

        
        await self.send(text_data=json.dumps({
            "type": "role",
            "initiator": len(users) == 1
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if hasattr(self.channel_layer, "rooms"):
            if self.room_group_name in self.channel_layer.rooms:
                if self.channel_name in self.channel_layer.rooms[self.room_group_name]:
                    self.channel_layer.rooms[self.room_group_name].remove(self.channel_name)

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