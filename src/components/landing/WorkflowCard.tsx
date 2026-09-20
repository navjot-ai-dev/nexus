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
      className={`absolute z-20 w-[190px] rounded-2xl border border-white/80 bg-white/85 p-4 shadow-[0_20px_50px_rgba(31,41,55,0.12)] backdrop-blur-xl ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1eb] text-lg">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-[#17202A]">
            {title}
          </h3>

          <p className="mt-0.5 text-[11px] text-[#98A2B3]">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-3 h-1 overflow-hidden rounded-full bg-[#f2eee8]">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "linear",
          }}
          className="h-full w-1/2 rounded-full bg-[#ff8b6a]"
        />
      </div>
    </motion.div>
  );
}