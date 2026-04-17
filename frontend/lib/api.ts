const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type AnalyzeResponse = {
  name: string | null;
  email: string | null;
  phone: string | null;
  skills: string[];
  experience_years: number;
  education: string[];
  jd_required_experience: number;
  match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  score: number;
  score_breakdown: {
    skill_score: number;
    experience_score: number;
    education_score: number;
    final_score: number;
  };
  suggestions: string[];
};

export async function analyzeResume(
  resume: File,
  jd: string
): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("resume", resume);
  formData.append("jd", jd);

  const response = await fetch(`${API_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Analysis failed: ${error}`);
  }

  return response.json();
}
