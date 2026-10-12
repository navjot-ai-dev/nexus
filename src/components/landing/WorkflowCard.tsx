"use client";

import { motion } from "motion/react";

type Props = {
  icon: string;
  title: string;
  description: string;
  className?: string;
};

export default function WorkflowCard({
  icon,
  title,
  description,
  className = "",
}: Props) {
  return (
    <motion.div
      animate={{
        y: [0, -8, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`absolute z-20 w-52 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-base shadow-2xs">
          {icon}
        </div>

        <div>
          <h3 className="text-xs font-bold text-slate-900 tracking-tight">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
        />
      </div>
    </motion.div>
  );
}