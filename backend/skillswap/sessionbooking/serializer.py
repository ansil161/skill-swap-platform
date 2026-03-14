


from rest_framework import serializers
from .models import Session


class SessionSerializer(serializers.ModelSerializer):
    mentor=serializers.CharField(source='mentor.user.username',read_only=True)
    learner=serializers.CharField(source='learner.user.username',read_only=True)

    class Meta:
        model=Session
        fields=['mentor','learner','date','time','status','duration']
