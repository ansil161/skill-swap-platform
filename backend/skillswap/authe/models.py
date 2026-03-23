
from django.contrib.auth.models import AbstractUser
from django.db import models

class Userprofile(AbstractUser):
    email = models.EmailField(unique=True)


    ROLE_CHOICES = (
        ('user', 'User'),
        ('recruiter', 'Recruiter'),
        ('admin', 'Admin'),
    )

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')