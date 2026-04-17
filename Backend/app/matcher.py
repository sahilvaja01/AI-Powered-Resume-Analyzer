import re
from typing import List

from app.extractor import COMMON_SKILLS


def extract_jd_skills(jd_text: str) -> List[str]:
    jd_lower = jd_text.lower()
    found = []
    for skill in COMMON_SKILLS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"
        if re.search(pattern, jd_lower):
            found.append(skill.title())
    return sorted(set(found))


def match_skills(resume_skills: List[str], jd_skills: List[str]) -> dict:
    resume_set = {s.lower() for s in resume_skills}
    jd_set = {s.lower() for s in jd_skills}

    matched = sorted([s.title() for s in resume_set & jd_set])
    missing = sorted([s.title() for s in jd_set - resume_set])

    match_percentage = round(
        (len(matched) / len(jd_set)) * 100 if jd_set else 0, 2
    )

    return {
        "matched_skills": matched,
        "missing_skills": missing,
        "jd_skills": sorted([s.title() for s in jd_set]),
        "match_percentage": match_percentage,
    }
