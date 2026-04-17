"use client";

import { useState } from "react";
import UploadForm from "@/components/UploadForm";
import ResultCard from "@/components/ResultCard";
import { analyzeResume, AnalyzeResponse } from "@/lib/api";

export default function Home() {
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (resume: File, jd: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await analyzeResume(resume, jd);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-purple-600/30 mix-blend-screen blur-3xl animate-blob" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-indigo-500/30 mix-blend-screen blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-500/20 mix-blend-screen blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14">
        <header className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            Powered by Llama 3.3 · Real-time analysis
          </div>
          <h1 className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-5xl font-black tracking-tight text-transparent md:text-6xl">
            AI-Powered Resume Analyzer
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-400">
            Drop your resume, paste a JD, and get an instant match score plus
            AI-crafted improvement tips.
          </p>
        </header>

        <UploadForm onSubmit={handleAnalyze} loading={loading} />

        {error && (
          <div className="glass mt-6 flex items-start gap-3 rounded-2xl border-red-500/30 p-4 text-sm text-red-300">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {loading && (
          <div className="glass mt-6 rounded-2xl p-8 text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500/20 border-t-purple-400" />
            <p className="text-sm font-medium text-slate-300">
              Analyzing resume with AI...
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Parsing · Matching · Scoring · Generating suggestions
            </p>
          </div>
        )}

        {result && (
          <div className="mt-6">
            <ResultCard data={result} />
          </div>
        )}
      </div>
    </main>
  );
}
