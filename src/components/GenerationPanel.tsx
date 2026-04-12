import React from "react";
import ReactMarkdown from "react-markdown";
import { CopyButton } from "./CopyButton";
import { ExportButton } from "./ExportButton";
import { motion, AnimatePresence } from "framer-motion";

interface GenerationPanelProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  isGenerating: boolean;
  variant: "landing" | "twitter" | "producthunt";
}

export function GenerationPanel({
  title,
  icon,
  content,
  isGenerating,
  variant,
}: GenerationPanelProps) {
  // If it's a Twitter thread, let's try to split it into simulated tweet cards
  const renderTwitter = () => {
    // Basic heuristic: split by numbered list or double newlines that look like separate tweets
    const tweets = content
      .split(/(?:^|\n\n)(?=\d+\. |🧵|I just built)/i)
      .filter((t) => t.trim().length > 0);

    return (
      <div className="flex flex-col space-y-4 text-left">
        {tweets.map((tweet, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={i}
            className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 shadow-sm relative"
          >
            {/* Thread line connecting vertical tweets */}
            {i !== tweets.length - 1 && (
              <div className="absolute left-6 -bottom-4 w-[2px] h-4 bg-slate-700/50" />
            )}
            <div className="flex items-start space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-200">Maker</span>
                  <span className="text-xs text-slate-500">@shipmate</span>
                </div>
              </div>
            </div>
            <div className="pl-11 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              <div className="prose prose-invert prose-sm">
                <ReactMarkdown>
                  {tweet}
                </ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Regular markdown render for landing and Product Hunt (could refine PH look later)
  const renderDefault = () => (
    <div className="text-left text-sm text-slate-300 leading-relaxed overflow-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700">
      <div className="prose prose-invert prose-cyan max-w-none">
        <ReactMarkdown>
          {content || "Waiting for stream..."}
        </ReactMarkdown>
      </div>
    </div>
  );

  return (
    <div
      className={`backdrop-blur-xl bg-white/5 border rounded-2xl flex flex-col h-full transition-all duration-300 overflow-hidden ${
        isGenerating
          ? "border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
          : "border-white/10"
      }`}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-slate-800/50">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white/5 rounded-lg border border-white/5">
            {icon}
          </div>
          <h3 className="font-semibold text-slate-200">{title}</h3>
        </div>
        {!isGenerating && content && (
          <div className="flex items-center space-x-2">
            <CopyButton content={content} />
            <ExportButton content={content} filename={`${variant}.md`} />
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 relative">
        {content ? (
          variant === "twitter" ? renderTwitter() : renderDefault()
        ) : (
          <div className="flex h-[200px] flex-col justify-center items-center text-slate-500 opacity-50">
            <div className="mb-4">{icon}</div>
            <span className="text-sm font-medium">Awaiting input...</span>
          </div>
        )}

        {/* Streaming Cursor Indicator */}
        <AnimatePresence>
          {isGenerating && content && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-center space-x-2 text-xs text-cyan-400 font-medium"
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Generating...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
