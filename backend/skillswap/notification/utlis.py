
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification



def send_notitfication(receiver,sender,message):
   

    Notification.objects.create(
        sender=sender,
        receiver=receiver,
        message=message

    )


    channel_layer=get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{receiver.id}",
        {
            "type": "send_notification",
            "message": message,
        
        }
    )

