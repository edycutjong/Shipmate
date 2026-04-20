"use client";

import { useState, useCallback } from "react";
import { RepoInput } from "@/components/RepoInput";
import { RepoSummary } from "@/components/RepoSummary";
import { GenerationPanel } from "@/components/GenerationPanel";
import {
  Rocket,
  MonitorSmartphone,
  Hash,
  Triangle,
  Zap,
  Check,
  GitFork,
  ArrowLeft,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import Link from "next/link";

export interface RepoData {
  name: string;
  description: string;
  techStack: string[];
  features: string[];
  recentWork: string[];
  readmeExcerpt: string;
  routeTree: string[];
}

type PipelineStep = "idle" | "analyzing" | "analyzed" | "generating" | "done";

export default function DashboardPage() {
  const [repoData, setRepoData] = useState<RepoData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [landingText, setLandingText] = useState("");
  const [xTwitterText, setXTwitterText] = useState("");
  const [productHuntText, setProductHuntText] = useState("");
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>("idle");

  const handleAnalyze = useCallback(async (data: RepoData) => {
    setRepoData(data);
    setPipelineStep("analyzed");
    // Reset generation state
    setLandingText("");
    setXTwitterText("");
    setProductHuntText("");
    setIsGenerating(true);
    setPipelineStep("generating");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoContext: data }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let buffer = "";

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          // The last element is either an empty string (if it ended with \n) 
          // or an incomplete line. Keep it in the buffer.
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const dataStr = line.slice(6);
              if (!dataStr.trim()) continue;

              try {
                const parsed = JSON.parse(dataStr);
                if (parsed.type === "landing") {
                  setLandingText((prev) => prev + parsed.content);
                } else if (parsed.type === "producthunt") {
                  setProductHuntText((prev) => prev + parsed.content);
                } else if (parsed.type === "x_twitter") {
                  setXTwitterText((prev) => prev + parsed.content);
                } else if (parsed.type === "done") {
                  setIsGenerating(false);
                  setPipelineStep("done");
                }
              } catch {
                // Ignore parse errors from partial JSON if any
              }
            }
          }
        }
      }
    } catch {
      setError("Failed to generate content.");
    } finally {
      setIsGenerating(false);
      setPipelineStep((prev) => (prev === "generating" ? "done" : prev));
    }
  }, []);

  const handleLoadingChange = useCallback((loading: boolean) => {
    setIsLoading(loading);
    if (loading) setPipelineStep("analyzing");
  }, []);

  const handleErrorChange = useCallback((err: string | null) => {
    setError(err);
    if (err) setPipelineStep("idle");
  }, []);

  return (
    <main className="min-h-screen relative overflow-hidden selection:bg-cyan-500/30">
      {/* ——— Ambient Background ——— */}
      <div className="hero-mesh" />
      <div className="animated-grid" />
      <div
        className="orb orb-green"
        style={{ width: 400, height: 400, top: "-5%", left: "-5%" }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 350, height: 350, top: "30%", right: "-8%" }}
      />
      <div className="particles">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col min-h-screen px-6 md:px-12">
        {/* ——— Header ——— */}
        <header className="flex items-center justify-between py-5">
          <Link
            href="/"
            className="group flex items-center gap-3 text-sol-muted hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
            <div className="logo-container">
              <div className="logo-glow" />
              <div className="logo-icon">
                <Rocket size={16} className="text-white" />
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              Shipmate
            </span>
          </Link>

          <a
            href="https://github.com/edycutjong/shipmate"
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta"
          >
            <SiGithub size={16} />
            <span className="hidden sm:inline">Source</span>
          </a>
        </header>

        {/* ——— Hero ——— */}
        <section className="flex flex-col items-center justify-center py-10 text-center">
          {/* Badge */}
          <div className="animated-badge-border badge-glow inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6 animate-slide-up">
            <Rocket size={14} className="text-sol-green" />
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              AUTOMATED MARKETING ENGINE
            </span>
          </div>

          <h1 className="animate-headline text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-4">
            <span className="gradient-text-shimmer">Paste Your Repo.</span>{" "}
            <span className="text-foreground">Get Launch Copy.</span>
          </h1>

          <p
            className="animate-slide-up text-sol-muted max-w-xl text-lg mb-2"
            style={{ animationDelay: "200ms" }}
          >
            We&apos;ve generated a high-converting landing page, Product
            Hunt launch, and X/Twitter thread.
          </p>
        </section>

        {/* ——— Pipeline Steps ——— */}
        <div className="w-full max-w-lg mx-auto mb-8 animate-slide-up" style={{ animationDelay: "300ms" }}>
          <div className="flex items-center justify-between">
            {[
              { label: "Paste", step: "idle" as PipelineStep, icon: GitFork },
              { label: "Analyze", step: "analyzing" as PipelineStep, icon: Zap },
              { label: "Generate", step: "generating" as PipelineStep, icon: Rocket },
              { label: "Done", step: "done" as PipelineStep, icon: Check },
            ].map((s, i, arr) => {
              const stepOrder = ["idle", "analyzing", "analyzed", "generating", "done"];
              const currentIdx = stepOrder.indexOf(pipelineStep);
              const thisIdx = stepOrder.indexOf(s.step);
              const isActive = currentIdx >= thisIdx;
              const isCurrentStep = pipelineStep === s.step;

              return (
                <div key={s.label} className="flex items-center flex-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <div
                      className={`rounded-xl p-2.5 transition-all duration-500 ${isActive
                          ? "glass glow-green-intense"
                          : "glass"
                        } ${isCurrentStep ? "animate-ring-pulse" : ""}`}
                    >
                      <s.icon
                        size={16}
                        className={`transition-colors duration-300 ${isActive ? "text-sol-green" : "text-sol-muted"
                          }`}
                      />
                    </div>
                    <span
                      className={`text-[10px] font-medium transition-colors duration-300 ${isActive ? "text-sol-green" : "text-sol-muted"
                        }`}
                    >
                      {s.label}
                    </span>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="flex-1 mx-2 mb-5">
                      <div
                        className={`h-[2px] rounded transition-all duration-700 ${currentIdx > thisIdx
                            ? "connector-active"
                            : "bg-sol-border/30"
                          }`}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ——— Action Area ——— */}
        <div
          className="w-full max-w-3xl mx-auto space-y-4 animate-slide-up"
          style={{ animationDelay: "400ms" }}
        >
          <RepoInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            setIsLoading={handleLoadingChange}
            setError={handleErrorChange}
          />

          {error && (
            <div className="p-4 glass rounded-xl border-sol-error/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* ——— Results ——— */}
        {repoData && (
          <div className="mt-10 flex-1 flex flex-col pb-12">
            <RepoSummary data={repoData} />

            {/* Generation Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-10 flex-1">
              <GenerationPanel
                title="Landing Page"
                icon={
                  <MonitorSmartphone size={18} className="text-cyan-400" />
                }
                content={landingText}
                isGenerating={isGenerating}
                variant="landing"
              />
              <GenerationPanel
                title="Product Hunt"
                icon={
                  <Triangle size={18} className="text-[#ff6154]" />
                }
                content={productHuntText}
                isGenerating={isGenerating}
                variant="producthunt"
              />
              <GenerationPanel
                title="X/Twitter"
                icon={<Hash className="w-5 h-5 text-blue-400" />}
                content={xTwitterText}
                isGenerating={isGenerating}
                variant="x_twitter"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
