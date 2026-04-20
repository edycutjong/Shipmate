"use client";

import React, { useRef, useCallback, useState } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { CopyButton } from "./CopyButton";
import { ExportButton } from "./ExportButton";
import { motion, AnimatePresence } from "framer-motion";
import { Maximize2, Minimize2 } from "lucide-react";

interface GenerationPanelProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  isGenerating: boolean;
  variant: "landing" | "twitter" | "producthunt";
}

const VARIANT_ACCENTS = {
  landing: {
    border: "border-cyan-500/40",
    shadow: "shadow-[0_0_30px_rgba(6,182,212,0.12)]",
    glow: "bg-cyan-500/5",
    gradient: "from-cyan-500/20 to-transparent",
    tag: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  producthunt: {
    border: "border-orange-500/40",
    shadow: "shadow-[0_0_30px_rgba(255,97,84,0.12)]",
    glow: "bg-orange-500/5",
    gradient: "from-orange-500/20 to-transparent",
    tag: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  twitter: {
    border: "border-blue-500/40",
    shadow: "shadow-[0_0_30px_rgba(29,161,242,0.12)]",
    glow: "bg-blue-500/5",
    gradient: "from-blue-500/20 to-transparent",
    tag: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
};

const VARIANT_LABELS = {
  landing: "HTML",
  producthunt: "COPY",
  twitter: "THREAD",
};

export function GenerationPanel({
  title,
  icon,
  content,
  isGenerating,
  variant,
}: GenerationPanelProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const accent = VARIANT_ACCENTS[variant];
  const [expanded, setExpanded] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    /* istanbul ignore next */
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty(
      "--mouse-x",
      `${e.clientX - rect.left}px`
    );
    cardRef.current.style.setProperty(
      "--mouse-y",
      `${e.clientY - rect.top}px`
    );
  }, []);

  // Twitter thread renderer
  const renderTwitter = () => {
    const tweets = content
      .split(/(?:^|\n\n)(?=\d+\. |🧵|I just built)/i)
      .filter((t) => t.trim().length > 0);

    return (
      <div className="flex flex-col space-y-4 text-left">
        {tweets.map((tweet, i) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={i}
            className="p-4 bg-sol-dark/80 rounded-xl border border-sol-border/40 shadow-sm relative card-hover"
          >
            {/* Thread line */}
            {i !== tweets.length - 1 && (
              <div className="absolute left-6 -bottom-4 w-[2px] h-4 bg-sol-border/40" />
            )}
            <div className="flex items-start space-x-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-linear-to-br from-cyan-500/30 to-violet-500/30 shrink-0 border border-sol-border/30" />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-slate-200">
                    Maker
                  </span>
                  <span className="text-xs text-sol-muted">@shipmate</span>
                </div>
              </div>
            </div>
            <div className="pl-11 text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{tweet}</ReactMarkdown>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  // Landing page renders HTML natively
  const renderLanding = () => (
    <div className="text-left text-sm text-slate-300 leading-relaxed overflow-auto scrollbar-none">
      <div className="prose prose-invert prose-cyan max-w-none prose-sm prose-headings:text-slate-200 prose-a:text-cyan-400 prose-strong:text-slate-200 prose-code:bg-sol-dark prose-code:text-cyan-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-pre:bg-sol-dark/80 prose-pre:border prose-pre:border-sol-border/20 prose-img:rounded-lg prose-img:border prose-img:border-sol-border/20">
        <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
      </div>
    </div>
  );

  // Product Hunt renderer with styled sections
  const renderProductHunt = () => (
    <div className="text-left text-sm text-slate-300 leading-relaxed overflow-auto scrollbar-none">
      <div className="prose prose-invert max-w-none prose-sm prose-headings:text-slate-200 prose-p:text-slate-300 prose-strong:text-orange-300 prose-a:text-orange-400 prose-li:text-slate-300">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );

  const renderContent = () => {
    if (variant === "twitter") return renderTwitter();
    if (variant === "landing") return renderLanding();
    return renderProductHunt();
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card shine-effect glass rounded-2xl flex flex-col transition-all duration-500 overflow-hidden card-hover ${
        expanded ? "fixed inset-4 z-50" : "h-full"
      } ${
        isGenerating
          ? `${accent.border} ${accent.shadow}`
          : "border border-sol-border/30"
      }`}
    >
      {/* Ambient gradient glow at top */}
      {content && (
        <div className={`absolute top-0 left-0 right-0 h-32 bg-linear-to-b ${accent.gradient} pointer-events-none opacity-60`} />
      )}

      {/* Header */}
      <div className="px-5 py-4 border-b border-sol-border/20 flex items-center justify-between bg-sol-dark/40 relative z-10">
        <div className="flex items-center space-x-3">
          <div
            className={`p-2 rounded-lg border border-sol-border/20 ${accent.glow}`}
          >
            {icon}
          </div>
          <h3 className="font-semibold text-slate-200">{title}</h3>
          {content && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${accent.tag}`}>
              {VARIANT_LABELS[variant]}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {!isGenerating && content && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center space-x-2"
            >
              <CopyButton content={content} />
              <ExportButton content={content} filename={`${variant}.md`} />
            </motion.div>
          )}
          {content && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg border border-sol-border/20 text-sol-muted hover:text-slate-200 hover:border-sol-border/40 transition-colors"
              title={expanded ? "Minimize" : "Expand"}
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className={`p-5 flex-1 relative overflow-auto scrollbar-none ${expanded ? "" : "max-h-[500px]"}`}>
        {content ? (
          renderContent()
        ) : (
          <div className="flex h-[200px] flex-col justify-center items-center text-sol-muted/40">
            <div className="mb-4 animate-float">{icon}</div>
            <span className="text-sm font-medium">Awaiting input...</span>
          </div>
        )}

        {/* Streaming Cursor Indicator */}
        <AnimatePresence>
          {isGenerating && content && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="mt-4 flex items-center space-x-2 text-xs font-medium"
            >
              <div className="flex space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-sol-green animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-sol-green">Streaming...</span>
              <span className="w-[2px] h-4 bg-sol-green animate-blink" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom fade overlay when not expanded */}
      {content && !expanded && (
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-16 bg-linear-to-t from-sol-dark/90 to-transparent" />
      )}

      {/* Expanded backdrop */}
      {expanded && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm -z-10"
          onClick={() => setExpanded(false)}
        />
      )}
    </div>
  );
}
