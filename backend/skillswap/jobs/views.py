from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from access_control.permissions import IsUser, IsAdminOrRecruiter
from .models import Job, JobApplication
from .serializer import JobapplicationSerializer,Jobserializer,ProfileSerializer,UserJobApplicationSerializer
from rest_framework.permissions import IsAuthenticated

from ai_service.back_task import process_application_task
from django.utils.timezone import make_aware, is_naive

from .task import send_email,send_remainder
from django.utils import timezone
from datetime import timedelta
from django.utils.dateparse import parse_datetime
class Jobapiview(APIView):
    permission_classes = [IsAuthenticated,IsAdminOrRecruiter]

    def post(self, request):
        serializer = Jobserializer(data=request.data, context={'request': request})

        if serializer.is_valid():
            serializer.save(posted_by=request.user.profile)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    



class Joblistapi(APIView):
    permission_classes=[IsAuthenticated]
    
    def get(self, request):
        jobs = Job.objects.filter(is_active=True)
        serializer = Jobserializer(jobs, many=True ,context={'request': request})
        return Response(serializer.data)

class Applyapiview(APIView):
    permission_classes = [IsAuthenticated, IsUser]

    def post(self, request):
        job_id = request.data.get("job")

        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=404)
        
        userprofile = request.user.profile

        if JobApplication.objects.filter(user=userprofile, job=job).exists():
            return Response({"error": "Already applied"}, status=400)

        serializer = JobapplicationSerializer(data=request.data)

        if serializer.is_valid():
           
            application= serializer.save(user=userprofile, job=job)
            process_application_task.delay(application.id)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)



class Jobapplicantapi(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrRecruiter]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, posted_by=request.user.profile)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

        applications = JobApplication.objects.filter(job=job)

        data = []
        for app in applications:
            item = {
                "id": app.id,
                "username": app.user.user.username,
                "email": app.user.user.email,
                "status": app.status,
                "resume": app.resume.url if app.resume else None,
                "cover_letter": app.cover_letter,
            }

          
            if request.user.role in ["HR", "recruiter"]:
                if app.ats_score and app.ats_score > 80:
                    item["ats_score"] = app.ats_score
                    item["ats_feedback"] = app.ats_feedback

            data.append(item)

        return Response(data)



class Updateapplicationstatusapi(APIView):
    permission_classes = [IsAuthenticated,IsAdminOrRecruiter]

    def patch(self, request, application_id):
        try:
            application = JobApplication.objects.get(
                id=application_id,
                job__posted_by=request.user.profile
            )
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=404)
    
        new_status = request.data.get("status")
    
        if new_status not in ['accepted', 'rejected', 'reviewed']:
            return Response({"error": "Invalid status"}, status=400)
        
    
        application.status = new_status
        application.save()
    



    
        return Response({"message": "Status updated"})
    


class userdeatails(APIView):
    def get(self, request):
        return Response({
            "user": str(request.user),
            "is_authenticated": request.user.is_authenticated,
            "role": getattr(request.user, "role", None),
        })


class Jobuserdeatialapi(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = Jobserializer(job)
        return Response(serializer.data)
    

class RecruiterProfileAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrRecruiter]

    def get(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    

class JobDeleteAPI(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrRecruiter]

    def delete(self, request, job_id):
        try:
            
            job = Job.objects.get(id=job_id, posted_by=request.user.profile)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

        job.delete()  
        return Response({"message": "Job deleted successfully"}, status=status.HTTP_200_OK)
    

class UserApplicationsAPI(APIView):
    permission_classes = [IsAuthenticated,IsUser]

    def get(self, request):
        user_profile = request.user.profile
        applications = JobApplication.objects.filter(user=user_profile)
        serializer = UserJobApplicationSerializer(applications, many=True)
        return Response(serializer.data)
    
class interviewschedule(APIView):
    permission_classes = [IsAuthenticated, IsAdminOrRecruiter]

    def get(self, request):
        applicant = JobApplication.objects.filter(
            job__posted_by=request.user.profile,
            status='accepted'
        )

        serializer = JobapplicationSerializer(applicant, many=True)
        return Response(serializer.data)

    def post(self, request, application_id):
        interview_date = request.data.get('interview_date')
        interview_link = request.data.get('interview_link')

        interview_date = parse_datetime(interview_date)

        if not interview_date:
            return Response({"error": "Invalid interview date format"}, status=400)
        if is_naive(interview_date):
            interview_date = make_aware(interview_date)

        if not interview_link:
            return Response({"error": "Interview link is required"}, status=400)
        

        try:
            applicant = JobApplication.objects.get(
                id=application_id,
                job__posted_by=request.user.profile
            )
        except JobApplication.DoesNotExist:
            return Response({"error": "Application not found"}, status=404)

        if applicant.status != 'accepted':
            return Response(
                {"error": "Only accepted candidates can be scheduled"},
                status=400
            )

        applicant.interview_date = interview_date
        applicant.interview_link = interview_link
        applicant.scheduler = request.user.profile
        applicant.save()

        send_email.delay(applicant.id)

        reminder = interview_date - timedelta(days=1)
        if reminder > timezone.now():
             send_remainder.apply_async(
                args=[applicant.id],
                eta=reminder
            )

        return Response(
            {"message": "Interview scheduled successfully"},
            status=201
        )