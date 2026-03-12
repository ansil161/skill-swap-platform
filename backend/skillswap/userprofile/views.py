from django.shortcuts import render
from rest_framework.views import APIView
from .models import profile
from rest_framework.response import Response
from .serializer import ProfileSerializer
from  rest_framework import status
from rest_framework.permissions import IsAuthenticated

# Create your views here.
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import profile
from .serializer import ProfileSerializer


class profileapi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user_profile = profile.objects.get(user=request.user)
        except profile.DoesNotExist:
            return Response({"message": "Profile not found"}, status=404)

        serializer = ProfileSerializer(user_profile)
        return Response(serializer.data)

    def patch(self, request):
        user_profile = profile.objects.get(user=request.user)

        serializer = ProfileSerializer(
            user_profile,
            data=request.data,
            partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)