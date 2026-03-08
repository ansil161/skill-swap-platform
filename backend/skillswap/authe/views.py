from django.shortcuts import render
from rest_framework.views import APIView

from .serializer import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.

class Register(APIView):
   
    def post(self,request):

        user=RegisterSerializer(data=request.data)
        if user.is_valid():
            user.save()
            return Response({'message':'User is registered'},status=status.HTTP_200_OK)
        return Response({"error":user.errors},status=status.HTTP_400_BAD_REQUEST)



class Login(APIView):
    def post(self,request):
        user=LoginSerializer(data=request.data)
        if user.is_valid():
            return Response({'message':'Login succesfull'},status=status.HTTP_200_OK)
        return Response({'error':user.errors},status=status.HTTP_400_BAD_REQUEST)


