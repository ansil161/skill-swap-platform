from django.db import models
from authe.models import Userprofile
# Create your models here.

class profile(models.Model):
    user=models.OneToOneField(Userprofile,on_delete=models.CASCADE)
    bio=models.TextField(blank=True,null=True)
    profile_picture=models.ImageField(blank=True,null=True)
    locatio=models.CharField( max_length=100, blank=True,null=True)
    experience=models.PositiveIntegerField(default=0)
    swap_count=models.PositiveIntegerField(default=0)
    rating=models.PositiveBigIntegerField(default=0)

    created_at=models.DateTimeField(auto_now=True)
    updated_at=models.DateTimeField(auto_now=True)
    github_link=models.URLField(blank=True,null=True)
    portfolio_link=models.URLField(blank=True,null=True)
    connection_count=models.PositiveBigIntegerField(default=0)



class skill_wanted(models.Model):
    user=models.ForeignKey(profile, on_delete=models.CASCADE,related_name='skillwanted')
    name=models.CharField(max_length=100)

class  skilloffered(models.Model):
    user=models.ForeignKey(profile,on_delete=models.CASCADE)
    name=models.CharField(max_length=100)

