from django.db import models
from userprofile.models import profile
from skills.models import skill_wanted,skilloffered

# Create your models here.


class SwapRequest(models.Model):
    requester=models.ForeignKey(profile,on_delete=models.CASCADE,related_name='swap_sent')
    provider=models.ForeignKey(profile,on_delete= models.CASCADE,related_name='recieved_swap')
    skill=models.ForeignKey(skilloffered,on_delete=models.CASCADE)

    status_choice=[
        ('Pending','pending'),
        ('Accepted','accepted'),
        ('Rejected','rejected')
    ]
    

    status=models.CharField(max_length=10,choices=status_choice,default='Pending')
    create=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.requester.user.username}: {self.provider.user.username}:{self.skill.skills.name}"

