from django.db import models
from swapsystem.models import SwapRequest
from userprofile.models import profile

# Create your models here.


class Session(models.Model):
    swap_request=models.ForeignKey(SwapRequest,on_delete=models.CASCADE)

    mentor=models.ForeignKey(profile,on_delete=models.CASCADE,related_name='session_mentor')
    learner=models.ForeignKey(profile,on_delete= models.CASCADE,related_name='session_learner')
    date=models.DateField()
    time=models.TimeField()
    duration=models.IntegerField()

    status_choince=[
        ('scheduled','Scheduled'),
        ('completed','Completed'),
        ('canceled','Canceled')
    ]

    status=models.CharField(max_length=20,choices=status_choince,default='scheduled')
    creted=models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.mentor} witn {self.learner} on {self.date} at {self.time}"