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

from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator

from django.urls import reverse

import requests

from django.contrib.auth import get_user_model

User = get_user_model()
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
        






class GoogleLogin(APIView):

    def post(self, request):

        access_token = request.data.get("token")

        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"}
        )

        data = response.json()

        email = data.get("email")

        if not email:
            return Response({"error": "Invalid Google token"}, status=400)

        name = email.split("@")[0]

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": name}
        )

        refresh = RefreshToken.for_user(user)

        res = Response({"message": "Login successful"})

        res.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=False,  
            samesite="Lax"
        )

        res.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax"
        )

        return res


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


class passwordrequest(APIView):

    def post(self,request):
        email=request.data.get('email')
        if not email:
            return Response({"error":"Email is required"},status=status.HTTP_400_BAD_REQUEST)
        try:
            user=Userprofile.objects.get(emai=email)
        except Userprofile.DoesNotExist:
            return Response({'error':"user email is not found"},status=status.HTTP_404_NOT_FOUND)
        token=default_token_generator.make_token(user)
        reset_url=reset_url = request.build_absolute_uri(
            reverse('password-reset-confirm', kwargs={'uid': user.id, 'token': token})
        )
        send_mail(
            'SkillSwap Password Reset',
            f'Click the link to reset your password: {reset_url}',
            'no-reply@skillswap.com',
            [email],
        )
        return Response({"message": "Password reset link sent to your email"}, status=status.HTTP_200_OK)
    


class passwordreset(APIView):
    def post(self,request,uid,token):
        password=request.data.get('password')
        if not password:
            return Response({"error": "Password is required"}, status=status.HTTP_400_BAD_REQUEST)
        try :
            user=User.objects.get(ud=uid)
        except User.DoesNotExist:
            return Response({"error": "Invalid user"}, status=status.HTTP_404_NOT_FOUND)
        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
