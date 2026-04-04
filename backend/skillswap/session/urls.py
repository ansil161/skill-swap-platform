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

from django.urls import path,include

from .views import *

urlpatterns = [
    path('sessions/', SessionListCreateAPIView.as_view(), name='session-list-create'),
    path('sessions/<int:pk>/', SessionRetrieveUpdateDeleteAPIView.as_view(), name='session-detail'),
    path('feedbacks/', SessionFeedbackListCreateAPIView.as_view(), name='feedback-list-create'),
    path('feedbacks/<int:pk>/', SessionFeedbackRetrieveUpdateDeleteAPIView.as_view(), name='feedback-detail'),
     path('sessionswap-requests/', AcceptedSwapRequestsAPIView.as_view(), name='swap-requests'),
]

