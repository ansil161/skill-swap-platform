from django.db import models
from authe.models import Userprofile
# Create your models here.

class profile(models.Model):
    user=models.OneToOneField(Userprofile,on_delete=models.CASCADE)
    bio=models.TextField(blank=True,null=True)
    profile_picture=models.ImageField(blank=True,null=True)
    location=models.CharField( max_length=100, blank=True,null=True)
    experience=models.PositiveIntegerField(default=0)
    swap_count=models.PositiveIntegerField(default=0)
    rating=models.PositiveBigIntegerField(default=0)

    created_at=models.DateTimeField(auto_now=True)
    updated_at=models.DateTimeField(auto_now=True)
    github_link=models.URLField(blank=True,null=True)
    portfolio_link=models.URLField(blank=True,null=True)
    connection_count=models.PositiveBigIntegerField(default=0)


class skill(models.Model):
    name=models.CharField(max_length=100,unique=True)
    
class skill_wanted(models.Model):
    user=models.ForeignKey(profile, on_delete=models.CASCADE,related_name='skillwanted')
    name=models.ForeignKey(skill,on_delete=models.CASCADE)

    created_at=models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class  skilloffered(models.Model):
    user=models.ForeignKey(profile,on_delete=models.CASCADE)
    skills=models.ForeignKey(skill,on_delete=models.CASCADE)
    experience_level = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.user.username} offers {self.skill.name}"

