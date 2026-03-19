
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Conversation, ChatMessage
from .serializer import ChatMessageSerializer, ConversationSerializer



from userprofile.models import profile



class ConversationListView(APIView):
    def get(self, request):
       
        try:
            user_profile = profile.objects.get(user=request.user)
        except profile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)

        conversations = Conversation.objects.filter(
            swap_request__requester=user_profile
        ) | Conversation.objects.filter(
            swap_request__provider=user_profile
        )

        conversations = conversations.distinct().order_by('-create_at')  

        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data)



class ChatMessageListView(APIView):
    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response({"error": "Conversation not found"}, status=404)

        messages = ChatMessage.objects.filter(conversation=conversation).order_by('created_at')
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)