from django.db import models
from userprofile.models import profile
from swapsystem.models import SwapRequest

# Create your models here.
class Conversation(models.Model):
    swap_request = models.OneToOneField(SwapRequest, on_delete=models.CASCADE)
    create_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.id} for Swap {self.swap_request.id}"
    
    
class ChatMessage(models.Model):
    conversation = models.ForeignKey(Conversation, related_name='messages', on_delete=models.CASCADE)
    sender = models.ForeignKey(profile, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender} -> {self.content[:20]}"