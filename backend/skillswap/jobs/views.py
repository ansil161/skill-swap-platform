from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from access_control.permissions import IsUser, IsAdminOrRecruiter
from .models import Job, JobApplication
from .serializer import JobapplicationSerializer,Jobserializer,ProfileSerializer,UserJobApplicationSerializer
from rest_framework.permissions import IsAuthenticated


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
            serializer.save(user=userprofile, job=job)
            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)





class Jobapplicantapi(APIView):
    permission_classes = [IsAuthenticated,IsAdminOrRecruiter]

    def get(self, request, job_id):
        try:
            job = Job.objects.get(id=job_id, posted_by=request.user.profile)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

        applications = JobApplication.objects.filter(job=job)
        serializer = JobapplicationSerializer(applications, many=True)

        return Response(serializer.data)



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