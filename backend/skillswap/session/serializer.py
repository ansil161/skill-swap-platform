# serializers.py
from rest_framework import serializers
from .models import Session, SessionFeedback
from swapsystem.models import SwapRequest
from userprofile.models import profile
from rest_framework import serializers
from swapsystem.models import SwapRequest

class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = '__all__'

        

class SessionFeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionFeedback
        fields = ['session', 'rating', 'feedback']





class SwapRequestSerializer(serializers.ModelSerializer):
    partner = serializers.SerializerMethodField()
    skill_name = serializers.CharField(source='skill.skills.name', read_only=True)

    class Meta:
        model = SwapRequest
        fields = ['id', 'partner', 'skill_name', 'status', 'create']

    def get_partner(self, obj):
       
        request = self.context.get('request')
        current_user_profile = request.user.profile if request else None

        if current_user_profile == obj.requester:
            partner_profile = obj.provider
        else:
            partner_profile = obj.requester

        return {
            "id": partner_profile.id,
            "user": {
                "username": partner_profile.user.username
            }
        }