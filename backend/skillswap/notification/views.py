from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializer import NotificationSerializer
from rest_framework import status



class Notificationlistapi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(receiver=request.user.profile).order_by('-created_at')
        serializer = NotificationSerializer(notifications, many=True)
        return Response(serializer.data)

class Notificationmarkapi(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, ):
      
        Notification.objects.filter(receiver=request.user.profile,is_read=False).update(is_read=True)

        
      
        return Response({"message": "Notification marked as read"}, status=status.HTTP_200_OK)