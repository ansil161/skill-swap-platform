from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation, ChatMessage
from userprofile.models import profile


class MessageApi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)
        except Conversation.DoesNotExist:
            return Response(
                {'error': 'conversation not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        user = profile.objects.get(user=request.user)

        if user not in [
            conversation.swap_request.requester,
            conversation.swap_request.provider
        ]:
            return Response(
                {'error': 'not authorised'},
                status=status.HTTP_403_FORBIDDEN
            )

        messages = ChatMessage.objects.filter(
            communication=conversation
        ).order_by('created_at').values(
            'sender_id', 'message', 'create_at'
        )

        return Response(list(messages), status=status.HTTP_200_OK)