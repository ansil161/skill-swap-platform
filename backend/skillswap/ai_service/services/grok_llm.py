from groq import Groq
import os
import json
import re

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def analyze_resume(job_desc, chunks):
    context = "\n".join(chunks)

    prompt = f"""
Return ONLY valid JSON. No explanation. No markdown.

Format:
{{
    "score": number (0-100),
    "missing_skills": ["skill1", "skill2"],
    "suggestions": ["suggestion1"]
}}

Job Description:
{job_desc}

Relevant Resume Sections:
{context}
"""

    res = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    content = res.choices[0].message.content

    try:
        json_str = re.search(r'\{.*\}', content, re.DOTALL).group()
        return json.loads(json_str)
    except Exception:
        return {
            "score": None,
            "missing_skills": [],
            "suggestions": [content]
        }
    


def extract_skill_des(job_des):
    prompt = f"""
    You are an HR assistant. Extract all technical and professional skills required
    for the following job description. Return ONLY a JSON array of skills.
    
    Job Description:
    {job_des}
    
    Example output:
    ["python", "django", "rest api", "aws"]
    """
    res = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        json_str = re.search(r'\[.*\]', res.choices[0].message.content, re.DOTALL).group()
        skills = json.loads(json_str)
      
        skills = [s.lower() for s in skills]
        return list(set(skills))  
    except Exception:
      
        return []