"use client";

import { motion } from "motion/react";
import Scene from "./Scene";
import WorkflowCard from "./WorkflowCard";
import StartBuildingButton from "./StartBuildingButton";
import Link from "next/link";
import { Zap, Sparkles, Shield, Compass, ChevronRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero-section relative min-h-screen overflow-hidden bg-[#f8fafc] px-6 pt-32 selection:bg-slate-900 selection:text-white">
      {/* Delicate background ambient glows and engineering grid */}
      <div className="hero-ambient-glows pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-36 top-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[130px]" />
        <div className="absolute -right-24 top-36 h-112 w-112 rounded-full bg-sky-500/10 blur-[140px]" />
        <div className="absolute -bottom-36 left-[35%] h-96 w-120 rounded-full bg-emerald-500/8 blur-[140px]" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1fr]">
        {/* LEFT Hero Content */}
        <div className="hero-content relative z-30 pb-16 lg:pb-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-slate-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs backdrop-blur-xl"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>Next-Generation Workflow Automation</span>
            <ChevronRight className="h-3 w-3 text-slate-400" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-black leading-[0.98] tracking-tight text-slate-950 sm:text-6xl lg:text-7xl"
          >
            Build powerful workflows.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-sky-500 bg-clip-text text-transparent">
              Visually.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg"
          >
            NEXUS connects your webhooks, AI models, APIs, and databases into resilient
            automation pipelines with real-time topological execution and live telemetry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3.5"
          >
            <StartBuildingButton />

            <Link href="/workflows">
              <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-900 shadow-2xs backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-slate-50 hover:border-slate-300">
                <Compass className="h-4 w-4 text-indigo-600" />
                <span>Explore Workflows</span>
              </button>
            </Link>
          </motion.div>

          {/* Stats / Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex flex-wrap items-center gap-6"
          >
            <StatItem icon={<Zap className="h-4 w-4" />} title="Sub-100ms" subtitle="Execution Engine" />
            <StatItem icon={<Sparkles className="h-4 w-4" />} title="AI Native" subtitle="Gemini, OpenAI, Claude" />
            <StatItem icon={<Shield className="h-4 w-4" />} title="Zero Leak" subtitle="Sandboxed & SSRF Guarded" />
          </motion.div>
        </div>

        {/* RIGHT Interactive 3D / Floating Nodes Canvas */}
        <div className="hero-3d-scene relative h-[480px] lg:h-[580px]">
          {/* 3D Scene */}
          <div className="hero-scene-canvas absolute inset-0">
            <Scene />
          </div>

          {/* Floating Flow Nodes with Classic Glass Styling */}
          <WorkflowCard
            icon="⚡"
            title="Webhook"
            description="Incoming payload"
            className="hero-floating-card-1 left-[6%] top-[12%]"
          />

          <WorkflowCard
            icon="✦"
            title="AI Processor"
            description="Reasoning & extraction"
            className="hero-floating-card-2 right-[4%] top-[30%]"
          />

          <WorkflowCard
            icon="◉"
            title="Database"
            description="Storage & sync"
            className="hero-floating-card-3 bottom-[18%] right-[8%]"
          />

          {/* Canvas Tag */}
          <div className="absolute right-[12%] top-[6%] hidden text-xs font-mono font-semibold tracking-wider text-slate-400 xl:block">
            Webhook → AI → Database
          </div>
        </div>
      </div>
    </section>
  );
}

function StatItem({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-indigo-600 shadow-2xs">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-slate-900">{title}</div>
        <div className="text-[10px] text-slate-500 font-medium">{subtitle}</div>
      </div>
    </div>
  );
}