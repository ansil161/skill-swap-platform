# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, Message
from .serializer import MessageSerializer, ConversationSerializer

class ConversationListView(APIView):
    def get(self, request):
       
        user = request.user
        conversations = Conversation.objects.filter(user1=user) | Conversation.objects.filter(user2=user)
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)


class ChatMessageListView(APIView):
    def get(self, request, conversation_id):
        messages = Message.objects.filter(conversation_id=conversation_id).order_by("timestamp")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)