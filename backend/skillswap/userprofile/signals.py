from authe.models import Userprofile
from django.dispatch import receiver
from .models import profile
from django.db.models.signals import post_save


@receiver(post_save,sender=Userprofile)
def create_profile(sender,instance,created,**kwargs):
    if created:
        profile.objects.create(user=instance)