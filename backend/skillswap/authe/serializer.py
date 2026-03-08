

from rest_framework import serializers
from .models import Userprofile

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=Userprofile
        fields=['id','username','password','email']
        extra_kwargs={
            'password':{'write_only':True}
        }

    def validate_email(self,value):
        if Userprofile.objects.filter(email=value).exists():
            raise serializers.ValidationError('email is already exist')
        return value
  
    
    def validate_password(self,value):
        if len(value)<8:
            raise serializers.ValidationError('the password must be more that 8 characte')
        return value
    def create(self, validated_data):

        username = validated_data.get("username")
        email = validated_data.get("email")
        password = validated_data.get("password")

        user = Userprofile.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        return user
    

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self,data):
        
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


    