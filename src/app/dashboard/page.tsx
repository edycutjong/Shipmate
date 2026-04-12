"use client";

import { useState } from "react";
import { RepoInput } from "@/components/RepoInput";
import { RepoSummary } from "@/components/RepoSummary";
import { GenerationPanel } from "@/components/GenerationPanel";
import { Rocket, MonitorSmartphone, Hash, Triangle } from "lucide-react";

export default function DashboardPage() {
  const [repoData, setRepoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [landingText, setLandingText] = useState("");
  const [twitterText, setTwitterText] = useState("");
  const [productHuntText, setProductHuntText] = useState("");

  const handleAnalyze = async (data: any) => {
    setRepoData(data);
    // Reset generation state
    setLandingText("");
    setTwitterText("");
    setProductHuntText("");
    setIsGenerating(true);

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
                } else if (parsed.type === "twitter") {
                  setTwitterText((prev) => prev + parsed.content);
                } else if (parsed.type === "done") {
                  setIsGenerating(false);
                }
              } catch (e) {
                // Ignore parse errors from partial JSON if any
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e);
      setError("Failed to generate content.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-50 selection:bg-cyan-500/30 font-sans p-6 md:p-12 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-violet-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 flex flex-col min-h-[calc(100vh-6rem)]">
        {/* Header */}
        <header className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-6">
            <Rocket size={14} className="text-cyan-400" />
            <span className="text-xs font-semibold tracking-wide text-slate-300">
              SHIPMATE MVP
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">
            Automated Marketing Engine
          </h1>
          <p className="text-slate-400 max-w-xl text-lg">
            Paste your GitHub repository URL. We analyze the codebase and generate your Landing Page, Product Hunt launch, and Twitter thread.
          </p>
        </header>

        {/* Action Area */}
        <div className="w-full max-w-3xl mx-auto space-y-6">
          <RepoInput
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            setError={setError}
          />

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
        </div>

        {/* Results Area */}
        {repoData && (
          <div className="mt-8 flex-1 flex flex-col">
            <RepoSummary data={repoData} />

            {/* Generation Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-12 flex-1">
              <GenerationPanel
                title="Landing Page"
                icon={<MonitorSmartphone size={18} className="text-cyan-400" />}
                content={landingText}
                isGenerating={isGenerating}
                variant="landing"
              />
              <GenerationPanel
                title="Product Hunt"
                icon={<Triangle size={18} className="text-[#ff6154]" />}
                content={productHuntText}
                isGenerating={isGenerating}
                variant="producthunt"
              />
              <GenerationPanel
                title="Twitter Thread"
                icon={<Hash size={18} className="text-[#1da1f2]" />}
                content={twitterText}
                isGenerating={isGenerating}
                variant="twitter"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
