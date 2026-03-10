from .models import profile
from rest_framework import serializers


class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    class Meta:
        model=profile
        fields = [
            "id",
            "username",
            "user",
            "bio",
            "profile_picture",
            "location",
            "experience",
            "swap_count",
            "rating",
            "github_link",
            "portfolio_link",
            "connection_count",
            "title",
            "created_at",
            "updated_at"
        ]
        read_only_fields=[
            'swap_count',
            'rating',
            'connection_count',
            'created_at',
            'updated_at',
            'user'
            
        ]

        
        
