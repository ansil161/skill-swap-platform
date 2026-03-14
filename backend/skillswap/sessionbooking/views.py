from django.shortcuts import render
from rest_framework.views import APIView
from userprofile.models import profile
from swapsystem.models import SwapRequest
from rest_framework.response import Response
from rest_framework import status
from .models import Session
from .serializer import SessionSerializer
from rest_framework.permissions import IsAuthenticated

from django.db.models import Q

# Create your views here.

class SessionApi(APIView):
    permission_classes=[IsAuthenticated]


    def get(self,request):
        prf=profile.objects.get(user=request.user)

        session=Session.objects.filter(Q(mentor=prf)|Q(learner=prf))
        seria=SessionSerializer(session,many=True)
        return Response(seria.data)
    
    def post(self,request):
        
        user=profile.objects.get(user=request.user)
        swap_id=request.data.get('swap_id')
        try:
            swap=SwapRequest.objects.get(id=swap_id)
        except SwapRequest.DoesNotExist:
            return Response({'error':"swap request not found"},status=status.HTTP_404_NOT_FOUND)
        if swap.status!='accepted':
            return Response({'error':'the swap request is doens not accept'},status=status.HTTP_400_BAD_REQUEST)
        
        session=Session.objects.create(
            swap_request=swap,
            mentor=swap.requester,
            learner=swap.provider,
            date=request.data.get('date'),
            time=request.data.get('time'),
            duration=request.data.get('duration')
            

        )

        seria=SessionSerializer(session)
        return Response(seria.data)
    
    def patch(self,request,id):

        try:
            session=Session.objects.get(id=id)
        except Session.DoesNotExist:
            return Response({"error":"session does not found"},status=status.HTTP_404_NOT_FOUND)
        
        status_new=request.data.get('status')
        session.status=status_new
        session.save()
        seri=SessionSerializer(session)
        return Response(seri.data)





