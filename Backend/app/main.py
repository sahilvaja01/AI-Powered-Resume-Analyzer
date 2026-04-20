import os

from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.parser import extract_text
from app.extractor import extract_all
from app.matcher import extract_jd_skills, match_skills
from app.scorer import extract_required_experience, calculate_final_score
from app.ai_service import generate_suggestions
from app.db import save_analysis, list_analyses

app = FastAPI(title="Resume Analyzer API", version="0.1.0")

_default_origins = "http://localhost:3000"
_origins = [o.strip() for o in os.getenv("CORS_ORIGINS", _default_origins).split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/parse")
async def parse_resume(resume: UploadFile = File(...)):
    try:
        file_bytes = await resume.read()
        text = extract_text(file_bytes, resume.filename)
        data = extract_all(text)
        return {"filename": resume.filename, "extracted": data}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {e}")


@app.post("/match")
async def match_resume(
    resume: UploadFile = File(...),
    jd: str = Form(...),
):
    try:
        file_bytes = await resume.read()
        resume_text = extract_text(file_bytes, resume.filename)
        resume_data = extract_all(resume_text)

        jd_skills = extract_jd_skills(jd)
        match = match_skills(resume_data["skills"], jd_skills)

        required_years = extract_required_experience(jd)
        scores = calculate_final_score(
            match["match_percentage"],
            resume_data["experience_years"],
            required_years,
            resume_data["education"],
        )

        return {
            "resume": resume_data,
            "jd_required_experience": required_years,
            "match": match,
            "scores": scores,
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching failed: {e}")


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    jd: str = Form(...),
):
    try:
        file_bytes = await resume.read()
        resume_text = extract_text(file_bytes, resume.filename)
        resume_data = extract_all(resume_text)

        jd_skills = extract_jd_skills(jd)
        match = match_skills(resume_data["skills"], jd_skills)

        required_years = extract_required_experience(jd)
        scores = calculate_final_score(
            match["match_percentage"],
            resume_data["experience_years"],
            required_years,
            resume_data["education"],
        )

        ai = generate_suggestions(resume_data, jd)

        result = {
            "name": resume_data.get("name"),
            "email": resume_data.get("email"),
            "phone": resume_data.get("phone"),
            "skills": resume_data.get("skills", []),
            "experience_years": resume_data.get("experience_years", 0),
            "education": resume_data.get("education", []),
            "jd_required_experience": required_years,
            "match_percentage": match["match_percentage"],
            "matched_skills": match["matched_skills"],
            "missing_skills": ai["missing_skills"] or match["missing_skills"],
            "score": scores["final_score"],
            "score_breakdown": scores,
            "suggestions": ai["suggestions"],
        }

        saved_id = save_analysis(result)
        if saved_id:
            result["_id"] = saved_id

        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {e}")


@app.get("/history")
def history(limit: int = 20):
    return {"analyses": list_analyses(limit)}
