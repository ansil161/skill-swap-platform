from django.db import models

# Create your models here.
from django.db import models
from swapsystem.models import SwapRequest
from userprofile.models import profile
from django.utils.timezone import now

# Create your models here.

class Session(models.Model):
    swap_request=models.ForeignKey(SwapRequest,on_delete=models.CASCADE)

    mentor=models.ForeignKey(profile,on_delete=models.CASCADE,related_name='session_mentor')
    learner=models.ForeignKey(profile,on_delete= models.CASCADE,related_name='session_learner')
    scheduled_time = models.DateTimeField()
    video_call_type = models.CharField(max_length=10, choices=[('google', 'Google Meet'), ('internal', 'Internal')])
    google_meet_link = models.URLField(blank=True, null=True)
    internal_room_id = models.CharField(max_length=100, blank=True, null=True)
    status = models.CharField(
    max_length=20,
    choices=[('pending','Pending'), ('scheduled','Scheduled'), ('completed','Completed')],
    default='pending'
)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class SessionFeedback(models.Model):
    session = models.OneToOneField(Session, on_delete=models.CASCADE)
    rating = models.IntegerField()  
    feedback = models.TextField(blank=True)
    create_at=models.DateTimeField(auto_now_add=True)
