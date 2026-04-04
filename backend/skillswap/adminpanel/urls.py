# adminpanel/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path('dashboard/', AdminDashboardView.as_view()),
    path('users/', AdminUserListView.as_view()),
    path('swaps/', AdminSwapListView.as_view()),
    path('sessions/', AdminSessionListView.as_view()),
    path('userdeatail/<int:user_id>/',Userdeatial.as_view()),
    path("create-recruiter/", CreateRecruiterapi.as_view(), ),
]