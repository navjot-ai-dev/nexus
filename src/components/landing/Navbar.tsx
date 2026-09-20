"use client";

import { motion } from "motion/react";
import Link from "next/link";

const links = [
  {
    label: "Product",
    href: "/product",
  },
  {
    label: "Workflows",
    href: "/workflows",
  },
  {
    label: "Features",
    href: "/features",
  },
  {
    label: "Docs",
    href: "/docs",
  },
];

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="fixed left-0 right-0 top-0 z-50 px-5 pt-5"
    >
      <nav className="mx-auto flex h-18 max-w-355 items-center justify-between rounded-[22px] border border-[#e9e2d9] bg-[#fffdf9]/90 px-6 shadow-[0_12px_45px_rgba(30,41,59,0.07)] backdrop-blur-2xl">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#17202a] shadow-lg">
            <div className="h-4 w-4 rounded-full bg-[#ff6749]" />

            <div className="absolute h-7 w-7 rounded-full border border-white/20" />
          </div>

          <div>
            <div className="text-[20px] font-bold tracking-[-0.04em] text-[#17202a]">
              NEXUS
            </div>

            <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9aa3b2]">
              Workflow OS
            </div>
          </div>
        </Link>

        {/* Center navigation */}
        <div className="hidden items-center gap-1 rounded-[18px] border border-[#e9e2d9] bg-white/70 p-1.5 md:flex">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="rounded-xl px-5 py-2.5 text-sm text-[#667085] transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <Link
            href="/sign-in"
            className="hidden text-sm font-medium text-[#667085] hover:text-[#17202a] sm:block"
          >
            Sign in
          </Link>

          <Link
            href="/sign-up"
            className="rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
          >
            Start building
            <span className="ml-2">→</span>
          </Link>
        </div>

      </nav>
    </motion.header>
  );
}