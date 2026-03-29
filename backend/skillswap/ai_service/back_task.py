from celery import shared_task
from .services.rag_pipeline import pr

@shared_task
def process_application_task(application_id):
    from job.models import JobApplication

    app = JobApplication.objects.get(id=application_id)

    result = process_application(app)

    app.ats_score = result.get("score")
    app.ats_feedback = str(result)
    app.processed = True
    app.save()