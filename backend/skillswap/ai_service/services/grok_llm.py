
import os
import json
import re
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate



def analyze_resume(job_desc, chunks):

    context = "\n".join(chunks)

    prompt = ChatPromptTemplate.from_template("""
    Return ONLY valid JSON.
    
    Format:
    {{
        "score": number (0-100),
        "missing_skills": ["skill1", "skill2"],
        "suggestions": ["suggestion1"],
        "matched_skills": ["skill1", "skill2"],
                                              
    }}
    
    STRICT:
    - No explanation
    - No markdown
    
    Job Description:
    {job}
    
    Relevant Resume Sections:
    {context}
    """)

    chain = prompt | llm   #

    try:
        res = chain.invoke({
            "job": job_desc,
            "context": context
        })

        content = res.content

        match = re.search(r'\{.*\}', content, re.DOTALL)

        if not match:
            raise Exception(f"Invalid JSON: {content}") 

        return json.loads(match.group())

    except Exception as e:
        print("[analyse error]", e)

        return {
            "score": None,
            "missing_skills": [],
            "suggestions": ["AI failed, try again"]
        }


def llm_chain():
    models_chain = [
        "llama-3.3-70b-versatile",
        "llama-3.1-70b-versatile",
        "mixtral-8x7b-32768",
    ]

    primary=ChatGroq(
        model=models_chain[0],
        groq_api_key=os.getenv("GROQ_API_KEY"),
        temperature=0.0
    )
    fallback = [
        ChatGroq(
            model=m,
            groq_api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.0
        )
        for m in models_chain[1:]
    ]

    return primary.with_fallbacks(fallback)



llm = llm_chain()

# def extract_skill_des(job_des):

#     prompt = ChatPromptTemplate.from_template("""
#     Return ONLY valid JSON array.
    
#     Example:
#     ["python", "django", "rest api"]
    
#     STRICT:
#     - Only skills
#     - No explanation
#     - No markdown
    
#     Job Description:
#     {job}
#     """)

#     chain = prompt | llm

#     try:
#         res = chain.invoke({"job": job_des})
#         content = res.content

#         match = re.search(r'\[.*\]', content, re.DOTALL)

#         if not match:
#             raise Exception(f"Invalid JSON: {content}")

#         skills = json.loads(match.group())

#         return list(set([s.lower() for s in skills]))

#     except Exception as e:
#         print(f"[SKILL EXTRACTION ERROR]: {e}")
#         return []
