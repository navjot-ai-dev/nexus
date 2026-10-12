"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import StartBuildingButton from "@/components/landing/StartBuildingButton";
import ScrollProgressBar from "@/components/landing/ScrollProgressBar";
import Link from "next/link";
import {
  Webhook,
  Sparkles,
  Database,
  Globe,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Terminal,
  Cpu,
  GitBranch,
  Play,
  CheckCircle2,
  RotateCw,
  Clock,
  Zap,
} from "lucide-react";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Hero Parallax on Scroll
      gsap.to(".hero-content", {
        y: -45,
        opacity: 0.85,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".hero-3d-scene", {
        y: 65,
        scale: 0.94,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(".hero-floating-card-1", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(".hero-floating-card-2", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(".hero-floating-card-3", {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 0.9,
        },
      });

      // 2. Product Flow Section Reveal
      gsap.fromTo(
        ".product-header",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#product",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".product-diagram-box",
        { opacity: 0, scale: 0.94, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".product-diagram-box",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Stagger in the product diagram node cards
      gsap.fromTo(
        ".diagram-node-card",
        { opacity: 0, y: 35, scale: 0.92 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: ".product-diagram-box",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 3. Features Section (Deep Navy)
      gsap.fromTo(
        ".features-header",
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "#features",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".feature-card-item",
        { opacity: 0, y: 60, rotationX: 6 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.16,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".features-grid",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Terminal scrub animation
      gsap.fromTo(
        ".terminal-console-box",
        { opacity: 0, y: 50, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.85,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".terminal-console-box",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      gsap.fromTo(
        ".terminal-line-item",
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".terminal-console-box",
            start: "top 75%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 4. CTA Section Zoom
      gsap.fromTo(
        ".cta-banner-box",
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".cta-banner-box",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    // Active tracer cycle for the visual pipeline simulation
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2400);

    return () => {
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#fffdf9] text-[#17202a]">
      {/* Top GSAP Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navigation */}
      <Navbar />

      {/* Hero with 3D Canvas & GSAP Parallax */}
      <Hero />

      {/* PRODUCT INTERACTIVE FLOW */}
      <section id="product" className="border-t border-[#eee8df] bg-[#fffdf9] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="product-header max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              Infinite Extensibility
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-[#17202a]">
              One visual canvas.
              <br />
              Enterprise reliability.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#667085]">
              Compose webhooks, LLMs, REST APIs, and database transactions into directed acyclic graphs.
              Every node is type-safe, observable, and isolated with SSRF protection.
            </p>
          </div>

          {/* Interactive Workflow Diagram with Active Tracer */}
          <div className="product-diagram-box relative mt-16 overflow-hidden rounded-[36px] border border-[#e8e1d8] bg-[#f8f5ef] p-8 md:p-12 shadow-[0_24px_60px_rgba(23,32,42,0.06)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#ffb69e]/20 blur-[100px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#9be4da]/20 blur-[100px]" />

            {/* Live Pipeline Active Status Bar */}
            <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e1d8] pb-6">
              <div className="flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff6749] opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-[#ff6749]" />
                </span>
                <span className="font-mono text-xs font-bold text-[#17202a]">
                  Live Visual Simulation
                </span>
                <span className="rounded-full bg-[#eef8f6] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#2a9d8f]">
                  Step {activeStep + 1} of 4 Active
                </span>
              </div>

              <div className="hidden font-mono text-[11px] text-[#8a94a6] sm:block">
                Topological execution order: Trigger → AI → API → Warehouse
              </div>
            </div>

            <div className="relative flex flex-col items-center justify-center gap-6 lg:flex-row">
              <InteractiveDiagramCard
                badge="TRIGGER"
                badgeColor="bg-[#fff0eb] text-[#ff6749]"
                title="Webhook Listener"
                detail="POST /api/v1/events"
                icon={<Webhook className="h-5 w-5 text-[#ff6749]" />}
                isActive={activeStep === 0}
                activeColor="ring-2 ring-[#ff6749] shadow-lg shadow-[#ff6749]/20"
                statusText="Payload Ingested (200)"
              />

              <FlowConnector
                label="JSON payload"
                isFlowing={activeStep >= 1}
                color="#ff6749"
              />

              <InteractiveDiagramCard
                badge="AI MODEL"
                badgeColor="bg-[#eef8f6] text-[#2a9d8f]"
                title="Gemini 1.5 Flash"
                detail="Extract intent & sentiment"
                icon={<Sparkles className="h-5 w-5 text-[#2a9d8f]" />}
                isActive={activeStep === 1}
                activeColor="ring-2 ring-[#2a9d8f] shadow-lg shadow-[#2a9d8f]/20"
                statusText="Analyzed (78 tokens)"
              />

              <FlowConnector
                label="Structured text"
                isFlowing={activeStep >= 2}
                color="#2a9d8f"
              />

              <InteractiveDiagramCard
                badge="API"
                badgeColor="bg-[#eff8ff] text-[#0284c7]"
                title="HTTP Dispatcher"
                detail="Sync to CRM / Slack"
                icon={<Globe className="h-5 w-5 text-[#0284c7]" />}
                isActive={activeStep === 2}
                activeColor="ring-2 ring-[#0284c7] shadow-lg shadow-[#0284c7]/20"
                statusText="Status 200 OK (85ms)"
              />

              <FlowConnector
                label="Response 200"
                isFlowing={activeStep >= 3}
                color="#0284c7"
              />

              <InteractiveDiagramCard
                badge="STORAGE"
                badgeColor="bg-[#f5f3ff] text-[#7c3aed]"
                title="Database Store"
                detail="INSERT INTO audit_logs"
                icon={<Database className="h-5 w-5 text-[#7c3aed]" />}
                isActive={activeStep === 3}
                activeColor="ring-2 ring-[#7c3aed] shadow-lg shadow-[#7c3aed]/20"
                statusText="1 row persisted"
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER FEATURES (DEEP NAVY) */}
      <section id="features" className="bg-[#17202a] px-6 py-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="features-header flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff8b72]">
                Architected for Engineers
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                The technical standard
                <br />
                for workflow execution.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              NEXUS combines topological graph traversal, isolated node runners, and real-time step streaming.
            </p>
          </div>

          <div className="features-grid mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<GitBranch className="h-5 w-5 text-[#ff8b72]" />}
              number="01"
              title="Topological Execution"
              text="Nodes execute strictly respecting dependency edges. Branching, parallel chains, and fallbacks are handled deterministically."
            />
            <FeatureCard
              icon={<Cpu className="h-5 w-5 text-[#43bcae]" />}
              number="02"
              title="Universal AI Abstraction"
              text="Plug in Google Gemini, OpenAI, or Anthropic models with unified prompt templates and automatic variable hydration."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-[#ff8b72]" />}
              number="03"
              title="SSRF-Guarded HTTP Client"
              text="Outbound HTTP nodes reject loopback, internal RFC 1918 networks, and metadata endpoints to keep your infrastructure secure."
            />
          </div>

          {/* Interactive Live Execution Terminal scrubbed on scroll */}
          <div className="terminal-console-box mt-16 overflow-hidden rounded-[32px] border border-white/10 bg-[#0f1720] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-3.5 bg-black/30">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 font-mono text-xs text-white/50">
                  nexus-engine.log — stream-telemetry
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400">
                <Activity className="h-3.5 w-3.5 animate-pulse" />
                <span>ACTIVE SESSION</span>
              </div>
            </div>

            <div className="p-6 font-mono text-xs space-y-3">
              <TerminalLogLine
                time="14:48:01.104"
                source="GRAPH_RUNNER"
                type="INFO"
                message="Workflow e48b-39f1 triggered via inbound HTTP webhook (/api/v1/tickets)"
                badge="200 OK"
              />
              <TerminalLogLine
                time="14:48:01.128"
                source="TOPOLOGY"
                type="SUCCESS"
                message="Graph resolved: 4 nodes, 3 directed edges, 0 cyclic loops detected"
              />
              <TerminalLogLine
                time="14:48:01.242"
                source="AI_GEMINI"
                type="INFO"
                message="Inference completed: gemini-1.5-flash latency=114ms tokens=84"
                highlight="sentiment: positive, urgency: high"
              />
              <TerminalLogLine
                time="14:48:01.418"
                source="HTTP_CLIENT"
                type="SUCCESS"
                message="SSRF validation passed. POST https://httpbin.org/anything -> 200 OK"
              />
              <TerminalLogLine
                time="14:48:01.485"
                source="DATABASE"
                type="SUCCESS"
                message="Transaction committed: 1 record written to table 'support_tickets'"
              />
              <TerminalLogLine
                time="14:48:01.490"
                source="ENGINE"
                type="COMPLETED"
                message="Workflow execution finished in 386ms total duration. State persisted."
                badge="SUCCESS"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#fffdf9] px-6 py-24">
        <div className="cta-banner-box mx-auto max-w-5xl rounded-[36px] bg-[#17202a] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-[#ff6749]/15 blur-[90px]" />
          <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-[#2a9d8f]/15 blur-[90px]" />

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff8b72]">
            Ready to Build?
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Start automating with NEXUS today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            Create visual workflows, connect AI models, and run reliable integrations in minutes.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <StartBuildingButton />
            <Link
              href="/docs"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20 hover:-translate-y-0.5"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#eee8df] bg-[#fffdf9] px-6 py-12 text-xs text-[#8a94a6]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17202a]">
              <div className="h-2 w-2 rounded-full bg-[#ff6749]" />
            </div>
            <span className="font-bold text-[#17202a]">NEXUS Workflow OS</span>
            <span>—</span>
            <span>Visual Automation Platform</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-[#667085]">
            <Link href="/product" className="hover:text-[#17202a] transition">
              Product
            </Link>
            <Link href="/workflows" className="hover:text-[#17202a] transition">
              Workflows
            </Link>
            <Link href="/features" className="hover:text-[#17202a] transition">
              Features
            </Link>
            <Link href="/docs" className="hover:text-[#17202a] transition">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InteractiveDiagramCard({
  title,
  detail,
  badge,
  badgeColor,
  icon,
  isActive,
  activeColor,
  statusText,
}: {
  title: string;
  detail: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
  isActive: boolean;
  activeColor: string;
  statusText: string;
}) {
  return (
    <div
      className={`diagram-node-card w-full sm:w-60 rounded-2xl border bg-white p-5 transition-all duration-300 ${
        isActive
          ? `border-transparent ${activeColor} -translate-y-2`
          : "border-[#e8e1d8] shadow-sm hover:-translate-y-1 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf7f2]">
          {icon}
        </div>
        <span className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-bold ${badgeColor}`}>
          {badge}
        </span>
      </div>

      <h3 className="mt-3 text-sm font-bold text-[#17202a]">{title}</h3>
      <p className="mt-1 font-mono text-[11px] text-[#8a94a6] truncate">{detail}</p>

      {/* Dynamic status chip */}
      <div className="mt-3.5 pt-2.5 border-t border-[#f4efe8] flex items-center justify-between text-[10px]">
        <span className="font-semibold text-[#667085]">Status</span>
        <span
          className={`font-mono font-bold transition-colors ${
            isActive ? "text-[#ff6749]" : "text-[#8a94a6]"
          }`}
        >
          {isActive ? statusText : "Ready"}
        </span>
      </div>
    </div>
  );
}

function FlowConnector({
  label,
  isFlowing,
  color,
}: {
  label: string;
  isFlowing: boolean;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#8a94a6] lg:block">
        {label}
      </span>
      <div
        className={`hidden lg:flex items-center text-lg font-bold transition-all duration-300 ${
          isFlowing ? "scale-125 translate-x-1" : "opacity-50"
        }`}
        style={{ color: isFlowing ? color : "#8a94a6" }}
      >
        →
      </div>
      <div
        className={`lg:hidden text-lg font-bold transition-all duration-300 ${
          isFlowing ? "scale-125 translate-y-1" : "opacity-50"
        }`}
        style={{ color: isFlowing ? color : "#8a94a6" }}
      >
        ↓
      </div>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="feature-card-item rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition-all duration-300 hover:-translate-y-2 hover:bg-white/[0.06] hover:border-white/20 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          {icon}
        </div>
        <span className="font-mono text-xs font-bold text-[#ff8b72]">{number}</span>
      </div>
      <h3 className="mt-8 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-xs leading-relaxed text-white/60">{text}</p>
    </div>
  );
}

function TerminalLogLine({
  time,
  source,
  type,
  message,
  badge,
  highlight,
}: {
  time: string;
  source: string;
  type: string;
  message: string;
  badge?: string;
  highlight?: string;
}) {
  return (
    <div className="terminal-line-item flex flex-wrap items-baseline gap-2.5 text-white/80">
      <span className="text-white/40">{time}</span>
      <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-semibold text-[#43bcae]">
        [{source}]
      </span>
      <span className="flex-1 text-white/70">
        {message}
        {highlight && (
          <span className="ml-2 font-bold text-[#ff8b72]">({highlight})</span>
        )}
      </span>
      {badge && (
        <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400">
          {badge}
        </span>
      )}
    </div>
  );
}