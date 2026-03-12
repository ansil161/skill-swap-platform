from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import skill_wanted, skilloffered
from .serializer import SkillWantedSerializer, SkillOfferedSerializer
from rest_framework.permissions import IsAuthenticated

class SkillsWanted(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, id=None):
        if id:
            try:
                skill = skill_wanted.objects.get(id=id,user=request.user)
                serializer = SkillWantedSerializer(skill)
                return Response(serializer.data)
            except skill_wanted.DoesNotExist:
                return Response({"message": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)
        skills = skill_wanted.objects.filter(user=request.user)
        serializer = SkillWantedSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SkillWantedSerializer(data=request.data)
    
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
    
        return Response(serializer.errors, status=400)
    

    def delete(self, request, id):
            try:
                ski = skill_wanted.objects.get(id=id,user=request.user)
            except skill_wanted.DoesNotExist:
                return Response(
                    {"message": "Skill not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
            ski.delete()
        
            return Response(
                {"message": "Delete success"},
                status=status.HTTP_200_OK
            )

class SkillsOffered(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, id=None):
        if id:
            try:
                skill = skilloffered.objects.get(id=id,user=request.user)  
                serializer = SkillOfferedSerializer(skill)
                return Response(serializer.data)
            except skilloffered.DoesNotExist:
                return Response({"message": "Skill not found"}, status=status.HTTP_404_NOT_FOUND)
        skills = skilloffered.objects.filter(user=request.user)  
        serializer = SkillOfferedSerializer(skills, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SkillOfferedSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, id):
            try:
                ski = skilloffered.objects.get(id=id,user=request.user)
            except skilloffered.DoesNotExist:
                return Response(
                    {"message": "Skill not found"},
                    status=status.HTTP_404_NOT_FOUND
                )
        
            ski.delete()
        
            return Response(
                {"message": "Delete success"},
                status=status.HTTP_200_OK
            )