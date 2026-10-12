"use client";

import React from "react";
import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import {
  Sparkles,
  Webhook,
  Globe,
  Database,
  ArrowRight,
  Zap,
  Filter,
  CheckCircle,
} from "lucide-react";

const TEMPLATES = [
  {
    title: "AI Support Ticket Triage",
    category: "Customer Experience",
    description: "Ingest Zendesk/Stripe webhooks, classify urgency with Gemini AI, and persist prioritized tickets into PostgreSQL.",
    nodes: ["Webhook", "AI Classifier", "Database"],
    gradient: "from-[#ff6749]/10 to-[#ff6749]/5",
    color: "text-[#ff6749]",
  },
  {
    title: "Enriched Lead Scoring Engine",
    category: "Sales & Marketing",
    description: "Receive lead form submissions, call external firmographics APIs via HTTP, evaluate ICP score with AI, and alert Slack.",
    nodes: ["Webhook", "HTTP API", "AI Evaluator", "Database"],
    gradient: "from-[#2a9d8f]/10 to-[#2a9d8f]/5",
    color: "text-[#2a9d8f]",
  },
  {
    title: "Automated Incident Notification",
    category: "DevOps & SRE",
    description: "Catch alertmanager or Datadog alerts, summarize stack traces with LLM, and trigger external on-call dispatching.",
    nodes: ["Webhook", "AI Summarizer", "HTTP Dispatch"],
    gradient: "from-[#0284c7]/10 to-[#0284c7]/5",
    color: "text-[#0284c7]",
  },
  {
    title: "E-Commerce Order Verification",
    category: "Fintech",
    description: "Inspect high-value checkout webhooks, query customer risk histories, verify fraud signals with AI, and record transactions.",
    nodes: ["Webhook", "Database", "AI Risk Score", "HTTP Webhook"],
    gradient: "from-[#7c3aed]/10 to-[#7c3aed]/5",
    color: "text-[#7c3aed]",
  },
  {
    title: "Content Localization Pipeline",
    category: "Content Automation",
    description: "Automatically translate marketing copy across 8 languages with model-controlled temperature and store in database tables.",
    nodes: ["Trigger", "AI Translator", "Database"],
    gradient: "from-[#f4a261]/10 to-[#f4a261]/5",
    color: "text-[#f4a261]",
  },
  {
    title: "Scheduled Data Warehouse Sync",
    category: "Data Engineering",
    description: "Poll third-party partner REST APIs on schedule, filter anomalous records, and load clean payloads into target tables.",
    nodes: ["Trigger", "HTTP API", "Transform", "Database"],
    gradient: "from-[#17202a]/10 to-[#17202a]/5",
    color: "text-[#17202a]",
  },
];

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a] pb-24">
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6749]">
            Workflow Template Library
          </p>
          <h1 className="mt-3 text-5xl font-black tracking-tight text-[#17202a] sm:text-6xl">
            Build workflows that{" "}
            <span className="bg-gradient-to-r from-[#ff6749] to-[#2a9d8f] bg-clip-text text-transparent">
              think & execute.
            </span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-[#667085]">
            Browse production-ready workflow architectures built for developers. Clone any template directly into your workspace or start from a blank canvas.
          </p>
        </div>
      </section>

      {/* Grid of Templates */}
      <section className="mx-auto max-w-7xl px-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((tmpl) => (
          <div
            key={tmpl.title}
            className="group flex flex-col justify-between rounded-3xl border border-[#e9e2d9] bg-white p-7 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-[#ffb5a5] hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a94a6]">
                  {tmpl.category}
                </span>
                <span className={`text-xs font-bold ${tmpl.color}`}>✦ Ready</span>
              </div>

              {/* Node Sequence preview */}
              <div className="mt-5 rounded-2xl bg-[#faf7f2] p-3.5 border border-[#f4efe8]">
                <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono">
                  {tmpl.nodes.map((n, i) => (
                    <React.Fragment key={n}>
                      <span className="rounded-md bg-white px-2 py-0.5 font-semibold text-[#17202a] shadow-2xs">
                        {n}
                      </span>
                      {i < tmpl.nodes.length - 1 && (
                        <span className="text-[#8a94a6]">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <h2 className="mt-5 text-lg font-bold text-[#17202a] group-hover:text-[#ff6749] transition">
                {tmpl.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#667085]">
                {tmpl.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-[#f4efe8] flex items-center justify-between">
              <Link
                href="/workflows/new"
                className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6749] group-hover:translate-x-0.5 transition"
              >
                <span>Use this workflow</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}