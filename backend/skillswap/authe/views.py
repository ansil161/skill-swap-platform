from django.shortcuts import render
from rest_framework.views import APIView

from .serializer import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Userprofile
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated


from google.oauth2 import id_token
from google.auth.transport import requests
from django.contrib.auth import get_user_model
from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
# Create your views here.
activation_token=PasswordResetTokenGenerator()
   
class Register(APIView):
    
    def post(self,request):

        user=RegisterSerializer(data=request.data)
        print(user)
        if user.is_valid():
            user=user.save()
            token=activation_token.make_token(user)
            activation_link=f"http://127.0.0.1:8000/skill/activate/{user.id}/{token}" 
            print('hai iama ',user.email)
            send_mail(
                "activate/"
    "Activate your account",
    f"Click here to activate: {activation_link}",
    settings.EMAIL_HOST_USER,
    [user.email],
)
           


            return Response({'message': "Registration successful. Check email to activate account."},status=status.HTTP_200_OK)
        return Response({"error":user.errors},status=status.HTTP_400_BAD_REQUEST)



class Login(APIView):
    def post(self,request):
        serializer=LoginSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data['user']
            refresh=RefreshToken.for_user(user)
            access_token=str(refresh.access_token)

            response=Response({'message':'Login succesfull'},status=status.HTTP_200_OK)
            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax"
            )
            
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                secure=False,
                samesite="Lax"
            )
            return response
        return Response({'error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)
        

    
    





class RefreshAccessToken(APIView):

    def post(self, request):
        refresh_token = request.COOKIES.get("refresh")

        if not refresh_token:
            return Response({"error": "No refresh token"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            response = Response({"message": "token refreshed"})

            response.set_cookie(
                key="access_token",
                value=access_token,
                httponly=True,
                secure=False,
                samesite="Lax"
            )

            return response

        except TokenError:
            return Response({"error": "Invalid refresh token"}, status=401)
        



User = get_user_model()

class GoogleLogin(APIView):

    def post(self, request):
        token = request.data.get("token")

        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            "119100010798-8d3klnbangb69ac2gpaorq1ndkpip9cb.apps.googleusercontent.com"
        )

        email = idinfo['email']
        name = idinfo.get('name')

        user, created = User.objects.get_or_create(
    email=email,
    defaults={
        "username": email.split("@")[0],
        "is_active": True
    }
)

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        })
    


class Activationapi(APIView):
    def get(self,request,user_id,token):
        try:
            user=Userprofile.objects.get(id=user_id)
        except Userprofile.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        if user.is_active:
            return Response(
                {"message": "Account already activated"},
                status=status.HTTP_400_BAD_REQUEST
            )
        if not activation_token.check_token(user,token):
            return Response(
                {"error": "Invalid or expired activation link"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.is_active=True
        user.save()
        return Response(
            {"message": "Account activated successfully"},
            status=status.HTTP_200_OK
        )




class LogoutAPI(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logout successful"})
        response.delete_cookie("access_token")
        response.delete_cookie("refresh")
        return response