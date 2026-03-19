

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

from rest_framework import serializers
from .models import Conversation, ChatMessage

class ConversationSerializer(serializers.ModelSerializer):
    last_message = serializers.SerializerMethodField()
    partner_name = serializers.SerializerMethodField() 

    class Meta:
        model = Conversation
        fields = ['id', 'swap_request', 'create_at', 'last_message', 'partner_name']

    def get_last_message(self, obj):
        last_msg = obj.messages.order_by('-created_at').first()
        return last_msg.content if last_msg else ""

    def get_partner_name(self, obj):
        request = self.context.get('request')
        if not request:
            return ""
        current_user = request.user.username
        
        if obj.swap_request.requester.user.username == current_user:
            return obj.swap_request.provider.user.username
        return obj.swap_request.requester.user.username