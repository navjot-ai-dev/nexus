"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Navbar from "@/components/landing/Navbar";
import StartBuildingButton from "@/components/landing/StartBuildingButton";
import ScrollProgressBar from "@/components/landing/ScrollProgressBar";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

const features = [
  {
    number: "01",
    title: "Visual Workflow Builder",
    description:
      "Build complex automation visually. Connect triggers, AI models, APIs, databases, conditions, and actions on a single canvas.",
  },
  {
    number: "02",
    title: "AI-Powered Workflows",
    description:
      "Bring AI directly into your workflows for generation, classification, extraction, summarization, analysis, and intelligent decisions.",
  },
  {
    number: "03",
    title: "API & HTTP Automation",
    description:
      "Connect almost any external service using HTTP requests, custom headers, parameters, authentication, and structured responses.",
  },
  {
    number: "04",
    title: "Event-Driven Automation",
    description:
      "Start workflows from webhooks, schedules, API requests, or events instead of manually running them.",
  },
  {
    number: "05",
    title: "Real-Time Execution",
    description:
      "Watch workflows execute step by step and see what each node is doing while the workflow is running.",
  },
  {
    number: "06",
    title: "Execution History",
    description:
      "Inspect previous workflow executions, inputs, outputs, execution time, and errors from one place.",
  },
];

export default function FeaturesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Feature rows stagger on scroll
      gsap.fromTo(
        ".feature-row",
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".feature-list-section",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 2. Visual workflow preview card on scroll
      gsap.fromTo(
        ".workflow-preview-card",
        { opacity: 0, scale: 0.92, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "back.out(1.2)",
          scrollTrigger: {
            trigger: ".workflow-preview-card",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 3. Execution logs stagger on scroll
      gsap.fromTo(
        ".execution-log-item",
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".execution-logs-box",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // 4. CTA box zoom on scroll
      gsap.fromTo(
        ".features-cta-box",
        { opacity: 0, scale: 0.94, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".features-cta-box",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      <ScrollProgressBar />
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32">
        <div className="max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
            NEXUS Features
          </p>

          <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
            Everything you need
            <br />
            to build <span className="text-[#ff6749]">automation.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-500">
            NEXUS combines visual workflow design, AI, APIs,
            event-driven execution, and real-time monitoring into one
            developer-focused platform.
          </p>
        </div>
      </section>

      {/* Feature List */}
      <section className="feature-list-section border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6">
          {features.map((feature) => (
            <div
              key={feature.number}
              className="feature-row grid gap-8 border-b border-black/10 py-14 last:border-b-0 md:grid-cols-[100px_350px_1fr] md:items-start"
            >
              <span className="font-mono text-sm font-bold text-[#ff6749]">
                {feature.number}
              </span>

              <h2 className="text-2xl font-bold md:text-3xl">
                {feature.title}
              </h2>

              <p className="max-w-xl text-base leading-8 text-gray-500">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Workflow Section */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              Visual automation
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              See your entire
              <br />
              workflow.
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-gray-500">
              Instead of hiding your application logic behind
              hundreds of files, NEXUS gives you a visual canvas where
              the flow of your automation is easy to understand.
            </p>
          </div>

          {/* Workflow Preview */}
          <div className="relative">
            <div className="workflow-preview-card rounded-[32px] border border-black/5 bg-white p-7 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Workflow
                  </p>

                  <h3 className="mt-1 font-bold">
                    Customer Support AI
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Running
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <WorkflowNode
                  icon="⚡"
                  title="Webhook"
                  text="New support request"
                />

                <Line />

                <WorkflowNode
                  icon="✦"
                  title="AI Analyzer"
                  text="Understand customer issue"
                />

                <Line />

                <WorkflowNode
                  icon="◇"
                  title="Condition"
                  text="Determine priority"
                />

                <Line />

                <WorkflowNode
                  icon="↗"
                  title="API Request"
                  text="Create support ticket"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Section */}
      <section className="border-y border-black/5 bg-[#f7f4ee]">
        <div className="mx-auto max-w-7xl px-6 py-28">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
                AI Native
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Put intelligence
                <br />
                inside the workflow.
              </h2>
            </div>

            <div className="space-y-7">
              <p className="text-lg leading-8 text-gray-600">
                AI isn't a separate tool in NEXUS. It can become part
                of the workflow itself.
              </p>

              <div className="border-t border-black/10 pt-6">
                <p className="font-bold">Generate</p>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Generate text, structured data, summaries, and responses.
                </p>
              </div>

              <div className="border-t border-black/10 pt-6">
                <p className="font-bold">Analyze</p>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Understand incoming data and extract useful information.
                </p>
              </div>

              <div className="border-t border-black/10 pt-6">
                <p className="font-bold">Decide</p>
                <p className="mt-2 text-sm leading-7 text-gray-500">
                  Use AI results as inputs for the next step of your workflow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Execution Section */}
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
            Execution
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
            Know what is happening.
          </h2>

          <p className="mt-6 leading-8 text-gray-500">
            Every workflow execution can be inspected. Follow the
            execution path, inspect node outputs, identify failures,
            and understand how long each step took.
          </p>
        </div>

        <div className="execution-logs-box mt-14 overflow-hidden rounded-[32px] bg-[#17202a] shadow-xl">
          <div className="border-b border-white/10 px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-gray-500">
                execution.log
              </span>
            </div>
          </div>

          <div className="space-y-4 p-7 font-mono text-sm">
            <Log time="10:42:01" text="Workflow started" />
            <Log time="10:42:02" text="Webhook received" />
            <Log time="10:42:03" text="AI Analyzer completed" />
            <Log time="10:42:04" text="Condition evaluated" />
            <Log time="10:42:05" text="API request completed" />
            <Log time="10:42:05" text="Workflow completed" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="features-cta-box mx-6 mb-10 rounded-[40px] bg-[#17202a] px-6 py-24 text-center text-white shadow-2xl">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
          Build with NEXUS
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Your workflow.
          <br />
          Your logic.
          <br />
          Your automation.
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-7 text-gray-400">
          Start building intelligent workflows and connect the
          systems your application depends on.
        </p>

        <div className="mt-9 inline-flex rounded-full px-8 py-4 text-sm font-bold text-white transition hover:scale-105">
          <StartBuildingButton />
        </div>
      </section>
    </div>
  );
}

function WorkflowNode({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-black/5 bg-[#fffdf9] p-4">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fff0eb] text-lg">
        {icon}
      </div>

      <div>
        <p className="font-bold">{title}</p>
        <p className="mt-1 text-xs text-gray-400">{text}</p>
      </div>
    </div>
  );
}

function Line() {
  return <div className="ml-9 h-4 border-l border-dashed border-gray-300" />;
}

function Log({
  time,
  text,
}: {
  time: string;
  text: string;
}) {
  return (
    <div className="execution-log-item flex items-center gap-4">
      <span className="text-gray-500">{time}</span>
      <span className="text-emerald-400 font-bold">✓</span>
      <span className="text-gray-300">{text}</span>
    </div>
  );
}