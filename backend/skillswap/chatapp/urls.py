# chatapp/urls.py

from django.urls import path
from .views import ConversationListView, ChatMessageListView

urlpatterns = [
    path("conversations/", ConversationListView.as_view()),
    path("chat/<int:conversation_id>/messages/", ChatMessageListView.as_view()),
]