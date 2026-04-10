from django.urls import path
from .views import *

urlpatterns = [
    path('create/', Jobapiview.as_view()),
    path('apply/', Applyapiview.as_view()),
    path('list/', Joblistapi.as_view()),
    path('job/<int:job_id>/applicants/', Jobapplicantapi.as_view()),
    path('application/<int:application_id>/update/', Updateapplicationstatusapi.as_view()),
    path('userdeatails/',userdeatails.as_view()),
     path('<int:job_id>/', Jobuserdeatialapi.as_view()), 
     path('recruiter/profile/', RecruiterProfileAPI.as_view()),
     path('job/<int:job_id>/delete/', JobDeleteAPI.as_view(), ),
      path("my-application/", UserApplicationsAPI.as_view(),),
      path("interview/", interviewschedule.as_view()),
    path("interview/<int:application_id>/",interviewschedule.as_view(),name="interview-schedule" ),
]