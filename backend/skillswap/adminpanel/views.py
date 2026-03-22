

from rest_framework.views import APIView
from rest_framework.response import Response
from .permission import IsAdminUserCustom

from userprofile.models import profile
from swapsystem.models import SwapRequest
from session.models import Session


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        data = {
            "total_users": profile.objects.count(),
            "total_swaps": SwapRequest.objects.count(),
            "accepted_swaps": SwapRequest.objects.filter(status='accepted').count(),
            "total_sessions": Session.objects.count(),
        }
        return Response(data)
    
class AdminUserListView(APIView):
    permission_classes = [IsAdminUserCustom]

    def get(self, request):
        users = profile.objects.select_related('user').all()

        data = [
            {
                "id": u.id,
                "username": u.user.username,
                "email": u.user.email,
                "rating": u.rating,
                "swaps": u.swap_count,
            }
            for u in users
        ]

        return Response(data)
    

class AdminSwapListView(APIView):
    permission_classes = [IsAdminUserCustom]

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
    permission_classes = [IsAdminUserCustom]

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