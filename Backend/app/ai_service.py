import json
import os
import re
from typing import List

from dotenv import load_dotenv
from groq import Groq
from pydantic import BaseModel, ValidationError

load_dotenv()

_client: Groq | None = None


def _get_client() -> Groq | None:
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return None
    _client = Groq(api_key=api_key)
    return _client


SYSTEM_PROMPT = """You are an expert career coach and resume reviewer.

Given a candidate's resume data and a job description:
1. Identify skills mentioned in the JD but missing from the resume.
2. Provide 3-5 specific, actionable suggestions to improve the resume for this role.

Be concise, professional, and focused on the specific gap between the resume and JD.
Do not repeat skills the candidate already has. Keep each suggestion under 20 words.

Respond ONLY with a valid JSON object in this exact format:
{
  "missing_skills": ["skill1", "skill2"],
  "suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

No prose before or after the JSON. No markdown fences.
""" 


class AIAnalysis(BaseModel):
    missing_skills: List[str]
    suggestions: List[str]


def _extract_json(text: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip(), flags=re.MULTILINE)
    match = re.search(r"\{.*\}", cleaned, re.DOTALL)
    if not match:
        raise ValueError("No JSON object found in response")
    return json.loads(match.group(0))


def generate_suggestions(resume_data: dict, jd_text: str) -> dict:
    client = _get_client()
    if client is None:
        return {
            "missing_skills": [],
            "suggestions": ["Set GROQ_API_KEY in .env to enable AI suggestions."],
        }

    user_message = f"""Resume Data:
- Name: {resume_data.get('name')}
- Skills: {', '.join(resume_data.get('skills', []))}
- Experience: {resume_data.get('experience_years', 0)} years
- Education: {', '.join(resume_data.get('education', []))}

Job Description:
{jd_text}

Analyze and return missing skills + improvement suggestions as JSON."""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            max_tokens=1500,
            temperature=0.4,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
        )
        raw_text = response.choices[0].message.content or ""
        data = _extract_json(raw_text)
        parsed = AIAnalysis(**data)
        return parsed.model_dump()
    except (ValidationError, ValueError, json.JSONDecodeError) as e:
        return {
            "missing_skills": [],
            "suggestions": [f"AI parsing failed: {e}"],
        }
    except Exception as e:
        return {
            "missing_skills": [],
            "suggestions": [f"AI suggestion failed: {e}"],
        }
