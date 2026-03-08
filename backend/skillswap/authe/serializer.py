

from rest_framework import serializers
from .models import Userprofile

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=Userprofile
        fields=['id','username','password']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def validate_username(self,value):
        if Userprofile.objects.filter(username=value).exists():
            raise serializers.ValidationError('username is already exist')
        if len(value)<4:
            raise serializers.ValidationError('username at least 4 charctre')
        return value
    
    def validate_password(self,value):
        if len(value)<8:
            raise serializers.ValidationError('the password must be more that 8 characte')
        return value
    def create(self,validated_data):
        user=Userprofile.objects.create_user(**validated_data)
        return user
    

class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model=Userprofile
        fields=['email','password']
    
    def get(self,data):
        
        try:
            user=Userprofile.objects.get(email=data['email'])
        except Userprofile.DoesNotExist:
            raise serializers.ValidationError('Invalid email or password')
        
        if not user.check_password(data['password']):
            raise serializers.ValidationError('invalid password or email')
        if not user.is_active:
            raise serializers.ValidationError('account is not active')
        
        data['user']=user
        return data


    