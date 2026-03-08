from django.shortcuts import render
from rest_framework.views import APIView

from .serializer import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
# Create your views here.

class Register(APIView):
   
    def post(self,request):

        user=RegisterSerializer(data=request.data)
        print(user)
        if user.is_valid():
            user.save()
            return Response({'message':'User is registered'},status=status.HTTP_200_OK)
        return Response({"error":user.errors},status=status.HTTP_400_BAD_REQUEST)



class Login(APIView):
    def post(self,request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data['user']
            refresh=RefreshToken.for_user(user)
            access_token=str(refresh.access_token)

            response=Response({'message':'Login succesfull'},status=status.HTTP_200_OK)
            response.set_cookie(key='access_token',value=access_token,secure=False,samesite="Lax",httponly=True)
            response.set_cookie(key='refresh',value=str(refresh),secure=False,samesite="Lax",httponly=True)
            return response
        return Response({'error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        
        
    




