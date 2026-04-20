"use client";

import Link from "next/link";
import {
  Rocket,
  MonitorSmartphone,
  Hash,
  Triangle,
  ArrowRight,
  Zap,
  GitBranch,
  Sparkles,
  GitFork,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";

const PIPELINE_STEPS = [
  { icon: GitFork, label: "Paste URL", color: "text-slate-300" },
  { icon: Zap, label: "AI Analyze", color: "text-cyan-400" },
  { icon: Sparkles, label: "Generate", color: "text-violet-400" },
  { icon: Rocket, label: "Launch", color: "text-emerald-400" },
];

const FEATURES = [
  {
    icon: MonitorSmartphone,
    title: "Landing Page",
    description:
      "Generates hero headline, feature blocks, and CTA based on your actual tech stack and recent commits.",
    color: "from-cyan-500/20 to-cyan-500/5",
    borderColor: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Triangle,
    title: "Product Hunt",
    description:
      "Follows the proven maker launch format — problem → solution → ask — that gets upvotes.",
    color: "from-orange-500/20 to-orange-500/5",
    borderColor: "border-orange-500/20",
    iconColor: "text-[#ff6154]",
  },
  {
    icon: Hash,
    title: "Twitter Thread",
    description:
      "Generates a 5-part technical build narrative from your GitHub commit history.",
    color: "from-blue-500/20 to-blue-500/5",
    borderColor: "border-blue-500/20",
    iconColor: "text-[#1da1f2]",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* ——— Ambient Background ——— */}
      <div className="hero-mesh" />
      <div className="animated-grid" />

      {/* Floating orbs */}
      <div
        className="orb orb-green"
        style={{ width: 500, height: 500, top: "-10%", left: "-5%" }}
      />
      <div
        className="orb orb-purple"
        style={{ width: 400, height: 400, top: "20%", right: "-8%" }}
      />
      <div
        className="orb orb-green"
        style={{ width: 300, height: 300, bottom: "5%", left: "30%" }}
      />

      {/* Particles */}
      <div className="particles">
        {Array.from({ length: 18 }).map((_, i) => (
          <div key={i} className="particle" />
        ))}
      </div>

      {/* ——— Navigation ——— */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="group flex items-center gap-3 cursor-default">
          <div className="logo-container">
            <div className="logo-glow" />
            <div className="logo-icon">
              <Rocket size={18} className="text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">Shipmate</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/edycutjong/shipmate"
            target="_blank"
            rel="noopener noreferrer"
            className="github-cta"
          >
            <SiGithub size={16} />
            <span className="hidden sm:inline">Source</span>
          </a>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-cyan-500 to-violet-500 text-white text-sm font-semibold shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all duration-300 hover:-translate-y-0.5"
          >
            Launch App
            <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ——— Hero Section ——— */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Badge */}
        <div
          className="animated-badge-border badge-glow inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 animate-slide-up"
          style={{ animationDelay: "0ms" }}
        >
          <Zap size={14} className="text-sol-green" />
          <span className="text-xs font-semibold tracking-wider text-slate-300 uppercase">
            From code to launch in 30 seconds
          </span>
        </div>

        {/* Title */}
        <h1
          className="animate-headline text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.9] mb-6"
          style={{ animationDelay: "100ms" }}
        >
          <span className="gradient-text-shimmer">Ship Your</span>
          <br />
          <span className="text-foreground">Launch Story</span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-slide-up text-lg md:text-xl text-sol-muted max-w-2xl leading-relaxed mb-10"
          style={{ animationDelay: "300ms" }}
        >
          Paste your GitHub repo → get a landing page, Product Hunt comment, and
          viral Twitter thread.{" "}
          <span className="text-foreground font-medium">
            AI reads your code, not your mind.
          </span>
        </p>

        {/* CTA */}
        <div
          className="animate-slide-up flex flex-col sm:flex-row items-center gap-4"
          style={{ animationDelay: "500ms" }}
        >
          <Link
            href="/dashboard"
            className="cta-magnetic inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 text-white text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            <Rocket size={20} />
            Try Shipmate Free
          </Link>
          <a
            href="https://github.com/edycutjong/shipmate"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl text-sol-muted hover:text-foreground transition-colors text-sm font-medium"
          >
            <SiGithub size={18} />
            View on GitHub
          </a>
        </div>

        {/* ——— Pipeline ——— */}
        <div
          className="animate-slide-up mt-20 w-full max-w-2xl"
          style={{ animationDelay: "700ms" }}
        >
          <div className="flex items-center justify-between">
            {PIPELINE_STEPS.map((step, i) => (
              <div key={step.label} className="flex items-center flex-1">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`glass rounded-2xl p-4 ${i === PIPELINE_STEPS.length - 1 ? "glow-green-intense" : ""}`}
                  >
                    <step.icon size={22} className={step.color} />
                  </div>
                  <span className="text-xs text-sol-muted font-medium">
                    {step.label}
                  </span>
                </div>
                {i < PIPELINE_STEPS.length - 1 && (
                  <div className="flex-1 mx-2 mb-6">
                    <div className="connector-active" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Features Section ——— */}
      <section className="relative z-10 section-divider px-6 md:px-12 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2
              className="animate-slide-up text-3xl md:text-4xl font-bold tracking-tight mb-4"
            >
              Three assets.{" "}
              <span className="gradient-text">One click.</span>
            </h2>
            <p className="animate-slide-up text-sol-muted max-w-lg mx-auto" style={{ animationDelay: "100ms" }}>
              Every panel streams simultaneously via SSE — no loading spinners,
              full visual spectacle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
            {FEATURES.map((feat) => (
              <div
                key={feat.title}
                className="card-3d animate-slide-up"
              >
                <div className="card-3d-inner glass rounded-2xl p-8 h-full shine-effect spotlight-card card-hover">
                  <div
                    className={`inline-flex p-3 rounded-xl bg-linear-to-br ${feat.color} border ${feat.borderColor} mb-5`}
                  >
                    <feat.icon size={24} className={feat.iconColor} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feat.title}</h3>
                  <p className="text-sol-muted text-sm leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— How It Works ——— */}
      <section className="relative z-10 section-divider px-6 md:px-12 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="animate-slide-up text-3xl md:text-4xl font-bold tracking-tight mb-12">
            Powered by{" "}
            <span className="gradient-text">your codebase</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              {
                icon: GitBranch,
                title: "Read Code",
                desc: "Pulls README, commits, routes, and package.json via GitHub API.",
              },
              {
                icon: Zap,
                title: "AI Context",
                desc: "GPT-4o receives your full repo context — stack, features, story.",
              },
              {
                icon: Sparkles,
                title: "Stream Live",
                desc: "Three panels stream simultaneously via Server-Sent Events.",
              },
            ].map((item, i) => (
              <div
                key={item.title}
                className="animate-slide-up glass rounded-2xl p-8 card-hover"
                style={{ animationDelay: `${i * 120}ms` }}
              >
                <div className="inline-flex p-3 rounded-xl bg-sol-green/10 border border-sol-green/20 mb-4">
                  <item.icon size={22} className="text-sol-green" />
                </div>
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sol-muted text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ——— Bottom CTA ——— */}
      <section className="relative z-10 section-divider px-6 md:px-12 py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Stop writing.{" "}
            <span className="gradient-text-shimmer">Start shipping.</span>
          </h2>
          <p className="text-sol-muted mb-10 text-lg">
            Your next launch is 30 seconds away.
          </p>
          <Link
            href="/dashboard"
            className="cta-magnetic inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-linear-to-r from-cyan-500 to-violet-500 text-white text-lg font-bold shadow-[0_0_30px_rgba(6,182,212,0.3)]"
          >
            <Rocket size={22} />
            Launch Shipmate
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ——— Footer ——— */}
      <footer className="relative z-10 border-t border-sol-border/30 px-6 md:px-12 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sol-muted">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-linear-to-br from-cyan-500 to-violet-500 flex items-center justify-center">
              <Rocket size={12} className="text-white" />
            </div>
            <span className="font-semibold text-foreground">Shipmate</span>
            <span>© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            <span>
              Built with Next.js 16 · React 19 · GPT-4o
            </span>
            <a
              href="https://github.com/edycutjong/shipmate"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
