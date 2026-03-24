# serializers.py
from rest_framework import serializers
from .models import Session, SessionFeedback
from swapsystem.models import SwapRequest
from userprofile.models import profile
from rest_framework import serializers
from swapsystem.models import SwapRequest

class SessionSerializer(serializers.ModelSerializer):
    mentor_username = serializers.SerializerMethodField()
    learner_username = serializers.SerializerMethodField()
    scheduled_time = serializers.SerializerMethodField()
    skill_name = serializers.SerializerMethodField()
    class Meta:
        model = Session
        fields = '__all__'
    
    def get_mentor_username(self, obj):
        return str(obj.mentor.user.username)
    
    def get_learner_username(self, obj):
        return str(obj.learner.user.username)
    
    def get_scheduled_time(self, obj):
        return obj.scheduled_time.strftime("%Y-%m-%d %H:%M:%S")
    
    def get_skill_name(self, obj):
   
        return str(obj.swap_request.skill.skills.name) if obj.swap_request and obj.swap_request.skill else ""
    
    def get_skill_want(self,obj):
         return str(obj.swap_request.skill.skills.name) if obj.swap_request and obj.swap_request.skill else ""

        


class SessionFeedbackSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()  
    comment = serializers.CharField(source='feedback')  
    photo=serializers.SerializerMethodField()
    

    class Meta:
        model = SessionFeedback
        fields = ['id', 'session', 'rating', 'comment', 'name', 'create_at','photo']

    def get_name(self, obj):
        request_user = self.context['request'].user.profile if self.context.get('request') else None
        if not request_user:
            return None
        
        if obj.session.mentor == request_user:
            return obj.session.learner.user.username
        return obj.session.mentor.user.username
    
    def get_photo(self, obj):
        request_user = self.context['request'].user.profile if self.context.get('request') else None
        if not request_user:
            return None
        
        
        if obj.session.mentor == request_user:
            return obj.session.learner.profile_picture.url if obj.session.learner.profile_picture else None
        return obj.session.mentor.profile_picture.url if obj.session.mentor.profile_picture else None



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