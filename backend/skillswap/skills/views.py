from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import SkillCategory,skilloffered,skill_wanted
from .serializer import skillofferdSeriaizer,skillwantedSerializer
from rest_framework import status
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
        a=skillwantedSerializer(reqeust.data)
        if a.is_valid():
            return Response(a.data,status=status.HTTP_200_OK)
        return Response(a.errors,status=status.HTTP_400_BAD_REQUEST)




class skillofferes(APIView):
     
    def get_objects(self,id):
        try:
            return skilloffered.objects.get(id=id)
        except skilloffered.DoesNotExist:
            return None
        
    def get(self,request,id):
        user=self.get_objects(id)
        if user is None:
            return  Response({'message':'user id does not exist'},status=status.HTTP_404_NOT_FOUND)
        
    def post(self,reqeust):
        a=skillwantedSerializer(reqeust.data)
        if a.is_valid():
            return Response(a.data,status=status.HTTP_200_OK)
        return Response(a.errors,status=status.HTTP_400_BAD_REQUEST)




