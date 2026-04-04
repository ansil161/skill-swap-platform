from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from notification.models import Notification
from session.models import Session

from swapsystem.models import SwapRequest
from chatapp.models import Conversation

User = get_user_model()


# @receiver(post_save, sender=SwapRequest)
# def swap_request_notification(sender, instance, created, **kwargs):

 
#     if created:
#         Notification.objects.create(
#             receiver=instance.provider.user,
#             sender=instance.requester.user,
#             title="New Swap Request",
#             message=f"{instance.requester.user.username} has sent you a swap request for {instance.skill.skills.name}."
#         )
#     else:
     
#         if instance.status in ['Accepted', 'Rejected']:
#             Notification.objects.create(
#                 receiver=instance.requester.user,
#                 sender=instance.provider.user,
#                 title=f"Swap Request {instance.status}",
#                 message=f"Your swap request for {instance.skill.skills.name} has been {instance.status.lower()} by {instance.provider.user.username}."
#             )