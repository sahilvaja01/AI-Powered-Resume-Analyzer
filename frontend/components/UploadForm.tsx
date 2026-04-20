"use client";

import { useState } from "react";

type Props = {
  onSubmit: (resume: File, jd: string) => void;
  loading: boolean;
};

export default function UploadForm({ onSubmit, loading }: Props) {
  const [resume, setResume] = useState<File | null>(null);
  const [jd, setJd] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resume) {
      alert("Please upload a resume file");
      return;
    }
    if (!jd.trim()) {
      alert("Please paste the job description");
      return;
    }
    onSubmit(resume, jd);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass space-y-5 rounded-3xl p-6 shadow-2xl"
    >
      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </span>
          Resume File
        </label>
        <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-white/15 bg-white/5 p-4 transition hover:border-indigo-400/50 hover:bg-white/10">
          <input
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={(e) => setResume(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            {resume ? (
              <>
                <p className="truncate text-sm font-medium text-slate-200">{resume.name}</p>
                <p className="text-xs text-emerald-400">Ready to analyze</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-slate-300">Click to upload</p>
                <p className="text-xs text-slate-500">PDF, DOCX, or TXT</p>
              </>
            )}
          </div>
        </label>
      </div>

      <div>
        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/20 text-purple-300">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 12h7.5m-7.5 5.25h7.5M3.75 6.75h.008v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.008v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.008v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </span>
          Job Description
        </label>
        <textarea
          value={jd}
          onChange={(e) => setJd(e.target.value)}
          rows={7}
          placeholder="Paste the role's requirements, responsibilities, and required skills here..."
          className="block w-full resize-none rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-400/50 focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-purple-500/25 transition hover:shadow-purple-500/50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition group-hover:translate-x-full duration-1000" />
        {loading ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Analyzing
          </>
        ) : (
          <>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
            </svg>
            Analyze with AI
          </>
        )}
      </button>
    </form>
  );
}
