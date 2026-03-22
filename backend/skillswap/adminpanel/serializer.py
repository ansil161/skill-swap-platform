# adminpanel/serializers.py
from rest_framework import serializers
from userprofile.models import profile
from swapsystem.models import SwapRequest
from session.models import Session
from chatapp.models import Conversation, ChatMessage


class AdminUserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = profile
        fields = [
            'id',
            'username',
            'email',
            'rating',
            'swap_count',
            'location',
            'experience',
            'connection_count',
        ]

class AdminSwapSerializer(serializers.ModelSerializer):
    requester_name = serializers.CharField(source='requester.user.username')
    provider_name = serializers.CharField(source='provider.user.username')
    skill_name = serializers.CharField(source='skill.skills.name')

    class Meta:
        model = SwapRequest
        fields = [
            'id',
            'requester_name',
            'provider_name',
            'skill_name',
            'status',
            'create',
        ]

class AdminSessionSerializer(serializers.ModelSerializer):
    mentor_name = serializers.CharField(source='mentor.user.username')
    learner_name = serializers.CharField(source='learner.user.username')

    class Meta:
        model = Session
        fields = [
            'id',
            'mentor_name',
            'learner_name',
            'scheduled_time',
            'status',
            'video_call_type',
        ]

class AdminChatMessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.user.username')

    class Meta:
        model = ChatMessage
        fields = [
            'id',
            'sender_name',
            'content',
            'is_read',
            'created_at',
        ]
class AdminConversationSerializer(serializers.ModelSerializer):
    messages = AdminChatMessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = [
            'id',
            'swap_request',
            'create_at',
            'messages',
        ]