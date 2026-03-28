from django.db import models

from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.



User = get_user_model()

class Notification(models.Model):
    receiver = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="triggered_notifications")
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.recipient.username}"
