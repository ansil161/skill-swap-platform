from .resume_parse import resume_parse
from .chroma_store import add_vector, searchs, delete_application_vectors
from .grok_llm import analyze_resume
from .chunk import chunk_text
import json
from .rag_pipeline import extract_skill_des



def extract_skill_resume(resume_skill,job_des):
    resume_texts=resume_skill.lower()
    matched=[ i for i in job_des if i in resume_texts]
    misss=[i for i in job_des if i not in resume_texts]
    return matched,misss

def calculate_ats(macthed,skills):
    if not skills:
        return 0
    return int((len(macthed) / len(skills)) * 100)
    

def resume_process(application):

    if application.processed and application.ats_feedback:
        return json.loads(application.ats_feedback)


    resume_text = resume_parse(application.resume.path)

    chunks = chunk_text(resume_text)
    job_des=application.job.description
    required_skill=extract_skill_des(job_des)
    matched_skill,missed_skill=extract_skill_resume(required_skill,resume_text)
    ats_score=calculate_ats(matched_skill,required_skill)





    delete_application_vectors(application.id)
    


    add_vector(chunks, application.id)


    retrieved_chunks = searchs(application.job.description)


    if not retrieved_chunks:
        retrieved_chunks = chunks[:5]

    result = analyze_resume(
        application.job.description,
        retrieved_chunks
    )

    return {
        'ats_score':ats_score,
        'matched_skill':matched_skill,
        'missing_skill':missed_skill,
        'suggestion':result.get('suggestions', [])
        

    }
