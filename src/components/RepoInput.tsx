"use client";

import { useState, useRef, useCallback } from "react";
import {
  Search,
  Loader2,
  Sparkles,
  Lock,
  ChevronDown,
  Eye,
  EyeOff,
  HelpCircle,
  ExternalLink,
} from "lucide-react";
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
  const [showPat, setShowPat] = useState(false);
  const [revealPat, setRevealPat] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    /* istanbul ignore next */
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    containerRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    containerRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  const runAnalysis = async (targetUrl: string, targetPat: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: targetUrl, pat: targetPat }),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    await runAnalysis(url, pat);
  };

  const handleDemo = async () => {
    const demoUrl = "https://github.com/edycutjong/shipmate";
    setUrl(demoUrl);
    await runAnalysis(demoUrl, pat);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-3">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="shimmer-border spotlight-card relative flex items-center rounded-2xl overflow-hidden glass-strong"
      >
        <div className="pl-5 pr-2 text-sol-green">
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
          suppressHydrationWarning
          className="flex-1 py-4 px-2 bg-transparent border-none outline-none text-foreground placeholder:text-sol-muted font-mono text-sm"
        />
        <button
          type="button"
          onClick={handleDemo}
          disabled={isLoading}
          className="mr-2 my-2 px-4 py-2.5 bg-sol-dark/60 text-slate-300 font-medium hover:text-white border border-sol-border/30 hover:border-sol-border/60 rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center text-sm"
        >
          Demo
        </button>
        <button
          type="submit"
          disabled={isLoading || !url}
          className="cta-magnetic mr-2 my-2 px-6 py-2.5 bg-linear-to-r from-cyan-500 to-violet-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin" size={16} />
              <span>Analyzing</span>
            </>
          ) : (
            <>
              <Sparkles size={16} />
              <span>Analyze</span>
            </>
          )}
        </button>
      </div>

      {/* Private repo toggle */}
      <div className="flex flex-col items-center gap-2">
        <button
          type="button"
          onClick={() => setShowPat(!showPat)}
          className="group flex items-center gap-2 text-xs text-sol-muted hover:text-slate-300 transition-colors cursor-pointer"
        >
          <Lock size={12} className={showPat ? "text-cyan-400" : ""} />
          <span>Private repo? Override token</span>
          <ChevronDown
            size={12}
            className={`transition-transform duration-300 ${showPat ? "rotate-180 text-cyan-400" : ""}`}
          />
        </button>

        <div
          className={`w-full max-w-md overflow-hidden transition-all duration-300 ease-out ${
            showPat ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="glass rounded-xl border border-sol-border/30 p-3 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
              <Lock size={14} />
            </div>
            <div className="flex-1 relative">
              <input
                type={revealPat ? "text" : "password"}
                placeholder="Override GITHUB_TOKEN (optional)"
                value={pat}
                onChange={(e) => setPat(e.target.value)}
                disabled={isLoading}
                suppressHydrationWarning
                className="w-full bg-transparent border-none outline-none text-slate-300 placeholder:text-sol-muted/50 font-mono text-xs pr-8 py-1"
              />
              <button
                type="button"
                onClick={() => setRevealPat(!revealPat)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-sol-muted hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {revealPat ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            {pat && (
              <div className="shrink-0 w-2 h-2 rounded-full bg-sol-green glow-dot animate-pulse" />
            )}
          </div>

          {/* How to get a token guide */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowGuide(!showGuide)}
              className="flex items-center gap-1.5 text-[11px] text-sol-muted/60 hover:text-cyan-400/80 transition-colors mx-auto"
            >
              <HelpCircle size={11} />
              <span>How to get a token</span>
              <ChevronDown
                size={10}
                className={`transition-transform duration-200 ${showGuide ? "rotate-180" : ""}`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ease-out ${
                showGuide ? "max-h-80 opacity-100 mt-2" : "max-h-0 opacity-0"
              }`}
            >
              <div className="glass rounded-lg border border-sol-border/20 p-3 text-[11px] space-y-2.5">
                <ol className="space-y-2 text-sol-muted/70 list-none">
                  <li className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">1</span>
                    <span>
                      Go to{" "}
                      <a
                        href="https://github.com/settings/tokens?type=beta"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-400/80 hover:text-cyan-300 underline underline-offset-2 inline-flex items-center gap-0.5"
                      >
                        GitHub Settings → Tokens
                        <ExternalLink size={9} />
                      </a>
                    </span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">2</span>
                    <span>Click <strong className="text-slate-400">Generate new token</strong> → Fine-grained token</span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">3</span>
                    <span>Select your repo → Permissions → <strong className="text-slate-400">Contents: Read-only</strong></span>
                  </li>
                  <li className="flex gap-2.5 items-start">
                    <span className="shrink-0 w-4.5 h-4.5 rounded-full bg-cyan-500/15 text-cyan-400 text-[10px] font-bold flex items-center justify-center mt-0.5">4</span>
                    <span>Click <strong className="text-slate-400">Generate token</strong> → copy &amp; paste above</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-sol-muted/40 text-center mt-1.5 font-mono">
            Uses <code className="text-cyan-400/60">GITHUB_TOKEN</code> from .env.local · override above for different repos
          </p>
        </div>
      </div>
    </form>
  );
}
