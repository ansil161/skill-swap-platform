
from celery import shared_task
from .models import JobApplication
from django.core.mail import send_mail

from django.conf import settings

@shared_task(autoretry_for=(Exception,), retry_backoff=60, retry_kwargs={'max_retries': 5})
def send_email(application_id):
    try:
        applicant = JobApplication.objects.select_related('user__user').get(id=application_id)
        
        subject = 'Interview Scheduled'
        message = f"Your interview is scheduled.\nDate: {applicant.interview_date}\nLink: {applicant.interview_link}"

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [applicant.user.user.email],
            fail_silently=False, 
        )
    except JobApplication.DoesNotExist:
        pass 

@shared_task(autoretry_for=(Exception,), retry_backoff=60, retry_kwargs={'max_retries': 5})
def send_remainder(application_id):
    try:

        applicant = JobApplication.objects.select_related('job__posted_by__user', 'user__user').get(id=application_id)
        
        subject = "Interview Reminder"
        message = f"Reminder: Your interview is tomorrow!\nDate: {applicant.interview_date}\nLink: {applicant.interview_link}"

        recipients = [
            applicant.job.posted_by.user.email,
            applicant.user.user.email,
        ]

        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            recipients,
            fail_silently=False,
        )
    except JobApplication.DoesNotExist:
        pass