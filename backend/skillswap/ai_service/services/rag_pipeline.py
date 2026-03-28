from .resume_parse import resume_parse
from .embedding import resume_embedding
from skill.backend.skillswap.ai_service.services.chroma_store import add_vector,searchs
from grok_llm import analyse_resume
from .chunk import chunk_text
import json

def resume_process(application):
  
    resume_converter=resume_parse(application.resume.path)
    chunks=chunk_text(resume_converter)

    for i in chunks:
        vector=resume_embedding(i)
        add_vector(vector,i)
    job_description=application.job.description
   
    job_vector=resume_embedding(job_description)
    get_filter=searchs(job_vector,k=5)
    result=analyse_resume(job_description,get_filter)
    try:
        data=json.load(result)
    except :
        data={
            'score':None,
            'missing_skills':[],
            'suggestion':None
        }
    return data



