from django.db import models

from django.db import models
from userprofile.models import profile


# Create your models here.


class Job(models.Model):
    JOB_TYPE_CHOICES = (
        ('full time', 'Full Time'),
        ('part time', 'Part Time'),
        ('internship', 'Internship'),
    )

    posted_by = models.ForeignKey(profile, on_delete=models.CASCADE, related_name="jobs")

    title = models.CharField(max_length=255)
    description = models.TextField()
    skills_required = models.CharField(max_length=255,blank=True)

    location = models.CharField(max_length=255,blank=True)
    salary = models.CharField(max_length=100, blank=True)

    job_type = models.CharField(max_length=20, choices=JOB_TYPE_CHOICES)
    deadline = models.DateField()

    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    company=models.CharField(max_length=100)

    def __str__(self):
        return self.title


class JobApplication(models.Model):
    STATUS_CHOICES = (
        ('applied', 'Applied'),
        ('reviewed', 'Reviewed'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    )

    user = models.ForeignKey(profile, on_delete=models.CASCADE, related_name="applications")
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name="applications")

    resume = models.FileField(upload_to="resumes/")
    cover_letter = models.TextField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    applied_at = models.DateTimeField(auto_now_add=True)
    

    ats_score = models.FloatField(null=True, blank=True)
    ats_feedback = models.TextField(null=True, blank=True)
    processed = models.BooleanField(default=False)
    
   
    class Meta:
        unique_together = ['user', 'job']



