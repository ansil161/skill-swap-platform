

from rest_framework import generics, permissions
from .models import Conversation, ChatMessage
from .serializer import ConversationSerializer, ChatMessageSerializer
from django.db.models import Q

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    from django.db.models import Q

    def get_queryset(self):
        user_profile = self.request.user.profile
    
        return Conversation.objects.filter(
            Q(swap_request__requester=user_profile) |
            Q(swap_request__provider=user_profile)
        )


class ChatMessageListView(generics.ListAPIView):
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return ChatMessage.objects.filter(
            conversation_id=conversation_id
        ).order_by('created_at')