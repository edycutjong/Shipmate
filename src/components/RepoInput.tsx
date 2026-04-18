"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import type { RepoData } from "@/app/dashboard/page";

interface RepoInputProps {
  onAnalyze: (data: RepoData) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export function RepoInput({ onAnalyze, isLoading, setIsLoading, setError }: RepoInputProps) {
  const [url, setUrl] = useState("");
  const [pat, setPat] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url, pat }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze repository");
      }

      onAnalyze(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
      <div className="relative flex items-center shadow-lg shadow-cyan-500/10 rounded-2xl overflow-hidden backdrop-blur-xl bg-white/5 border border-cyan-500/20">
        <div className="pl-4 pr-2 text-cyan-400">
          <Search size={20} />
        </div>
        <input
          type="text"
          name="repoUrl"
          placeholder="https://github.com/username/repository"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          disabled={isLoading}
          className="flex-1 py-4 px-2 bg-transparent border-none outline-none text-slate-50 placeholder:text-slate-500 font-mono text-sm"
        />
        <button
          type="submit"
          disabled={isLoading || !url}
          className="mr-2 my-2 px-6 py-2 bg-cyan-500 text-slate-900 font-semibold rounded-xl transition-all duration-200 hover:bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Analyzing</span>
            </>
          ) : (
            <span>Analyze</span>
          )}
        </button>
      </div>

      <div className="flex justify-center space-x-2 text-xs text-slate-500">
        <span>Private repo?</span>
        <input
          type="password"
          placeholder="Optional GitHub PAT"
          value={pat}
          onChange={(e) => setPat(e.target.value)}
          disabled={isLoading}
          className="bg-transparent border-b border-slate-700 outline-none text-slate-300 placeholder:text-slate-600 focus:border-cyan-500 transition-colors w-40 px-1"
        />
      </div>
    </form>
  );
}
