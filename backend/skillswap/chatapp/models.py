from django.db import models
from userprofile.models import profile
from swapsystem.models import SwapRequest

# Create your models here.

class Conversation(models.Model):
    swap_request=models.OneToOneField(SwapRequest,on_delete=models.CASCADE)
    create_at=models.DateTimeField(auto_now_add=True)


class chatMessage(models.Model):
    sender=models.ForeignKey(profile,on_delete=models.CASCADE)
    communication=models.ForeignKey(Conversation,on_delete=models.CASCADE)
    message=models.TextField()
    is_read=models.BooleanField(default=False)
    create_at=models.DateTimeField(auto_now_add=True)