from django.shortcuts import render
from rest_framework.views import APIView
from .models import chatMessage
from .serializer import MessageSerializer

# Create your views here.


class Message(APIView):
    def post(self,request):
        data=MessageSerializer(data=request.data)
        
