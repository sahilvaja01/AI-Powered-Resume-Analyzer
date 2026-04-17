import re
from typing import List


def calculate_skill_score(match_percentage: float) -> float:
    return round(match_percentage, 2)


def extract_required_experience(jd_text: str) -> float:
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience",
        r"minimum\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)",
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)",
    ]
    for pat in patterns:
        m = re.search(pat, jd_text, re.IGNORECASE)
        if m:
            return float(m.group(1))
    return 0.0


def calculate_experience_score(resume_years: float, required_years: float) -> float:
    if required_years == 0:
        return 100.0
    ratio = min(resume_years / required_years, 1.0)
    return round(ratio * 100, 2)


def calculate_education_score(education: List[str]) -> float:
    if not education:
        return 0.0
    higher = {"M.TECH", "MTECH", "MASTER", "MBA", "MCA", "PHD"}
    lower = {"B.TECH", "BTECH", "BACHELOR", "B.E.", "B.SC", "BSC", "DIPLOMA"}
    edu_set = set(education)
    if edu_set & higher:
        return 100.0
    if edu_set & lower:
        return 80.0
    return 50.0


def calculate_final_score(
    match_percentage: float,
    resume_years: float,
    required_years: float,
    education: List[str],
) -> dict:
    skill = calculate_skill_score(match_percentage)
    experience = calculate_experience_score(resume_years, required_years)
    edu = calculate_education_score(education)

    final = round(skill * 0.5 + experience * 0.3 + edu * 0.2, 2)

    return {
        "skill_score": skill,
        "experience_score": experience,
        "education_score": edu,
        "final_score": final,
    }
