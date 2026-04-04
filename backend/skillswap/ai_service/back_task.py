from celery import shared_task
from jobs.models import JobApplication
from ai_service.services.rag_pipeline import resume_process
import json


@shared_task
def process_application_task(application_id):
    try:
        app = JobApplication.objects.get(id=application_id)

        result = resume_process(app)

        app.ats_score = result.get("score") or 0
        app.ats_feedback = json.dumps(result)
        app.processed = True
        app.save()

    except Exception as e:
        print("Error processing application:", e)