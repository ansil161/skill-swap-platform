from .models import profile
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model=profile
        fields='__all__'
        
