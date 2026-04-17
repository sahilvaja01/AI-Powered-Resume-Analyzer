import re
from typing import List, Optional

import spacy

nlp = spacy.load("en_core_web_sm")

COMMON_SKILLS = [
    "python", "java", "javascript", "typescript", "react", "next.js",
    "node.js", "express", "fastapi", "django", "flask", "sql", "mysql",
    "postgresql", "mongodb", "redis", "docker", "kubernetes", "aws",
    "azure", "gcp", "git", "github", "linux", "html", "css", "tailwind",
    "bootstrap", "redux", "machine learning", "deep learning", "nlp",
    "tensorflow", "pytorch", "pandas", "numpy", "scikit-learn",
    "rest api", "graphql", "ci/cd", "jenkins", "kafka", "spark",
    "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin",
]

EDUCATION_KEYWORDS = [
    "b.tech", "btech", "bachelor", "b.e.", "b.sc", "bsc",
    "m.tech", "mtech", "master", "mba", "mca", "phd", "diploma",
]


def extract_email(text: str) -> Optional[str]:
    match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
    return match.group(0) if match else None


def extract_phone(text: str) -> Optional[str]:
    match = re.search(r"(\+?\d{1,3}[-.\s]?)?\d{10}", text)
    return match.group(0) if match else None


def extract_name(text: str) -> Optional[str]:
    doc = nlp(text[:500])
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            name = ent.text.strip().split("\n")[0].strip()
            if name:
                return name
    first_line = text.strip().split("\n")[0].strip()
    if first_line and len(first_line) < 50:
        return first_line
    return None


def extract_skills(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for skill in COMMON_SKILLS:
        pattern = r"(?<![a-z0-9])" + re.escape(skill) + r"(?![a-z0-9])"
        if re.search(pattern, text_lower):
            found.append(skill.title())
    return sorted(set(found))


def extract_experience_years(text: str) -> float:
    patterns = [
        r"(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)\s*(?:of)?\s*experience",
        r"experience\s*(?:of)?\s*(\d+(?:\.\d+)?)\s*\+?\s*(?:years?|yrs?)",
    ]
    years = []
    for pat in patterns:
        for m in re.finditer(pat, text, re.IGNORECASE):
            years.append(float(m.group(1)))
    return max(years) if years else 0.0


def extract_education(text: str) -> List[str]:
    text_lower = text.lower()
    found = []
    for edu in EDUCATION_KEYWORDS:
        if edu in text_lower:
            found.append(edu.upper())
    return sorted(set(found))


def extract_all(text: str) -> dict:
    return {
        "name": extract_name(text),
        "email": extract_email(text),
        "phone": extract_phone(text),
        "skills": extract_skills(text),
        "experience_years": extract_experience_years(text),
        "education": extract_education(text),
    }
