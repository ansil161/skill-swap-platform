from django.db import models
from userprofile.models import profile

# Create your models here.
class chatMessage(models.Model):
    sender=models.ForeignKey(profile,on_delete=models.CASCADE)