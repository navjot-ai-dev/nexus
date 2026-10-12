"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { Menu, X, ArrowRight, LayoutDashboard, LogIn } from "lucide-react";

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
      className="fixed left-0 right-0 top-0 z-50 px-4 pt-4 md:px-8"
    >
      <nav
        className={`mx-auto flex h-16 max-w-6xl items-center justify-between rounded-2xl border border-[#e9e2d9] bg-[#fffdf9]/90 px-6 backdrop-blur-xl transition-all duration-300 ${
          scrolled ? "shadow-lg bg-white/95 border-[#ded5c8]" : "shadow-xs"
        }`}
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#17202a] shadow-md">
            <div className="h-3.5 w-3.5 rounded-full bg-[#ff6749]" />
            <div className="absolute h-6 w-6 rounded-full border border-white/20" />
          </div>

          <div>
            <div className="text-base font-black tracking-tight text-[#17202a]">
              NEXUS
            </div>
            <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8a94a6]">
              Workflow OS
            </div>
          </div>
        </Link>

        {/* Center links */}
        <div className="hidden items-center gap-1 rounded-xl border border-[#e9e2d9] bg-white/80 p-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "bg-[#fff0eb] text-[#ff6749]"
                    : "text-[#667085] hover:bg-[#faf7f2] hover:text-[#17202a]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="hidden items-center gap-3 sm:flex">
          {session ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-xl bg-[#17202a] px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-[#2c3b4d]"
            >
              <LayoutDashboard className="h-3.5 w-3.5 text-[#ff6749]" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="rounded-xl px-4 py-2 text-xs font-semibold text-[#667085] hover:text-[#17202a] transition"
              >
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="flex items-center gap-1.5 rounded-xl bg-[#ff6749] px-4 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(255,103,73,0.3)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
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
          className="rounded-xl p-2 text-[#667085] hover:bg-[#f4efe8] md:hidden"
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
            className="mx-auto mt-2 max-w-6xl rounded-2xl border border-[#e9e2d9] bg-white p-5 shadow-xl md:hidden"
          >
            <div className="space-y-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-2.5 text-xs font-semibold ${
                    pathname === link.href
                      ? "bg-[#fff0eb] text-[#ff6749]"
                      : "text-[#667085] hover:bg-[#faf7f2]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              <div className="pt-3 border-t border-[#f4efe8] flex flex-col gap-2">
                {session ? (
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#17202a] py-2.5 text-xs font-bold text-white"
                  >
                    <LayoutDashboard className="h-4 w-4 text-[#ff6749]" />
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/sign-in"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center rounded-xl border border-[#e9e2d9] py-2 text-xs font-semibold text-[#667085]"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/sign-up"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center rounded-xl bg-[#ff6749] py-2.5 text-xs font-bold text-white shadow-md"
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