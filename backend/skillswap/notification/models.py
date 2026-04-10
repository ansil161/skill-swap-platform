from django.db import models


from django.db import models
from userprofile.models import profile

# Create your models here.





class Notification(models.Model):
    receiver = models.ForeignKey(profile ,on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(profile, on_delete=models.SET_NULL, null=True, blank=True, related_name="triggered_notifications")

    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.receiver.username} - {self.message[:20]}"
