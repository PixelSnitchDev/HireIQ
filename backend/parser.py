import pdfplumber
import json
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def extract_text_from_pdf(file_path: str) -> str:
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() or ""
    return text

def parse_resume_with_llm(resume_text: str, jd_text: str) -> dict:
    prompt = f"""
You are an expert resume parser. Extract structured information from this resume and score it against the job description.

JOB DESCRIPTION:
{jd_text}

RESUME:
{resume_text}

Return ONLY a valid JSON object with these exact fields (all values between 0 and 1 unless specified):
{{
  "candidate_name": "string",
  "email": "string",
  "core_skill_score": 0.0,
  "secondary_skill_score": 0.0,
  "wrong_domain_ratio": 0.0,
  "career_quality": 0.0,
  "career_velocity": 0.0,
  "switching_penalty": 0.0,
  "experience_score": 0.0,
  "behavioral_score": 0.0,
  "assessment_score": 0.0,
  "has_github_flag": 0,
  "has_assessment_flag": 0,
  "github_score": 0.0,
  "response_rate": 0.0,
  "interview_completion": 0.0,
  "open_to_work": 1,
  "notice_period_inv": 0.0,
  "profile_completeness": 0.0,
  "education_score": 0.0,
  "years_normalized": 0.0,
  "relocation_flag": 0,
  "neural_semantic_score": 0.0,
  "proof_of_work_score": 0.0,
  "salary_fit_score": 0.0
}}

Scoring rules:
- core_skill_score: how well core skills match JD (0-1)
- secondary_skill_score: secondary/bonus skills match (0-1)
- wrong_domain_ratio: experience in wrong domain (0=good, 1=bad)
- career_quality: overall career progression quality (0-1)
- career_velocity: speed of career growth (0-1)
- switching_penalty: too many job switches (0=stable, 1=too many)
- experience_score: years and relevance of experience (0-1)
- education_score: education relevance and level (0-1)
- years_normalized: total years of experience normalized (0-1, 10+ years = 1.0)
- has_github_flag: 1 if GitHub mentioned, else 0
- github_score: quality of GitHub presence (0-1)
- profile_completeness: how complete the resume is (0-1)
- neural_semantic_score: semantic similarity to JD (0-1)
- proof_of_work_score: projects, achievements, impact (0-1)
- salary_fit_score: assume 0.8 if not mentioned

Return ONLY the JSON, no explanation.
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=1000
    )
    
    content = response.choices[0].message.content.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    return json.loads(content)