# AI-Powered Resume Analyzer

Drop a resume, paste a job description, and get an instant match score plus
AI-crafted improvement tips.

**Stack:** FastAPI · spaCy · Groq (Llama 3.3 70B) · Next.js 16 · Tailwind · MongoDB

---

## Features

- Resume parsing (PDF / TXT) — name, email, phone, skills, experience, education
- Keyword + JD matching with match percentage
- Weighted scoring: `skill * 0.5 + experience * 0.3 + education * 0.2`
- AI-generated missing skills and improvement suggestions (Groq Llama 3.3 70B)
- Results persisted in MongoDB
- Next.js UI with glassmorphism dark theme

---

## Project Structure

```
AI-Powered Resume Analyzer/
├── Backend/              # FastAPI + Python
│   ├── app/
│   │   ├── main.py        # API endpoints
│   │   ├── parser.py      # PDF/TXT -> text
│   │   ├── extractor.py   # text -> name, skills, experience, education
│   │   ├── matcher.py     # JD vs resume matching
│   │   ├── scorer.py      # weighted final score
│   │   ├── ai_service.py  # Groq LLM integration
│   │   └── db.py          # MongoDB save / list
│   └── requirements.txt
│
├── frontend/             # Next.js 16 (App Router) + Tailwind
│   ├── app/page.tsx
│   ├── components/
│   │   ├── UploadForm.tsx
│   │   └── ResultCard.tsx
│   └── lib/api.ts
│
└── samples/              # Test resumes + JD
```

---

## Setup

### 1. Backend

```bash
cd Backend
python -m venv venv
venv\Scripts\activate            # Windows CMD
# source venv/Scripts/activate   # Git Bash
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```

Create `Backend/.env` (copy from `.env.example`):

```
GROQ_API_KEY=gsk_...
MONGODB_URL=mongodb://localhost:27017
MONGODB_DB=resume_analyzer
```

Run:

```bash
uvicorn app.main:app --reload --port 8000
```

Server: http://localhost:8000
Swagger docs: http://localhost:8000/docs

### 2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Run:

```bash
npm run dev
```

UI: http://localhost:3000

### 3. MongoDB

Install MongoDB locally or use MongoDB Compass. Default connection:
`mongodb://localhost:27017`. The app creates a `resume_analyzer` database
and an `analyses` collection automatically.

---

## API Endpoints

| Method | Route       | Purpose                                            |
| ------ | ----------- | -------------------------------------------------- |
| GET    | `/health`   | Health check                                       |
| POST   | `/parse`    | Upload resume -> structured extraction             |
| POST   | `/match`    | Resume + JD -> match % + score                     |
| POST   | `/analyze`  | Full pipeline: parse + match + score + AI + save   |
| GET    | `/history`  | List recent analyses from MongoDB                  |

### Example `/analyze` response

```json
{
  "name": "Rahul Verma",
  "email": "rahul.verma@outlook.com",
  "skills": ["Python", "FastAPI", "Docker", "Kafka"],
  "experience_years": 5,
  "education": ["B.E.", "M.TECH"],
  "match_percentage": 87.5,
  "matched_skills": ["Python", "FastAPI", "Docker"],
  "missing_skills": ["Rust", "GitHub Actions"],
  "score": 93.75,
  "suggestions": [
    "Add Rust experience",
    "Mention GitHub Actions",
    "Highlight microservices expertise"
  ]
}
```

---

## Sample Data

See `samples/` for 4 sample resumes and a backend JD.

---

## Scoring Formula

```
final_score = skill_score * 0.5 + experience_score * 0.3 + education_score * 0.2
```

- `skill_score` = JD keyword match %
- `experience_score` = min(resume_years / required_years, 1.0) * 100
- `education_score` = 100 (Masters+) / 80 (Bachelors) / 50 (other) / 0 (none)
