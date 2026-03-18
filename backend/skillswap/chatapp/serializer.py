

from rest_framework import serializers
from .models import Conversation, ChatMessage

class ChatMessageSerializer(serializers.ModelSerializer):
    current_user = serializers.SerializerMethodField()
    conversation=serializers.CharField(source='conversation.swap_request.requester.user.username')
    sender=serializers.CharField(source='sender.user.username')
    

    class Meta:
        model = ChatMessage
        fields = ['id', 'conversation', 'sender', 'content', 'is_read', 'created_at', 'current_user']

    def get_current_user(self, obj):
        request = self.context.get('request')
        return request.user.profile.id if request else None


class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    user1_name = serializers.SerializerMethodField()
    user2_name = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = ['id', 'swap_request', 'create_at', 'last_message','user1_name', 'user2_name']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        return last_msg.content if last_msg else ""
    def get_user1_name(self, obj):
        return obj.swap_request.requester.user.username

    def get_user2_name(self, obj):
        return obj.swap_request.provider.user.username