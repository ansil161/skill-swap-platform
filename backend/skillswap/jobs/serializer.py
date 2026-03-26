from rest_framework import serializers
from .models import Job, JobApplication
from userprofile.models import profile




class Jobserializer(serializers.ModelSerializer):

    is_applied = serializers.SerializerMethodField()
    applicationstatus = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'skills_required', 'location', 'deadline', 'job_type', 'is_applied','applicationstatus']
        read_only_fields = ["posted_by", "created_at"]
    def get_is_applied(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            return JobApplication.objects.filter(user=user.profile, job=obj).exists()
        return False
    
    def get_applicationstatus(self, obj):
        user = self.context.get('request').user
        if user.is_authenticated:
            try:
                app = JobApplication.objects.get(user=user.profile, job=obj)
                return app.status 
            except JobApplication.DoesNotExist:
                return None
        return None


class JobapplicationSerializer(serializers.ModelSerializer):
    username=serializers.SerializerMethodField()
    email=serializers.SerializerMethodField()
    class Meta:
        model = JobApplication
        fields = "__all__"
        read_only_fields = ["user", "status", "applied_at"]
    def get_username(self, obj):
            return obj.user.user.username 

    def get_email(self, obj):
            return obj.user.user.email
    





class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)

    class Meta:
        model = profile
        fields = "__all__"



class UserJobApplicationSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(source='job.title', read_only=True)
    company = serializers.CharField(source='job.company', read_only=True)
    status = serializers.CharField(read_only=True)
    applied_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = JobApplication
        fields = ['id', 'job_title', 'company', 'status', 'applied_at']