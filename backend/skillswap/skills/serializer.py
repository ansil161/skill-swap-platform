from rest_framework import serializers
from .models import skill_wanted, skilloffered,skill

class SkillWantedSerializer(serializers.ModelSerializer):
    name=serializers.CharField()
    
    class Meta:
        model = skill_wanted
        fields = ['id', 'name']
    def create(self, validated_data):
        skill_name = validated_data.pop('name')
        skill_obj, _ = skill.objects.get_or_create(name=skill_name)
        return skill_wanted.objects.create(name=skill_obj, **validated_data)

class SkillOfferedSerializer(serializers.ModelSerializer):
    skills=serializers.CharField()
    class Meta:
        model = skilloffered
        fields = ['id', 'skills', 'experience_level']

    def create(self, validated_data):
        skill_name=validated_data.pop('skills')
        skill_obJ,_=skill.objects.get_or_create(name=skill_name)
        return skilloffered.objects.create(skills=skill_obJ,**validated_data)