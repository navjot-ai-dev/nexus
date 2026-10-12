"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { Menu, X, ArrowRight, LayoutDashboard } from "lucide-react";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Workflows", href: "/workflows" },
  { label: "Features", href: "/features" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-3.5 md:px-8"
    >
      <nav
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border transition-all duration-300 px-6 ${
          scrolled
            ? "border-slate-200/90 bg-white/90 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl"
            : "border-slate-200/70 bg-white/75 backdrop-blur-lg shadow-2xs"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 shadow-md">
            <div className="h-3 w-3 rounded-full bg-indigo-500" />
            <div className="absolute h-5 w-5 rounded-full border border-white/20" />
          </div>

          <div>
            <div className="text-base font-extrabold tracking-tight text-slate-950">
              NEXUS
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 font-mono">
              Workflow OS
            </div>
          </div>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-1 rounded-xl border border-slate-200/70 bg-slate-50/70 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-white text-slate-950 shadow-2xs font-bold"
                    : "text-slate-600 hover:text-slate-950 hover:bg-white/60"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-2.5 sm:flex">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-indigo-400" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-950 hover:bg-slate-100 transition"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Start Building</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 md:hidden"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl md:hidden"
          >
            <div className="space-y-1.5">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-xs font-semibold ${
                    pathname === link.href
                      ? "bg-slate-100 text-slate-950 font-bold"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 text-indigo-400" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center rounded-xl bg-slate-950 py-2.5 text-xs font-bold text-white shadow-sm"
                    >
                      Start Building →
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}