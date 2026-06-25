# HireIQ 🎯

![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.138-green)
![React](https://img.shields.io/badge/React-18-blue)
![XGBoost](https://img.shields.io/badge/XGBoost-AUC%201.0-orange)
![LightGBM](https://img.shields.io/badge/LightGBM-AUC%201.0-yellow)
![Groq](https://img.shields.io/badge/LLM-Llama%203.3%2070B-purple)

> Rank candidates the way a great recruiter would — not by matching keywords, but by actually understanding who fits the role.

## The Problem

Recruiters go through hundreds of profiles and still miss the right person. Not because the talent is not there — but because keyword filters cannot see what actually matters. Traditional ATS systems match words, not people.

## The Solution

HireIQ uses a hybrid AI system to rank resumes against a job description the way an expert recruiter would. It understands career trajectory, behavioral signals, domain fit, and proof of work — then delivers a shortlist you can trust.

Upload resumes + paste a job description + set open seats and get a ranked shortlist instantly.

## How It Works

Resume PDF is uploaded by the recruiter. Text is extracted using pdfplumber. Llama 3.3 70B via Groq API reads the resume and job description and extracts 23 structured features. XGBoost and LightGBM ensemble model scores each candidate. The system returns a ranked shortlist with Selected, Waitlisted, and Not Eligible categories.

## Why It Is Different

Traditional ATS uses keyword matching and gives binary yes or no results with no context. HireIQ uses semantic understanding, analyzes career trajectory, scores candidates on 23 signals, and delivers a ranked output with match percentage.

## Tech Stack

- Frontend: React + Tailwind CSS + Vite
- Backend: FastAPI + Python
- AI Models: XGBoost + LightGBM ensemble
- LLM: Llama 3.3 70B via Groq API
- PDF Parsing: pdfplumber

## Model Performance

| Metric | Score |
|--------|-------|
| AUC | 1.0 |
| Precision | 0.965 |
| Recall | 0.9928 |
| F1 Score | 0.9787 |
| Training Examples | 4182 |
| Candidates Scored | 100000 |

## 23 Features Used

| Category | Features |
|----------|----------|
| Skills | core_skill_score, secondary_skill_score, wrong_domain_ratio |
| Career | career_quality, career_velocity, switching_penalty, experience_score |
| Behavioral | behavioral_score, assessment_score, response_rate, interview_completion |
| Profile | has_github_flag, github_score, profile_completeness, education_score |
| Availability | open_to_work, notice_period_inv, relocation_flag, years_normalized |
| AI Signals | neural_semantic_score, proof_of_work_score, salary_fit_score |

## Features

- Upload multiple resumes in PDF format
- Paste any job description
- Set number of open seats
- AI scores each candidate against the job description
- Returns ranked shortlist with match percentage
- Selected, Waitlisted, and Not Eligible status for every candidate

## Setup Instructions

### Prerequisites

- Python 3.11 or higher
- Node.js 18 or higher
- Groq API key available free at console.groq.com

### Backend Setup

cd backend
pip install -r requirements.txt
cp .env.example .env
Add your Groq API key to the .env file
uvicorn main:app --reload

### Frontend Setup

cd frontend
npm install
npm run dev

### Model Files

Download and place these files in the backend/models/ folder:
- xgboost_model_final.json
- lightgbm_final.txt

### Environment Variables

Create a file called .env inside the backend folder with this content:
GROQ_API_KEY=your_groq_api_key_here

