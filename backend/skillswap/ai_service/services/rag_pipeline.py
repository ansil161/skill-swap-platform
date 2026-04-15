from .resume_parse import resume_parse
from .chroma_store import add_vector, searchs, delete_application_vectors
from .grok_llm import analyze_resume
from .chunk import chunk_text
import json


from .embedding import resume_embedding



# def extract_skill_resume(chunks, job_skills):
#     matched = set()

#     for chunk in chunks:
#         chunk_lower = chunk.lower()
#         for skill in job_skills:
#             if skill.lower() in chunk_lower:
#                 matched.add(skill)

#     missed = [s for s in job_skills if s not in matched]
#     return list(matched), missed


# def calculate_ats(matched,skills):
#     if not skills:
#         return 0
#     return int((len(matched) / len(skills)) * 100)
    
def resume_process(application):
    if application.processed and application.ats_feedback:
        return json.loads(application.ats_feedback)

    with application.resume.open('rb') as f:
        resume_text = resume_parse(f)
    chunks = chunk_text(resume_text)

    job_des = application.job.description


 

    delete_application_vectors(application.id)
    add_vector(chunks, application.id)

    retrieved_chunks = searchs(application.job.description)
    if not retrieved_chunks:
        retrieved_chunks = chunks[:5]

    result = analyze_resume(application.job.description, retrieved_chunks)

    return {
        'ats_score': result.get('score',0),
        'matched_skill': result.get('matched_skills', []),
        'missing_skill': result.get('missing_skills', []),
        'suggestion': result.get('suggestions', [])
    }