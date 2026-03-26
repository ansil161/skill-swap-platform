from django.db import models
from authe.models import Userprofile

# Create your models here.

class profile(models.Model):
    user=models.OneToOneField(Userprofile,on_delete=models.CASCADE)
    bio=models.TextField(blank=True,null=True)
    profile_picture = models.ImageField(
        upload_to='profile_photos/',  
        blank=True,
        null=True
    )
    location=models.CharField( max_length=100, blank=True,null=True)
    experience=models.PositiveIntegerField(default=0)
    swap_count=models.PositiveIntegerField(default=0)
    rating=models.DecimalField(max_digits=3, decimal_places=1, default=0.0)

    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    github_link=models.URLField(blank=True,null=True)
    portfolio_link=models.URLField(blank=True,null=True)
    connection_count=models.PositiveBigIntegerField(default=0)
    title=models.CharField(max_length=100,null=True)
    company=models.CharField(max_length=100,blank=True,null=True)
