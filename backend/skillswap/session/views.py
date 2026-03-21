from django.shortcuts import render

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import Session, SessionFeedback
from .serializer import SessionSerializer, SessionFeedbackSerializer,SwapRequestSerializer
from    swapsystem.models import SwapRequest
from django.db.models import Q
# Create your views here.



class SessionListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_profile = request.user.profile
        sessions = Session.objects.filter(mentor=user_profile) | Session.objects.filter(learner=user_profile)
        serializer = SessionSerializer(sessions, many=True)
        return Response(serializer.data)

    def post(self, request):
        swap_request_id = request.data.get("swap_request")
        print("hello",swap_request_id)
        try:
            swap_request = SwapRequest.objects.get(id=swap_request_id)
        except SwapRequest.DoesNotExist:
            return Response({"detail": "SwapRequest not found"}, status=status.HTTP_404_NOT_FOUND)
    
       
        mentor = swap_request.provider
        learner = swap_request.requester
    
        session = Session(
            swap_request=swap_request,
            mentor=mentor,
            learner=learner,
            scheduled_time=request.data.get("scheduled_time"),
            video_call_type=request.data.get("video_call_type"),
            google_meet_link=request.data.get("google_meet_link"),
        )
        session.save()
        serializer = SessionSerializer(session)
        return Response(serializer.data, status=201)
class SessionRetrieveUpdateDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            session = Session.objects.get(pk=pk)
           
            if session.mentor == user.profile or session.learner == user.profile:
                return session
            else:
                return None
        except Session.DoesNotExist:
            return None

    def get(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SessionSerializer(session)
        return Response(serializer.data)

    def put(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SessionSerializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        session = self.get_object(pk, request.user)
        if not session:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)




class SessionFeedbackListCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_profile = request.user.profile
        feedbacks = SessionFeedback.objects.filter(
            session__mentor=user_profile
        ) | SessionFeedback.objects.filter(
            session__learner=user_profile
        )
        serializer = SessionFeedbackSerializer(feedbacks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SessionFeedbackSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SessionFeedbackRetrieveUpdateDeleteAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk, user):
        try:
            feedback = SessionFeedback.objects.get(pk=pk)
            if feedback.session.mentor == user.profile or feedback.session.learner == user.profile:
                return feedback
            return None
        except SessionFeedback.DoesNotExist:
            return None

    def get(self, request, pk):
        feedback = self.get_object(pk, request.user)
        if not feedback:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SessionFeedbackSerializer(feedback)
        return Response(serializer.data)

    def put(self, request, pk):
        feedback = self.get_object(pk, request.user)
        if not feedback:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        serializer = SessionFeedbackSerializer(feedback, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        feedback = self.get_object(pk, request.user)
        if not feedback:
            return Response({'detail': 'Not found or access denied'}, status=status.HTTP_404_NOT_FOUND)
        feedback.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

from django.db.models import Q

class AcceptedSwapRequestsAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user_profile = request.user.profile
        accepted_swaps = SwapRequest.objects.filter(
            status__iexact='accepted'
        ).filter(
            Q(requester=user_profile) | Q(provider=user_profile)
        )
        serializer = SwapRequestSerializer(accepted_swaps, many=True)
        return Response(serializer.data)