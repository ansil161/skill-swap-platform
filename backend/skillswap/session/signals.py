from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Q
from .models import SessionFeedback
from userprofile.models import profile


from django.db.models.signals import post_save
from django.dispatch import receiver

from notification.models import Notification
from session.models import Session


@receiver([post_save, post_delete], sender=SessionFeedback)
def update_profile_rating(sender, instance, **kwargs):
    for user_profile in [instance.session.mentor, instance.session.learner]:
        feedbacks = SessionFeedback.objects.filter(
            Q(session__mentor=user_profile) | Q(session__learner=user_profile)
        )
        new_rating = round(feedbacks.aggregate(Avg('rating'))['rating__avg'] or 0, 1)
        if user_profile.rating != new_rating:
            user_profile.rating = new_rating
            user_profile.save()



# @receiver(post_save, sender=Session)
# def session_created_notification(sender, instance, created, **kwargs):
   
#     if created:
       
#         Notification.objects.create(
#             receiver=instance.mentor.user,
#             sender=instance.learner.user,
#             title="New Session Scheduled",
#             message=f"A new session has been scheduled with {instance.learner.user.username} on {instance.scheduled_time}."
#         )
       
#         Notification.objects.create(
#             receiver=instance.learner.user,
#             sender=instance.mentor.user,
#             title="New Session Scheduled",
#             message=f"A new session has been scheduled with {instance.mentor.user.username} on {instance.scheduled_time}."
#         )
