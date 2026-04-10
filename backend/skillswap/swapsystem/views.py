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
from chatapp.models import Conversation
from access_control.permissions import IsUser
from notification.utlis import send_notitfication
# Create your views here.

class MatchApi(APIView):
    permission_classes=[IsAuthenticated,IsUser]
    def get(self,request):
        user_prf=profile.objects.get(user=request.user)
        skil_want=skill_wanted.objects.filter(user=user_prf).values_list('name' ,flat=True)

    
        skill_offer=skilloffered.objects.filter(user=user_prf).values_list('skills',flat=True)
        matchesone=skilloffered.objects.filter(skills__in=skil_want).exclude(user=user_prf).select_related('user')
        print("usewant", list(skil_want))
        print("useroffer", list(skill_offer))

        datas=[]
        for i in matchesone:
            macth_user=i.user
            other=skill_wanted.objects.filter(
                user=macth_user,
                name__in=skill_offer
            
            ).values_list('name__name',flat=True)
            
       
            if other.exists():
                datas.append({
                    'id': macth_user.id,
                    'username': macth_user.user.username,
                    'offers': i.skills.name,
                    'skill_id': i.id,
                    'learn': list(other),
                    'photo': macth_user.profile_picture.url if macth_user.profile_picture else None
                })
        return Response(datas)
    

class SwaprRequestApi(APIView):
        
    permission_classes = [IsAuthenticated,IsUser]

    def post(self, request):
        request_user = profile.objects.get(user=request.user)
        provider_id = request.data.get('provider_id')
        skill_id = request.data.get('skill_id')

        if not provider_id or not skill_id:
            return Response({'message': 'Provider and skill are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            provider_user = profile.objects.get(id=provider_id)
            skill_instance = skilloffered.objects.get(id=skill_id)
        except profile.DoesNotExist:
            return Response({'message': 'Provider not found'}, status=status.HTTP_404_NOT_FOUND)
        except skilloffered.DoesNotExist:
            return Response({'message': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

       
        if SwapRequest.objects.filter(
            requester=request_user,
            provider=provider_user,
            skill=skill_instance,
            status='Pending'  
        ).exists():
            return Response({'message': 'Swap request is already sent'}, status=status.HTTP_400_BAD_REQUEST)

        
        SwapRequest.objects.create(
            requester=request_user,
            provider=provider_user,
            skill=skill_instance
        )

        send_notitfication(
            receiver=provider_user, 
            sender=request.user.profile,
            message=f"{request.user.username} sent you a swap request 🤝",


        )
        


        return Response({'message': 'Swap request sent successfully'}, status=status.HTTP_200_OK)

   
    def get(self, request):
        user = profile.objects.get(user=request.user)

        sent_requests = SwapRequest.objects.filter(requester=user).select_related('provider', 'skill__skills')
        received_requests = SwapRequest.objects.filter(provider=user).select_related('requester', 'skill__skills')
        

        sent = []

        for r in sent_requests:
            conversation = Conversation.objects.filter(swap_request=r).first()

            sent.append({
                'request_id': r.id,
                'provider': r.provider.user.username,
                'provider_id': r.provider.id,
                'skill': r.skill.skills.name,
                'skill_id': r.skill.id,
                'status': r.status,
                'created': r.create,
                'conversation_id': conversation.id if conversation else None
            })
        
        received = []

        for r in received_requests:
            conversation = Conversation.objects.filter(swap_request=r).first()

            received.append({
                'request_id': r.id,
                'requester': r.requester.user.username,
                'skill': r.skill.skills.name,
                'status': r.status,
                'created': r.create,
                'conversation_id': conversation.id if conversation else None
            })
        pending_count = received_requests.filter(status='Pending').count()

        return Response({'sent': sent, 'received': received,'pending_count': pending_count}, status=status.HTTP_200_OK)


    def put(self, request):
        request_id = request.data.get('request_id')
        new_status = request.data.get('status')
        user = profile.objects.get(user=request.user)

        if new_status not in ['Accepted', 'Rejected']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            swap_req = SwapRequest.objects.get(id=request_id, provider=user)
        except SwapRequest.DoesNotExist:
            return Response({'error': 'Request not found'}, status=status.HTTP_404_NOT_FOUND)

        swap_req.status = new_status
        swap_req.save()
        send_notitfication(
            sender=request.user.id,
            receiver=swap_req.requester.user.id,
            message=f"{request.user.username} accepted your swap request"
        )
        if new_status == "Accepted":
            Conversation.objects.get_or_create(
                swap_request=swap_req
            )
        

        return Response({'message': f'Swap request {new_status}'}, status=status.HTTP_200_OK)