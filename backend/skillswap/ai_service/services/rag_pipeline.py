from .resume_parse import resume_parse
from .embedding import resume_embedding
from .chroma_store import add_vector,searchs
from grok_llm import analyse_resume
from .chunk import chunk_text
import json

def resume_process(application):
  
    resume_converter=resume_parse(application.resume.path)
    chunks=chunk_text(resume_converter)
    add_vector(chunks,application.id)
    retrieve=searchs(application.job.description,
                     application.id)
    result=analyse_resume(
        application.job.description,
        retrieve
    )

    try:
        data=json.load(result)
    except:
        data={
            'score':None,
            'missink_skills':[],
            'suggestion':[result]

        }

    return data

   



