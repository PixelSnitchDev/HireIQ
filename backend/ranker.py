import xgboost as xgb
import lightgbm as lgb
import numpy as np
import pandas as pd
import os

FEATURE_NAMES = [
    "core_skill_score", "secondary_skill_score", "wrong_domain_ratio",
    "career_quality", "career_velocity", "switching_penalty",
    "experience_score", "behavioral_score", "assessment_score",
    "has_github_flag", "has_assessment_flag", "github_score",
    "response_rate", "interview_completion", "open_to_work",
    "notice_period_inv", "profile_completeness", "education_score",
    "years_normalized", "relocation_flag", "neural_semantic_score",
    "proof_of_work_score", "salary_fit_score"
]

THRESHOLD = 0.5

def load_models():
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    xgb_model = xgb.Booster()
    xgb_model.load_model(os.path.join(models_dir, "xgboost_model_final.json"))
    lgb_model = lgb.Booster(model_file=os.path.join(models_dir, "lightgbm_final.txt"))
    return xgb_model, lgb_model

def score_candidate(features: dict, xgb_model, lgb_model) -> float:
    df = pd.DataFrame([features])[FEATURE_NAMES]
    dmatrix = xgb.DMatrix(df)
    xgb_score = float(xgb_model.predict(dmatrix)[0])
    lgb_score = float(lgb_model.predict(df)[0])
    ensemble_score = 0.5 * xgb_score + 0.5 * lgb_score
    return ensemble_score

def rank_candidates(candidates: list, open_seats: int) -> dict:
    xgb_model, lgb_model = load_models()

    scored = []
    for candidate in candidates:
        features = {k: float(candidate.get(k, 0.0)) for k in FEATURE_NAMES}
        score = score_candidate(features, xgb_model, lgb_model)
        scored.append({
            "name": candidate.get("candidate_name", "Unknown"),
            "email": candidate.get("email", ""),
            "filename": candidate.get("filename", ""),
            "score": round(score * 100, 2),
            "eligible": score >= THRESHOLD,
            "rank": None
        })

    scored.sort(key=lambda x: x["score"], reverse=True)

    eligible = [c for c in scored if c["eligible"]]
    ineligible = [c for c in scored if not c["eligible"]]

    for i, candidate in enumerate(eligible[:open_seats]):
        candidate["rank"] = i + 1

    return {
        "selected": eligible[:open_seats],
        "waitlist": eligible[open_seats:],
        "ineligible": ineligible,
        "total_eligible": len(eligible),
        "seats": open_seats
    }