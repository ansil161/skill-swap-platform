


from rest_framework import serializers
from .models import Session


class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model=Session
        fields=['mentor','learner','date','time','status']
