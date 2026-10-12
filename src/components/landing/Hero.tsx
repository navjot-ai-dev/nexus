"use client";

import { motion } from "motion/react";
import Scene from "./Scene";
import WorkflowCard from "./WorkflowCard";
import StartBuildingButton from "./StartBuildingButton";
import Link from "next/link";
import { Zap, Sparkles, Shield, Compass } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fffdf9] px-6 pt-32">
      {/* Soft background ambient glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-36 top-36 h-96 w-96 rounded-full bg-[#ffb69e]/15 blur-[120px]" />
        <div className="absolute -right-24 top-44 h-112 w-112 rounded-full bg-[#9be4da]/20 blur-[130px]" />
        <div className="absolute -bottom-36 left-[40%] h-96 w-120 rounded-full bg-[#f7c99f]/15 blur-[130px]" />
      </div>

      {/* Decorative dots */}
      <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-[#f5c2a9]" />
      <div className="absolute right-[12%] top-[32%] h-2 w-2 rounded-full bg-[#91dcd3]" />
      <div className="absolute left-[8%] top-[55%] h-1.5 w-1.5 rounded-full bg-[#f4b28f]" />

      {/* Main Container */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-7xl items-center gap-10 lg:grid-cols-[1fr_1fr]">
        {/* LEFT Hero Content */}
        <div className="relative z-30 pb-16 lg:pb-0">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#e9e2d9] bg-white/80 px-4 py-2 text-xs font-semibold text-[#667085] shadow-xs backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-[#ff6749]" />
            Next-Generation Workflow Automation
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl font-black leading-[0.95] tracking-tight text-[#17202a] sm:text-7xl lg:text-8xl"
          >
            Build powerful workflows.
            <br />
            <span className="bg-gradient-to-r from-[#ff6246] via-[#f49d68] to-[#2a9d8f] bg-clip-text text-transparent">
              Visually.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-7 max-w-xl text-base leading-relaxed text-[#667085] sm:text-lg"
          >
            NEXUS connects your webhooks, AI models, APIs, and databases into seamless,
            resilient automation pipelines with real-time topological execution and live telemetry.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <StartBuildingButton />

            <Link href="/workflows">
              <button className="flex items-center gap-2.5 rounded-xl border border-[#ded8cf] bg-white/90 px-6 py-3.5 text-sm font-bold text-[#17202a] shadow-xs backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:border-[#ff6749]">
                <Compass className="h-4 w-4 text-[#ff6749]" />
                Explore Workflows
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
        <div className="relative h-[480px] lg:h-[580px]">
          {/* 3D Scene */}
          <div className="absolute inset-0">
            <Scene />
          </div>

          {/* Floating Flow Nodes */}
          <WorkflowCard
            icon="⚡"
            title="Webhook"
            description="Incoming payload"
            className="left-[6%] top-[12%]"
          />

          <WorkflowCard
            icon="✦"
            title="AI Processor"
            description="Reasoning & extraction"
            className="right-[4%] top-[30%]"
          />

          <WorkflowCard
            icon="◉"
            title="Database"
            description="Storage & sync"
            className="bottom-[18%] right-[8%]"
          />

          {/* Canvas Tag */}
          <div className="absolute right-[12%] top-[6%] hidden text-xs font-mono font-semibold tracking-wider text-[#8a94a6] xl:block">
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
      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2d9] bg-white text-[#ff6749] shadow-xs">
        {icon}
      </div>
      <div>
        <div className="text-xs font-bold text-[#17202a]">{title}</div>
        <div className="text-[10px] text-[#8a94a6]">{subtitle}</div>
      </div>
    </div>
  );
}