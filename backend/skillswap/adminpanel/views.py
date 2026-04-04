

from rest_framework.views import APIView
from rest_framework.response import Response


from userprofile.models import profile
from swapsystem.models import SwapRequest
from session.models import Session
from access_control.permissions import IsAdmin
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .serializer import CreaterecruiterSerializer


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self, request):
        data = {
            "total_users": profile.objects.count(),
            "total_swaps": SwapRequest.objects.count(),
            "accepted_swaps": SwapRequest.objects.filter(status='accepted').count(),
            "total_sessions": Session.objects.count(),
        }
        return Response(data)
    
class AdminUserListView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self, request):
        users = profile.objects.select_related('user').all()

        data = [
            {
                "id": u.id,
                "username": u.user.username,
                "email": u.user.email,
                "rating": u.rating,
                "swaps": u.swap_count,
                'role':u.user.role,
            }
            for u in users
        ]

        return Response(data)
    

class AdminSwapListView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self, request):
        swaps = SwapRequest.objects.select_related('requester', 'provider').all()

        data = [
            {
                "id": s.id,
                "requester": s.requester.user.username,
                "provider": s.provider.user.username,
                "status": s.status,
            }
            for s in swaps
        ]

        return Response(data)

class AdminSessionListView(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]

    def get(self, request):
        sessions = Session.objects.select_related('mentor', 'learner').all()

        data = [
            {
                "id": s.id,
                "mentor": s.mentor.user.username,
                "learner": s.learner.user.username,
                "status": s.status,
                "scheduled_time": s.scheduled_time,
            }
            for s in sessions
        ]

        return Response(data)
    

class Userdeatial(APIView):
    permission_classes = [IsAuthenticated,IsAdmin]
    def get(self,request,user_id):
        try:
            user=profile.objects.get(id=user_id)
        except profile.DoesNotExist:
            return Response({'message':"the user id does not exist"},status=status.HTTP_404_NOT_FOUND)
        sessions_as_mentor = Session.objects.filter(mentor=user)
        sessions_as_learner = Session.objects.filter(learner=user)

        sessions_data = []

        for s in sessions_as_mentor:
            sessions_data.append({
                "id": s.id,
                "role": "mentor",
                "mentor": s.mentor.user.username,
                "learner": s.learner.user.username,
                "status": s.status,
                "scheduled_time": s.scheduled_time,
            })

        for s in sessions_as_learner:
            sessions_data.append({
                "id": s.id,
                "role": "learner",
                "mentor": s.mentor.user.username,
                "learner": s.learner.user.username,
                "status": s.status,
                "scheduled_time": s.scheduled_time,
            })

     
        swaps_requested = SwapRequest.objects.filter(requester=user)
        swaps_provided = SwapRequest.objects.filter(provider=user)

        swaps_data = []

        for s in swaps_requested:
            swaps_data.append({
                "id": s.id,
                "role": "requester",
                "requester": s.requester.user.username,
                "provider": s.provider.user.username,
                "status": s.status,
            })

        for s in swaps_provided:
            swaps_data.append({
                "id": s.id,
                "role": "provider",
                "requester": s.requester.user.username,
                "provider": s.provider.user.username,
                "status": s.status,
            })

        data = {
            "id": user.id,
            "username": user.user.username,
            "email": user.user.email,
            "rating": user.rating,
            "sessions": sessions_data,
            "swaps": swaps_data,
        }

        return Response(data)

    def patch(self,request,user_id):
        try:
            user=profile.objects.get(id=user_id)
        except profile.DoesNotExist:
            return Response({'message':"the user id does not exist"},status=status.HTTP_404_NOT_FOUND)
        new_status = request.data.get('status')
        if new_status is None:
            return Response({'message': "Status is required"}, status=status.HTTP_400_BAD_REQUEST)
    
        
        if isinstance(new_status, str):
            new_status = new_status.lower() == "true"
    
        user.user.is_active = new_status
        user.user.save() 
    
        return Response({'message': "Status is updated"}, status=status.HTTP_200_OK)
    

class CreateRecruiterapi(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def post(self, request):
        serializer = CreaterecruiterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Recruiter created successfully"}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)