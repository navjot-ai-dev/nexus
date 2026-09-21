"use client";

import { motion } from "motion/react";
import Scene from "./Scene";
import WorkflowCard from "./WorkflowCard";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#fffdf9] px-6 pt-32">

      {/* Soft background */}
      <div className="pointer-events-none absolute inset-0">

        <div className="absolute -left-37.5 top-37.5 h-100 w-100 rounded-full bg-[#ffb69e]/15 blur-[120px]" />

        <div className="absolute -right-25 top-45 h-112.5 w-112.5 rounded-full bg-[#9be4da]/20 blur-[130px]" />

        <div className="absolute -bottom-37.5 left-[40%] h-100 w-125 rounded-full bg-[#f7c99f]/15 blur-[130px]" />
      </div>

      {/* tiny decorative dots */}
      <div className="absolute left-[15%] top-[20%] h-2 w-2 rounded-full bg-[#f5c2a9]" />
      <div className="absolute right-[12%] top-[32%] h-2 w-2 rounded-full bg-[#91dcd3]" />
      <div className="absolute left-[8%] top-[55%] h-1.5 w-1.5 rounded-full bg-[#f4b28f]" />

      {/* Main */}
      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-130px)] max-w-355 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">

        {/* LEFT */}
        <div className="relative z-30 pb-20 lg:pb-0">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#e9e2d9] bg-white/80 px-5 py-2.5 text-sm text-[#667085] shadow-sm backdrop-blur-xl"
          >
            <span className="h-2 w-2 rounded-full bg-[#ff6749]" />
            Visual automation for modern teams
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-190 text-[64px] font-bold leading-[0.94] tracking-tighter text-[#17202a] sm:text-[78px] lg:text-[92px] xl:text-[104px]"
          >
            Build workflows
            <br />

            <span className="bg-linear-to-r from-[#ff6246] via-[#f49d68] to-[#43bcae] bg-clip-text text-transparent">
              that think.
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mt-8 max-w-152.5 text-[17px] leading-8 text-[#667085]"
          >
            Design powerful AI workflows visually. Connect services,
            automate complex processes, and watch every execution
            happen in real time.
          </motion.p>

          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <button className="rounded-2xl bg-[#ff6749] px-7 py-4 font-semibold text-white shadow-[0_15px_35px_rgba(255,103,73,0.25)] transition hover:-translate-y-1 hover:bg-[#f4573a]">
              Start building
              <span className="ml-3">→</span>
            </button>

            <button className="flex items-center gap-3 rounded-2xl border border-[#ded8cf] bg-white/80 px-7 py-4 font-semibold text-[#17202a] shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#17202a] text-[9px] text-white">
                ▶
              </span>

              Explore workflows
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-12 flex flex-wrap gap-7"
          >
            <Stat icon="⚡" value="10x" label="Faster workflows" />

            <Stat icon="✦" value="AI" label="Powered automation" />

            <Stat icon="◈" value="Secure" label="Your data stays yours" />
          </motion.div>
        </div>

        {/* RIGHT / 3D */}
        <div className="relative h-150 lg:h-170">

          {/* 3D */}
          <div className="absolute inset-0">
            <Scene />
          </div>

          {/* Webhook */}
          <WorkflowCard
            icon="ϟ"
            title="Webhook"
            description="Receive data"
            className="left-[4%] top-[10%]"
          />

          {/* AI */}
          <WorkflowCard
            icon="✦"
            title="AI Processor"
            description="Analyze & generate"
            className="right-[2%] top-[28%]"
          />

          {/* Database */}
          <WorkflowCard
            icon="◉"
            title="Database"
            description="Store results"
            className="bottom-[15%] right-[4%]"
          />

          {/* Connecting labels */}
          <div className="absolute right-[10%] top-[3%] hidden text-sm italic text-[#98a2b3] xl:block">
            Drag → Connect → Automate
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 7, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-7 left-1/2 z-30 -translate-x-1/2 text-center"
      >
        <div className="text-xs text-[#98a2b3]">
          Scroll to explore
        </div>

        <div className="mx-auto mt-3 h-8 w-px bg-[#c9c2b8]" />
      </motion.div>
    </section>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e9e2d9] bg-white text-[#ff6749] shadow-sm">
        {icon}
      </div>

      <div>
        <div className="text-sm font-bold text-[#17202a]">
          {value}
        </div>

        <div className="text-[10px] text-[#98a2b3]">
          {label}
        </div>
      </div>
    </div>
  );
}