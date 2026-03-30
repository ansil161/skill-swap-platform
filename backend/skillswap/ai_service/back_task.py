from celery import shared_task
from .services.rag_pipeline import resume_process
from jobs.models import JobApplication



@shared_task
def process_application_task(application_id):
   

    app = JobApplication.objects.get(id=application_id)

    result = resume_process(app)

    app.ats_score = result.get("score")
    app.ats_feedback = str(result)
    app.processed = True
    app.save()