from rest_framework import serializers
from .models import Job, JobApplication


class Jobserializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = "__all__"
        read_only_fields = ["posted_by", "created_at"]


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