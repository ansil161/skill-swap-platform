from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.permissions import IsAuthenticated
from .models import Conversation
from rest_framework.response import Response
from rest_framework import status
from userprofile.models import profile



# Create your views here.


class MessageApi(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request,conversation_id):
        try:
            conversation = Conversation.objects.get(id=conversation_id)

        except Conversation.DoesNotExist:
            return Response({'error:conversation is not found'},status=status.HT)
        
        user=profile.objects.get(user=request.user)
        if user not in [conversation.swap_request.requester,conversation.swap_request.provider]:
            return Response({'error':"not authorised"},status=status.HTTP_400_BAD_REQUEST)
        
        message=conversation.message.order_by('create_at').values('sender_id','message','create_at')
        return Response(list(message),status=status.HTTP_200_OK)


