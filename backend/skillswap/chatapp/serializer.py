from rest_framework import serializers
from .models import chatMessage



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=chatMessage
        fields='__all__'