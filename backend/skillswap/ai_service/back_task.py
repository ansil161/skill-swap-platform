from celery import shared_task
from jobs.models import JobApplication
from ai_service.services.rag_pipeline import resume_process
import json



import logging







logger = logging.getLogger(__name__)

@shared_task
def process_application_task(application_id):
    try:
        app = JobApplication.objects.get(id=application_id)
        result = resume_process(app)

        app.ats_score = result.get("ats_score", 0)
        app.ats_feedback = json.dumps(result)
        app.processed = True
        app.save()
        logger.info(f"Processed application {application_id} successfully")
    except Exception as e:
        logger.exception(f"Error processing application {application_id}: {e}")