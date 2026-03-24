from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Q
from .models import SessionFeedback
from userprofile.models import profile

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

  