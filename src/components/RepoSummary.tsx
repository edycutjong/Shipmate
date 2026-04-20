"use client";

import { useRef, useCallback, useState } from "react";
import { GitBranch, BookOpen, Layers, FileCode } from "lucide-react";

interface RepoSummaryProps {
  data: {
    name: string;
    description: string;
    techStack: string[];
    features: string[];
    recentWork: string[];
    readmeExcerpt: string;
    routeTree: string[];
  };
}

export function RepoSummary({ data }: RepoSummaryProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isTechExpanded, setIsTechExpanded] = useState(false);
  const [isStructureExpanded, setIsStructureExpanded] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    /* istanbul ignore next */
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
    cardRef.current.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
  }, []);

  // Display only top dependencies
  const displayStack = isTechExpanded ? data.techStack : data.techStack.slice(0, 10);
  const displayCommits = data.recentWork.slice(0, 3);
  const displayRoutes = isStructureExpanded ? data.routeTree : data.routeTree.slice(0, 5);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="card-3d w-full max-w-4xl mx-auto animate-slide-up"
    >
      <div className="card-3d-inner glass rounded-2xl p-6 shine-effect spotlight-card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-linear-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 rounded-xl border border-cyan-500/20">
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">{data.name}</h2>
              <p className="text-sol-muted text-sm line-clamp-1">
                {data.description || "No description provided"}
              </p>
            </div>
          </div>
          <div className="text-xs font-mono text-sol-green bg-sol-green/10 px-3 py-1.5 rounded-full border border-sol-green/20 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-sol-green glow-dot animate-pulse" />
            <span>Analyzed</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {/* Tech Stack */}
          <div className="p-4 bg-sol-dark/60 rounded-xl border border-sol-border/30 hover:border-sol-border/60 transition-colors card-hover">
            <div className="flex items-center space-x-2 mb-3 text-slate-300">
              <Layers size={16} />
              <span className="font-semibold text-sm">Tech Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayStack.length > 0 ? (
                displayStack.map((tech) => (
                  <span
                    key={tech}
                    className="text-xs px-2.5 py-1 bg-sol-card text-slate-300 rounded-md border border-sol-border/50 hover:border-sol-green/30 transition-colors"
                  >
                    {tech}
                  </span>
                ))
              ) : (
                <span className="text-xs text-sol-muted">
                  No dependencies found
                </span>
              )}
              {data.techStack.length > 10 && !isTechExpanded && (
                <button
                  type="button"
                  onClick={() => setIsTechExpanded(true)}
                  className="text-xs px-2 py-1 text-sol-muted hover:text-sol-green transition-colors cursor-pointer rounded-md border border-transparent border-dashed hover:border-sol-green/30"
                >
                  +{data.techStack.length - 10} more
                </button>
              )}
              {isTechExpanded && data.techStack.length > 10 && (
                <button
                  type="button"
                  onClick={() => setIsTechExpanded(false)}
                  className="text-xs px-2 py-1 text-sol-green/80 hover:text-sol-green transition-colors cursor-pointer rounded-md border border-transparent border-dashed hover:border-sol-green/30"
                >
                  Show less
                </button>
              )}
            </div>
          </div>

          {/* Structure */}
          <div className="p-4 bg-sol-dark/60 rounded-xl border border-sol-border/30 hover:border-sol-border/60 transition-colors card-hover">
            <div className="flex items-center space-x-2 mb-3 text-slate-300">
              <FileCode size={16} />
              <span className="font-semibold text-sm">Structure</span>
            </div>
            <ul className="space-y-1.5 font-mono text-xs text-sol-muted">
              {displayRoutes.length > 0 ? (
                displayRoutes.map((route, i) => (
                  <li key={i} className="line-clamp-1 flex items-center">
                    <span className="mr-2 text-sol-border">├─</span>
                    <span className="text-sol-green/70">{route}</span>
                  </li>
                ))
              ) : (
                <li className="text-sol-muted">No routes inferred</li>
              )}
              {data.routeTree.length > 5 && !isStructureExpanded && (
                <li 
                  className="text-sol-muted flex items-center cursor-pointer hover:text-sol-green transition-colors w-fit"
                  onClick={() => setIsStructureExpanded(true)}
                >
                  <span className="mr-2 text-sol-border">├─</span>
                  +{data.routeTree.length - 5} more files
                </li>
              )}
              {isStructureExpanded && data.routeTree.length > 5 && (
                <li 
                  className="text-sol-green/80 flex items-center cursor-pointer hover:text-sol-green transition-colors pt-1 w-fit"
                  onClick={() => setIsStructureExpanded(false)}
                >
                  <span className="mr-2 text-sol-border">└─</span>
                  Show less
                </li>
              )}
            </ul>
          </div>

          {/* Activity */}
          <div className="p-4 bg-sol-dark/60 rounded-xl border border-sol-border/30 hover:border-sol-border/60 transition-colors md:col-span-2 lg:col-span-1 card-hover">
            <div className="flex items-center space-x-2 mb-3 text-slate-300">
              <GitBranch size={16} />
              <span className="font-semibold text-sm">Recent Activity</span>
            </div>
            <ul className="space-y-2 text-xs">
              {displayCommits.length > 0 ? (
                displayCommits.map((msg, i) => (
                  <li
                    key={i}
                    className="flex space-x-2 items-start text-sol-muted"
                  >
                    <div className="min-w-1.5 min-h-1.5 w-1.5 h-1.5 rounded-full bg-sol-green/50 mt-1.5 glow-dot" />
                    <span className="line-clamp-1">{msg}</span>
                  </li>
                ))
              ) : (
                <li className="text-sol-muted">No recent commits</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
