# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, ChatMessage
from .serializer import ChatMessageSerializer, ConversationSerializer
# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation

class ConversationListView(APIView):
    def get(self, request):
        user = request.user
        
        conversations = Conversation.objects.filter(
            swap_request__requester=user
        ) | Conversation.objects.filter(
            swap_request__receiver=user
        )

     
        serializer = ConversationSerializer(conversations.distinct(), many=True)
        return Response(serializer.data)


class ChatMessageListView(APIView):
    def get(self, request, conversation_id):
        messages = ChatMessage.objects.filter(conversation_id=conversation_id).order_by("timestamp")
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)