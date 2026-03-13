from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response

from skills.models import skill_wanted,skilloffered
from userprofile.models import profile
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from userprofile.models import profile
from skills.models import skill
from .models import SwapRequest
# Create your views here.

class MatchApi(APIView):
    permission_classes=[IsAuthenticated]
    def get(self,request):
        user_prf=profile.objects.get(user=request.user)
        skil_want=skill_wanted.objects.filter(user=user_prf).values_list('name' ,flat=True)

    
        skill_offer=skilloffered.objects.filter(user=user_prf).values_list('skills',flat=True)
        matchesone=skilloffered.objects.filter(skills__in=skil_want).exclude(user=user_prf).select_related('user')
        

        datas=[]
        for i in matchesone:
            macth_user=i.user
            other=skill_wanted.objects.filter(
                user=macth_user,
                name__in=skill_offer
            
            ).values_list('name__name',flat=True)
            
          
            if other.exists():
                datas.append({
                    'username':macth_user.user.username,
                    'offers':i.skills.name,
                    'learn':list(other),
                    'photo':macth_user.profile_picture.url if macth_user.profile_picture else None
                    
                 

                })
        return Response(datas)


        


class SwaprRequestApi(APIView):
    def post(self,request):
        requeset_user=profile.objects.get(user=request.user)
        provider=request.data.get('provider_id')
        skilll_id=request.data.get('skill_id')
        if not provider or not skilll_id:
            return Response({'message': 'provide and skill are required'},status=status.HTTP_400_BAD_REQUEST)
        try:
            user=profile.objects.get(id=provider)
            skills=skill.objects.get(id=skilll_id)
        except profile.DoesNotExist:
            return Response({'message':'provider not found'},status=status.HTTP_404_NOT_FOUND)
        except skill.DoesNotExist:
            return Response({'message':"skill is not found"},status=status.HTTP_404_NOT_FOUND)
        
        if SwapRequest.objects.filter(requester=requeset_user,provider=provider,skill=skills,status='pending').exists():
            return Response ({'message':'swap request is already sent'},status=status.HTTP_400_BAD_REQUEST)
        else:
            SwapRequest.objects.create(
                requester=requeset_user,
                provider=provider,
                skill=skills,
                
            )
            return Response({'message':"swap request sent secefully"},status=status.HTTP_200_OK)
        

        
    def get(self,request):
        user=profile.objects.get(user=request.user)
        request_sent=SwapRequest.objects.filter(requester=user).select_related('provider','skill__skills')
        request_recieved=SwapRequest.objects.filter(provider=user).select_related('requester','skill__skills')

        sent=[
            {
                'request_id':i.id,
                'provider':i.provider.user.username,
                'skill':i.skill.skills.name,
                'status':i.status,
                'create':i.create
            

            }
            for i in request_sent
       
                
    
        ]
        
        recieve=[
            {
                'request_id':i.id,
                'requester':i.requester.user.username,
                'skill':i.skill.skills.name,
                'status':i.status,
                'create':i.create


            }
            for i in request_recieved
        ]

        return Response({'request':sent,
                         'recienve':recieve},status=status.HTTP_200_OK)
    

    def put(self,request):
        request_id=request.data.get('request_id')
        user=profile.objects.get(user=request.user)
        new_status=request.data.get('status')

        if new_status not in ['Accepted','Rejected']:
            return Response({'error':'invalid status'})
        try:
            swap_req=SwapRequest.objects.get(request=request_id,provider=user)
        except SwapRequest.DoesNotExist:
            return Response({"error":"request is doen not found"},status=status.HTTP_404_NOT_FOUND)
        
        swap_req.status=new_status
        swap_req.save()
        return Response({'message':f"swap request {new_status}"},status=status.HTTP_200_OK)


