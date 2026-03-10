from .models import skill_wanted,skilloffered
from rest_framework import serializers

class skillwantedSerializer(serializers.ModelSerializer):
    class Meta:
        model=skill_wanted
        fields='__all__'

class skillofferdSeriaizer(serializers.ModelSerializer):
    class Meta:
        model=skilloffered
        field='__all__'
