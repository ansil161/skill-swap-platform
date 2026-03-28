from django.urls import path
from .views import *

urlpatterns = [
      path('notifications/', Notificationlistapi.as_view()),
    path('notiread//<int:pk>/', Notificationmarkapi.as_view()),
   
]