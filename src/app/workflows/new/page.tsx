"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Webhook,
  Globe,
  Database,
  Plus,
  Zap,
  ArrowRight,
  Layers,
  Cpu,
} from "lucide-react";

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  badge: string;
  badgeColor: string;
  nodes: any[];
  edges: any[];
}

const TEMPLATES: WorkflowTemplate[] = [
  {
    id: "ai-support-router",
    name: "AI Customer Support Classifier",
    description: "Ingest incoming ticket webhooks, analyze sentiment and urgency with Gemini AI, and persist to database.",
    badge: "AI Powered",
    badgeColor: "bg-[#eef8f6] text-[#2a9d8f]",
    nodes: [
      {
        id: "webhook_1",
        type: "webhook",
        position: { x: 100, y: 150 },
        data: {
          label: "Ticket Webhook",
          description: "Incoming support request",
          type: "webhook",
          config: {
            webhookName: "support_ticket_created",
            method: "POST",
            path: "/api/v1/tickets",
          },
        },
      },
      {
        id: "ai_1",
        type: "ai",
        position: { x: 440, y: 150 },
        data: {
          label: "Sentiment & Priority AI",
          description: "Classify ticket severity",
          type: "ai",
          config: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            prompt: "Classify priority: high, medium, or low based on customer urgency.",
            temperature: 0.3,
          },
        },
      },
      {
        id: "db_1",
        type: "database",
        position: { x: 780, y: 150 },
        data: {
          label: "Save Ticket Record",
          description: "Store enriched ticket",
          type: "database",
          config: {
            operation: "INSERT",
            table: "support_tickets",
          },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "webhook_1",
        target: "ai_1",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
      {
        id: "e2-3",
        source: "ai_1",
        target: "db_1",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
    ],
  },
  {
    id: "api-webhook-sync",
    name: "Webhook to REST API Gateway",
    description: "Receive incoming events and forward payloads with header transformations to external endpoints.",
    badge: "Integration",
    badgeColor: "bg-[#eff8ff] text-[#0284c7]",
    nodes: [
      {
        id: "webhook_1",
        type: "webhook",
        position: { x: 100, y: 150 },
        data: {
          label: "Inbound Hook",
          description: "Event trigger",
          type: "webhook",
          config: {
            webhookName: "event_ingest",
            method: "POST",
            path: "/api/v1/events",
          },
        },
      },
      {
        id: "http_1",
        type: "http",
        position: { x: 440, y: 150 },
        data: {
          label: "External API Forwarder",
          description: "Send transformed payload",
          type: "http",
          config: {
            method: "POST",
            url: "https://httpbin.org/post",
            headers: { "Content-Type": "application/json" },
          },
        },
      },
    ],
    edges: [
      {
        id: "e1-2",
        source: "webhook_1",
        target: "http_1",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
    ],
  },
  {
    id: "full-pipeline",
    name: "Autonomous AI Lead Enrichment",
    description: "Webhook -> Outbound CRM API -> AI Qualification -> Database Persistence.",
    badge: "End-to-End",
    badgeColor: "bg-[#fff0eb] text-[#ff6749]",
    nodes: [
      {
        id: "node_hook",
        type: "webhook",
        position: { x: 80, y: 140 },
        data: {
          label: "Lead Capture Form",
          description: "Receive new lead",
          type: "webhook",
          config: { method: "POST", path: "/leads" },
        },
      },
      {
        id: "node_http",
        type: "http",
        position: { x: 400, y: 140 },
        data: {
          label: "Enrich Company Info",
          description: "Call firmographics API",
          type: "http",
          config: { method: "GET", url: "https://httpbin.org/get" },
        },
      },
      {
        id: "node_ai",
        type: "ai",
        position: { x: 720, y: 140 },
        data: {
          label: "AI Fit Scoring",
          description: "Score ICP alignment",
          type: "ai",
          config: {
            provider: "gemini",
            model: "gemini-1.5-flash",
            prompt: "Calculate lead score 1-100 based on company domain and size.",
          },
        },
      },
      {
        id: "node_db",
        type: "database",
        position: { x: 1040, y: 140 },
        data: {
          label: "Persist Qualified Lead",
          description: "Write to warehouse",
          type: "database",
          config: { operation: "INSERT", table: "qualified_leads" },
        },
      },
    ],
    edges: [
      {
        id: "e1",
        source: "node_hook",
        target: "node_http",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
      {
        id: "e2",
        source: "node_http",
        target: "node_ai",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
      {
        id: "e3",
        source: "node_ai",
        target: "node_db",
        animated: true,
        style: { stroke: "#ff6749", strokeWidth: 2 },
      },
    ],
  },
];

export default function NewWorkflowPage() {
  const router = useRouter();

  const [workflowName, setWorkflowName] = useState("");
  const [description, setDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (template?: WorkflowTemplate) => {
    try {
      setCreating(true);
      setError("");

      const finalName =
        workflowName.trim() ||
        (template ? template.name : "My Automation Workflow");

      const finalDesc =
        description.trim() ||
        (template ? template.description : "Automated pipeline built with NEXUS.");

      const finalNodes = template ? template.nodes : [
        {
          id: `webhook_${Date.now()}`,
          type: "webhook",
          position: { x: 200, y: 200 },
          data: {
            label: "Webhook Trigger",
            description: "Entry point",
            type: "webhook",
            config: { method: "POST", path: "/api/v1/trigger" },
          },
        },
      ];

      const finalEdges = template ? template.edges : [];

      const res = await fetch("/api/nexus/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: finalName,
          description: finalDesc,
          nodes: finalNodes,
          edges: finalEdges,
          active: true, // Default to active so user can immediately execute
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to create workflow");
      }

      router.push(`/workflows/${result.data.id}`);
    } catch (err: any) {
      setError(err.message || "Could not create workflow");
      setCreating(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a] px-6 py-12">
      <div className="mx-auto max-w-5xl">
        {/* Back Link */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#667085] hover:text-[#ff6749] transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="mt-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff6749]">
            Create Workflow
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl text-[#17202a]">
            Design your automation
          </h1>
          <p className="mt-2 text-sm text-[#8a94a6] max-w-xl">
            Start from scratch or select a battle-tested template to jumpstart your integration in seconds.
          </p>
        </div>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* Quick Custom Details Form */}
        <div className="mt-8 rounded-3xl border border-[#e9e2d9] bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#17202a]">
            Workflow Info
          </h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-[#17202a]">
                Workflow Name
              </label>
              <input
                type="text"
                value={workflowName}
                onChange={(e) => setWorkflowName(e.target.value)}
                placeholder="e.g. Daily Data Sync & AI Categorizer"
                className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-2.5 text-xs outline-none focus:border-[#ff6749]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#17202a]">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of what this automation does"
                className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-2.5 text-xs outline-none focus:border-[#ff6749]"
              />
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <button
              onClick={() => handleCreate()}
              disabled={creating}
              className="flex items-center gap-2 rounded-xl bg-[#ff6749] px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#f4573a] disabled:opacity-60"
            >
              <Plus className="h-4 w-4" />
              <span>{creating ? "Creating..." : "Start Blank Canvas"}</span>
            </button>
          </div>
        </div>

        {/* Template Gallery */}
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#17202a]">
                Or Pick a Starter Template
              </h2>
              <p className="text-xs text-[#8a94a6]">
                Pre-connected nodes ready for immediate execution
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => !creating && handleCreate(tmpl)}
                className="group flex flex-col justify-between rounded-3xl border border-[#e9e2d9] bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[#ffb5a5] hover:shadow-lg cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider ${tmpl.badgeColor}`}
                    >
                      {tmpl.badge}
                    </span>
                    <span className="text-xs text-[#8a94a6] font-medium">
                      {tmpl.nodes.length} nodes
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-[#17202a] group-hover:text-[#ff6749] transition">
                    {tmpl.name}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[#667085]">
                    {tmpl.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#f4efe8] flex items-center justify-between text-xs font-semibold text-[#ff6749]">
                  <span>Use template</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}