"""
URL configuration for skillswap project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from .views import *

urlpatterns = [
    path('Register/',Register.as_view(),name='register'),
    path('Login/',Login.as_view(),name='login'),
    path("refresh/", RefreshAccessToken.as_view(), name="refresh-token"),
    path("activate/<int:user_id>/<str:token>/", Activationapi.as_view(), ),
    path('logout/',LogoutAPI.as_view()),
    
     path('auth/', include('dj_rest_auth.urls')),
    path('auth/', include('dj_rest_auth.registration.urls')),
    path('accounts/', include('allauth.urls')),

   
]
