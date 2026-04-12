"use client";

import { Box, Code, GitBranch, BookOpen, Layers, FileCode } from "lucide-react";

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
  // Display only top dependencies
  const displayStack = data.techStack.slice(0, 10);
  const displayCommits = data.recentWork.slice(0, 3);
  const displayRoutes = data.routeTree.slice(0, 5);

  return (
    <div className="w-full max-w-4xl mx-auto mt-8 p-6 backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-violet-500/20 text-cyan-400 rounded-xl border border-cyan-500/20">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-50">{data.name}</h2>
            <p className="text-slate-400 text-sm line-clamp-1">{data.description || "No description provided"}</p>
          </div>
        </div>
        <div className="text-xs font-mono text-cyan-500 bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20 flex items-center space-x-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Analyzed</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tech Stack */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center space-x-2 mb-3 text-slate-300">
            <Layers size={16} />
            <span className="font-semibold text-sm">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {displayStack.length > 0 ? (
              displayStack.map((tech) => (
                <span key={tech} className="text-xs px-2 py-1 bg-slate-800 text-slate-300 rounded-md border border-slate-700">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">No dependencies found</span>
            )}
            {data.techStack.length > 10 && (
              <span className="text-xs px-2 py-1 text-slate-500">+{data.techStack.length - 10} more</span>
            )}
          </div>
        </div>

        {/* Structure */}
         <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
          <div className="flex items-center space-x-2 mb-3 text-slate-300">
            <FileCode size={16} />
            <span className="font-semibold text-sm">Structure</span>
          </div>
          <ul className="space-y-1.5 font-mono text-xs text-slate-400">
             {displayRoutes.length > 0 ? (
                displayRoutes.map((route, i) => (
                <li key={i} className="line-clamp-1 flex items-center">
                    <span className="mr-2 text-slate-600">├─</span> {route}
                </li>
              ))
             ): (
                 <li className="text-slate-500">No routes inferred</li>
             )}
              {data.routeTree.length > 5 && (
                <li className="text-slate-600 flex items-center">
                    <span className="mr-2">├─</span> ...{data.routeTree.length - 5} more files
                </li>
             )}
          </ul>
        </div>

        {/* Activity */}
        <div className="p-4 bg-slate-900/50 rounded-xl border border-white/5 hover:border-white/10 transition-colors md:col-span-2 lg:col-span-1">
          <div className="flex items-center space-x-2 mb-3 text-slate-300">
            <GitBranch size={16} />
            <span className="font-semibold text-sm">Recent Activity</span>
          </div>
           <ul className="space-y-2 text-xs">
            {displayCommits.length > 0 ? (
              displayCommits.map((msg, i) => (
                <li key={i} className="flex space-x-2 items-start text-slate-400">
                  <div className="min-w-1.5 min-h-1.5 w-1.5 h-1.5 rounded-full bg-cyan-500/50 mt-1" />
                  <span className="line-clamp-1">{msg}</span>
                </li>
              ))
            ) : (
               <li className="text-slate-500">No recent commits</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
