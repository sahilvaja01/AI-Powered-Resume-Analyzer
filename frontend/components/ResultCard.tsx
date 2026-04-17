import { AnalyzeResponse } from "@/lib/api";

type Props = {
  data: AnalyzeResponse;
};

function scoreTone(score: number) {
  if (score >= 80) return { text: "text-emerald-400", stroke: "#34d399", glow: "shadow-emerald-500/50" };
  if (score >= 60) return { text: "text-amber-400", stroke: "#fbbf24", glow: "shadow-amber-500/50" };
  return { text: "text-red-400", stroke: "#f87171", glow: "shadow-red-500/50" };
}

function ScoreRing({ score }: { score: number }) {
  const tone = scoreTone(score);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className={`relative h-36 w-36 ${tone.glow} drop-shadow-2xl`}>
      <svg className="glow-ring h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={tone.stroke}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-4xl font-extrabold ${tone.text}`}>{score}</span>
        <span className="text-xs font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

function StatPill({ label, value }: { label: string; value: number }) {
  const tone = scoreTone(value);
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className={`mt-1 text-xl font-bold ${tone.text}`}>{value}%</div>
    </div>
  );
}

export default function ResultCard({ data }: Props) {
  return (
    <div className="glass space-y-7 rounded-3xl p-6 shadow-2xl">
      <div className="flex flex-col items-center gap-6 border-b border-white/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="order-2 flex-1 text-center sm:order-1 sm:text-left">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-400">
            Candidate Profile
          </p>
          <h2 className="mt-1 text-3xl font-bold text-white">
            {data.name || "Anonymous"}
          </h2>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-slate-400 sm:justify-start">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>· {data.phone}</span>}
            <span>· {data.experience_years} yrs exp</span>
            {data.education.length > 0 && (
              <span>· {data.education.join(", ")}</span>
            )}
          </div>
        </div>
        <div className="order-1 sm:order-2">
          <ScoreRing score={data.score} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatPill label="Skills" value={data.score_breakdown.skill_score} />
        <StatPill label="Experience" value={data.score_breakdown.experience_score} />
        <StatPill label="Education" value={data.score_breakdown.education_score} />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Skills Breakdown</h3>
          <span className="text-xs text-slate-500">
            {data.match_percentage}% JD match
          </span>
        </div>

        <div className="mb-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Matched · {data.matched_skills.length}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {data.matched_skills.map((s) => (
              <span
                key={s}
                className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {data.missing_skills.length > 0 && (
          <div>
            <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-red-400">
              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              Missing · {data.missing_skills.length}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.missing_skills.map((s) => (
                <span
                  key={s}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-300"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {data.suggestions.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
            AI Improvements
          </h3>
          <ul className="space-y-2">
            {data.suggestions.map((s, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-2xl border border-white/10 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-3 text-sm text-slate-200"
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <span className="flex-1">{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
