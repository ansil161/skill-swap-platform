from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SkillCategory,skilloffered,skill_wanted
from .serializer 
# Create your views here.
  

        
class skillswant(APIView):
    
    def get_objects(self,id):
        try:
            return skill_wanted.objects.get(id=id)
        except skill_wanted.DoesNotExist:
            return None
        
    def get(self,request,id):
        user=self.get_objects(id)
        if user is None:
            return  Response({'message':'user id does not exist'},status=status.HTTP_404_NOT_FOUND)
        
    def post(self,reqeust):
        a=skill_wanted





