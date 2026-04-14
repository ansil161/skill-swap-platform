from django.shortcuts import render
from rest_framework.views import APIView

from .serializer import RegisterSerializer,LoginSerializer
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Userprofile
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import redirect


from google.oauth2 import id_token
from google.auth.transport import requests

from rest_framework.views import APIView
from rest_framework.response import Response
from django.conf import settings

from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import send_mail


from django.urls import reverse

import requests

from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.contrib.auth.tokens import default_token_generator

from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_str



User = get_user_model()
FRONTEND_URL = "https://skill-swap-platform-ansil161s-projects.vercel.app"

activation_token=PasswordResetTokenGenerator()
   
class Register(APIView):
    
    def post(self,request):

        user=RegisterSerializer(data=request.data)
        print(user)
        if user.is_valid():
            user=user.save()
            token=activation_token.make_token(user)
            activation_link = f"https://skillexchange.duckdns.org/skill/auth/activate/{user.id}/{token}/"
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

            response=Response({'message':'Login succesfull',
                                   "access": access_token,
    "refresh": str(refresh),

                               'user':{'user_id':user.id,
                                       'username':user.username,
                                       'email': user.email,
                                       'role': user.role

                                       }
                               },status=status.HTTP_200_OK)
            # response.set_cookie(
            #     key='access_token',
            #     value=access_token,
            #     httponly=True,
            #     secure=True,
            #     samesite="None",
            #     domain=".duckdns.org",
            #      path='/',
                


            # )
            
            
            # response.set_cookie(
            #     key='refresh',
            #     value=str(refresh),
            #     httponly=True,
            #     secure=True,
            #     samesite="None",
            #     domain=".duckdns.org",
            #      path='/',
            # )
        

            return response
        return Response({'error':serializer.errors},status=status.HTTP_400_BAD_REQUEST)



        



class Currentuserapi(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            "username": request.user.username,
            'role':request.user.role,
            "email": request.user.email,
            "role": request.user.role,
        })
    




from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

class RefreshAccessToken(APIView):
    def post(self, request):
        refresh_token = request.data.get("refresh")

        if not refresh_token:
            return Response({"error": "Refresh token required"}, status=401)

        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)

            return Response({
                "access": access_token
            }, status=200)

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
            secure=True,  
            samesite="None"
        )

        res.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=True,
            samesite="None"
        )

        return res


class Activationapi(APIView):
    
    def get(self,request,user_id,token):
        try:
            user=Userprofile.objects.get(id=user_id)
        except Userprofile.DoesNotExist:
            redirect(f"{FRONTEND_URL}/error?type=user_not_found")

        if user.is_active:
            return redirect('https://skill-swap-platform-ansil161s-projects.vercel.app/login')
           
        if not activation_token.check_token(user,token):
            return Response(
                {"error": "Invalid or expired activation link"},
                status=status.HTTP_400_BAD_REQUEST
            )
        user.is_active=True
        user.save()
        return redirect('https://skill-swap-platform-ansil161s-projects.vercel.app/login')
        




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
            user=Userprofile.objects.get(email=email)
        except Userprofile.DoesNotExist:
            return Response({'error':"user email is not found"},status=status.HTTP_404_NOT_FOUND)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        
   
        frontend_url = f"http://localhost:5173/reset-password/{uid}/{token}/"
        send_mail(
            'SkillSwap Password Reset',
            f'Click the link to reset your password: {frontend_url}',
            'no-reply@skillswap.com',
            [email],
        )
        return Response({"message": "Password reset link sent to your email"}, status=status.HTTP_200_OK)

class passwordreset(APIView):
    def post(self, request, uid, token):
        password = request.data.get("password")
        print('hai',password)
        if not password:
            return Response({"error": "Password is required"}, status=400)
        
        try:
            
            uid_decoded = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=uid_decoded)
        except (User.DoesNotExist, ValueError, TypeError, OverflowError):
            return Response({"error": "Invalid user"}, status=404)
        
        if default_token_generator.check_token(user, token):
            user.set_password(password)
            user.save()
            return Response({"message": "Password reset successfully"}, status=200)
        else:
            return Response({"error": "Invalid or expired token"}, status=400)
        



class ank(APIView):
    def get(self):
        return 'hai aim ansil'