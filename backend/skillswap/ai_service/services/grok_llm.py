from groq import Groq
import os

client = Groq(api_key=os.getenv("GROQ_API_KEY"))
import json

def analyze_resume(job_desc, chunks):
    context = "\n".join(chunks)

    prompt = f"""
    You are an ATS system.

    Job Description:
    {job_desc}

    Relevant Resume Sections:
    {context}

    Return ONLY JSON:
    {{
        "score": number,
        "missing_skills": [],
        "suggestions": []
    }}
    """

    res = client.chat.completions.create(
        model="llama3-8b-8192",
        messages=[{"role": "user", "content": prompt}]
    )

    content = res.choices[0].message.content

    try:
        return json.loads(content)
    except:
        return {
            "score": None,
            "missing_skills": [],
            "suggestions": [content]
        }