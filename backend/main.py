from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import shutil, os, tempfile

from parser import extract_text_from_pdf, parse_resume_with_llm
from ranker import rank_candidates

app = FastAPI(title="Resume Ranker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/rank")
async def rank_resumes(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(...),
    open_seats: int = Form(...)
):
    parsed_candidates = []
    
    with tempfile.TemporaryDirectory() as tmpdir:
        for resume in resumes:
            path = os.path.join(tmpdir, resume.filename)
            with open(path, "wb") as f:
                shutil.copyfileobj(resume.file, f)
            
            text = extract_text_from_pdf(path)
            parsed = parse_resume_with_llm(text, job_description)
            parsed["filename"] = resume.filename
            parsed_candidates.append(parsed)
    
    results = rank_candidates(parsed_candidates, open_seats)
    return results

@app.get("/health")
def health():
    return {"status": "ok"}