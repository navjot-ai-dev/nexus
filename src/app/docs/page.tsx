"use client";

import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Link from "next/link";
import {
  BookOpen,
  Key,
  Workflow,
  Cpu,
  Play,
  Code2,
  Server,
  Layers,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Zap,
} from "lucide-react";

const SECTIONS = [
  { id: "introduction", label: "Introduction", icon: BookOpen },
  { id: "architecture", label: "Architecture", icon: Layers },
  { id: "authentication", label: "Authentication", icon: Key },
  { id: "workflows", label: "Workflows & Builder", icon: Workflow },
  { id: "nodes", label: "Node System", icon: Cpu },
  { id: "execution-engine", label: "Execution Engine", icon: Play },
  { id: "api-reference", label: "REST API Reference", icon: Code2 },
  { id: "env-variables", label: "Environment Variables", icon: Server },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState("introduction");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      <Navbar />

      <div className="mx-auto flex max-w-7xl pt-24 px-6 md:px-8">
        {/* Sticky Desktop Navigation */}
        <aside className="sticky top-24 hidden h-[calc(100vh-120px)] w-64 shrink-0 overflow-y-auto border-r border-[#e9e2d9] pr-6 py-6 lg:block">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a94a6]">
            Documentation
          </p>
          <nav className="mt-4 space-y-1">
            {SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center gap-2.5 rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                    isActive
                      ? "bg-[#fff0eb] text-[#ff6749]"
                      : "text-[#667085] hover:bg-[#f4efe8] hover:text-[#17202a]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{sec.label}</span>
                </a>
              );
            })}
          </nav>
        </aside>

        {/* Documentation Content Area */}
        <article className="min-w-0 flex-1 px-4 py-8 md:px-12 lg:px-16 max-w-4xl">
          {/* 1. Introduction */}
          <section id="introduction" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              01 // Overview
            </span>
            <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#17202a]">
              NEXUS Platform Docs
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#667085]">
              NEXUS is a modern visual workflow automation platform designed for technical teams.
              It unites triggers, AI reasoning (Gemini, OpenAI, Claude), outbound REST HTTP clients,
              and databases into directed graphs executed via an in-engine topological scheduler.
            </p>

            <div className="mt-6 rounded-2xl border border-[#e9e2d9] bg-white p-5 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#17202a]">
                Core Capabilities
              </h3>
              <ul className="mt-3 grid gap-2.5 text-xs text-[#667085] sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ff6749]" />
                  Drag-and-drop React Flow canvas
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2a9d8f]" />
                  Topological DAG execution engine
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0284c7]" />
                  SSRF-guarded outbound HTTP node
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7c3aed]" />
                  Live step logs and execution telemetry
                </li>
              </ul>
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 2. Architecture */}
          <section id="architecture" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              02 // Architecture
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">
              Full-Stack Architecture
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              NEXUS operates as a unified Next.js 16 application with an embedded Hono REST API,
              Drizzle ORM, and Better Auth on Neon PostgreSQL.
            </p>

            <div className="mt-4 rounded-2xl bg-[#17202a] p-5 font-mono text-xs text-[#e0e7ff]">
              <div className="text-[#ff8b72] font-bold mb-2"># Request Pipeline</div>
              <div>Client (React Flow / UI)</div>
              <div className="text-gray-400">  │ (Session Cookie)</div>
              <div>  ▼</div>
              <div>Next.js 16 App Router → Hono API (/api/nexus)</div>
              <div className="text-gray-400">  │ (Ownership verification & Zod validation)</div>
              <div>  ▼</div>
              <div>Topological Graph Engine (src/server/engine)</div>
              <div className="text-gray-400">  │ (Step execution & Node logs)</div>
              <div>  ▼</div>
              <div>Drizzle ORM & Neon PostgreSQL (workflow_execution)</div>
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 3. Authentication */}
          <section id="authentication" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              03 // Security
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">Authentication</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              Built with Better Auth with secure HTTP-only session cookies and password hashing.
              All workflow endpoints strictly verify that <code className="bg-[#f4efe8] px-1 py-0.5 rounded">userId</code> matches the session owner.
            </p>

            <div className="mt-4 rounded-2xl border border-[#e9e2d9] bg-white p-5 space-y-2 text-xs">
              <div className="font-bold text-[#17202a]">Protected Endpoints</div>
              <p className="text-[#667085]">
                Unauthenticated requests automatically receive <code>401 Unauthorized</code>. Accessing another user's workflow or execution yields <code>404 Not Found</code> to prevent identifier probing.
              </p>
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 4. Workflows */}
          <section id="workflows" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              04 // Canvas
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">
              Workflows & The Visual Builder
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              Workflows consist of nodes (operations) and edges (data pipelines). The visual builder provides:
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs">
              <div className="rounded-xl border border-[#e9e2d9] bg-white p-4">
                <span className="font-bold text-[#ff6749]">Drag & Drop or Click</span>
                <p className="mt-1 text-[#667085]">
                  Select node types from the left library. Position anywhere on the snap grid.
                </p>
              </div>
              <div className="rounded-xl border border-[#e9e2d9] bg-white p-4">
                <span className="font-bold text-[#2a9d8f]">Active / Inactive Toggle</span>
                <p className="mt-1 text-[#667085]">
                  Workflows must be toggled Active to be executed or triggered externally.
                </p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 5. Node System */}
          <section id="nodes" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              05 // Nodes
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">Node System</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              NEXUS provides four built-in production node types:
            </p>

            <div className="mt-6 space-y-4">
              <NodeSpec
                type="Webhook"
                color="text-[#ff6749]"
                desc="Listens for inbound HTTP requests. Serves as workflow entrypoint."
                fields="webhookName, method (POST, GET, PUT), path"
              />
              <NodeSpec
                type="AI Processor"
                color="text-[#2a9d8f]"
                desc="Performs LLM inference. Supports Gemini, OpenAI, and Claude with prompt variables."
                fields="provider, model, prompt, systemInstructions, temperature"
              />
              <NodeSpec
                type="HTTP Request"
                color="text-[#0284c7]"
                desc="Outbound HTTP client with SSRF blocking, customizable headers, and timeouts."
                fields="method (GET, POST, PUT, DELETE), url, headers, queryParams, body"
              />
              <NodeSpec
                type="Database Query"
                color="text-[#7c3aed]"
                desc="Sandboxed database operations with query parameters and table isolation."
                fields="operation (SELECT, INSERT, UPDATE), table, parameters"
              />
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 6. Execution Engine */}
          <section id="execution-engine" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              06 // Engine
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">Execution Engine</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              The engine orders nodes topologically based on React Flow connections:
            </p>

            <div className="mt-4 rounded-2xl bg-[#17202a] p-4 text-xs font-mono text-[#e0e7ff] space-y-1">
              <div className="text-[#43bcae]">14:32:01 [Webhook] Received trigger payload</div>
              <div className="text-[#43bcae]">14:32:01 [Webhook] Completed in 12ms</div>
              <div className="text-[#ff8b72]">14:32:01 [AI Processor] Gemini inference started...</div>
              <div className="text-[#ff8b72]">14:32:02 [AI Processor] Completed in 124ms (80 tokens)</div>
              <div className="text-[#60a5fa]">14:32:02 [HTTP Request] POST https://httpbin.org/post</div>
              <div className="text-[#60a5fa]">14:32:03 [HTTP Request] Status 200 OK (210ms)</div>
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 7. REST API Reference */}
          <section id="api-reference" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              07 // REST API
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">API Reference</h2>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <ApiRoute method="GET" path="/api/nexus/workflows" desc="List all workflows for user" />
              <ApiRoute method="POST" path="/api/nexus/workflows" desc="Create new workflow" />
              <ApiRoute method="GET" path="/api/nexus/workflows/:id" desc="Fetch workflow with normalized nodes" />
              <ApiRoute method="PATCH" path="/api/nexus/workflows/:id" desc="Update workflow" />
              <ApiRoute method="DELETE" path="/api/nexus/workflows/:id" desc="Delete workflow & executions" />
              <ApiRoute method="POST" path="/api/nexus/workflows/:id/execute" desc="Execute workflow graph" />
              <ApiRoute method="GET" path="/api/nexus/workflows/:id/executions" desc="List execution history" />
              <ApiRoute method="GET" path="/api/nexus/workflows/:id/executions/:execId" desc="Execution details & logs" />
              <ApiRoute method="GET" path="/api/nexus/stats" desc="Aggregated dashboard stats" />
            </div>
          </section>

          <hr className="my-12 border-[#e9e2d9]" />

          {/* 8. Environment Variables */}
          <section id="env-variables" className="scroll-mt-28">
            <span className="font-mono text-xs font-bold text-[#ff6749] uppercase tracking-wider">
              08 // Config
            </span>
            <h2 className="mt-2 text-2xl font-bold text-[#17202a]">Environment Variables</h2>
            <p className="mt-2 text-xs leading-relaxed text-[#667085]">
              Configure your keys in <code className="bg-[#f4efe8] px-1 py-0.5 rounded">.env</code>:
            </p>

            <div className="mt-4 rounded-2xl bg-[#17202a] p-4 text-xs font-mono text-[#e0e7ff] space-y-2">
              <div><span className="text-gray-400"># Database</span><br/>DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/neondb"</div>
              <div><span className="text-gray-400"># Better Auth</span><br/>BETTER_AUTH_SECRET="your_secret_32_chars"</div>
              <div>BETTER_AUTH_URL="http://localhost:3000"</div>
              <div><span className="text-gray-400"># Optional Live AI Keys</span><br/>GEMINI_API_KEY="AIzaSy..."</div>
              <div>OPENAI_API_KEY="sk-..."</div>
            </div>
          </section>
        </article>
      </div>
    </main>
  );
}

function NodeSpec({
  type,
  color,
  desc,
  fields,
}: {
  type: string;
  color: string;
  desc: string;
  fields: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e9e2d9] bg-white p-5 shadow-xs">
      <div className={`font-bold text-sm ${color}`}>{type} Node</div>
      <p className="mt-1 text-xs text-[#667085] leading-relaxed">{desc}</p>
      <div className="mt-3 pt-3 border-t border-[#f4efe8] font-mono text-[11px] text-[#8a94a6]">
        <span className="font-semibold text-[#17202a]">Fields:</span> {fields}
      </div>
    </div>
  );
}

function ApiRoute({
  method,
  path,
  desc,
}: {
  method: string;
  path: string;
  desc: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-[#e9e2d9] bg-white p-3 gap-2">
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded font-bold text-[10px] ${
            method === "GET"
              ? "bg-sky-50 text-sky-700"
              : method === "POST"
              ? "bg-emerald-50 text-emerald-700"
              : method === "DELETE"
              ? "bg-rose-50 text-rose-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          {method}
        </span>
        <span className="text-[#17202a]">{path}</span>
      </div>
      <span className="text-[#8a94a6] text-[11px] font-sans">{desc}</span>
    </div>
  );
}