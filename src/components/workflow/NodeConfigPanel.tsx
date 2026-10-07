"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trash2,
  Copy,
  Settings,
  Sparkles,
  Globe,
  Database,
  Webhook,
  HelpCircle,
} from "lucide-react";
import type {
  NexusNode,
  NodeType,
  WebhookNodeConfig,
  AINodeConfig,
  HTTPNodeConfig,
  DatabaseNodeConfig,
} from "@/types/workflow";

interface NodeConfigPanelProps {
  selectedNode: NexusNode | null;
  onUpdateNode: (nodeId: string, updatedData: Partial<NexusNode["data"]>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (node: NexusNode) => void;
  onClose: () => void;
}

export function NodeConfigPanel({
  selectedNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onClose,
}: NodeConfigPanelProps) {
  if (!selectedNode) return null;

  const nodeType = (selectedNode.type || selectedNode.data?.type || "default") as NodeType;
  const label = (selectedNode.data?.label as string) || "";
  const rawConfig = (selectedNode.data?.config as any) || {};

  return (
    <aside className="flex h-full w-84 flex-col border-l border-[#e9e2d9] bg-white shadow-xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e9e2d9] px-5 py-4">
        <div className="flex items-center gap-2.5">
          <NodeIcon type={nodeType} />
          <div>
            <h3 className="text-sm font-bold text-[#17202a]">{label || "Node Settings"}</h3>
            <span className="font-mono text-[10px] uppercase text-[#8a94a6] tracking-wider">
              {nodeType}
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-[#8a94a6] transition hover:bg-[#f4efe8] hover:text-[#17202a]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Body / Config fields */}
      <div className="flex-1 space-y-5 overflow-y-auto p-5 text-xs">
        {/* Label input */}
        <div>
          <label className="block font-semibold text-[#17202a]">Step Label</label>
          <input
            type="text"
            value={label}
            onChange={(e) => onUpdateNode(selectedNode.id, { label: e.target.value })}
            className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2.5 text-xs text-[#17202a] outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
            placeholder="e.g. Fetch User Data"
          />
        </div>

        {/* Dynamic Fields Based on Node Type */}
        {nodeType === "webhook" && (
          <WebhookConfigFields
            config={rawConfig}
            onChange={(cfg) =>
              onUpdateNode(selectedNode.id, {
                config: { ...rawConfig, ...cfg },
              })
            }
          />
        )}

        {nodeType === "ai" && (
          <AIConfigFields
            config={rawConfig}
            onChange={(cfg) =>
              onUpdateNode(selectedNode.id, {
                config: { ...rawConfig, ...cfg },
              })
            }
          />
        )}

        {nodeType === "http" && (
          <HTTPConfigFields
            config={rawConfig}
            onChange={(cfg) =>
              onUpdateNode(selectedNode.id, {
                config: { ...rawConfig, ...cfg },
              })
            }
          />
        )}

        {nodeType === "database" && (
          <DatabaseConfigFields
            config={rawConfig}
            onChange={(cfg) =>
              onUpdateNode(selectedNode.id, {
                config: { ...rawConfig, ...cfg },
              })
            }
          />
        )}
      </div>

      {/* Actions Footer */}
      <div className="border-t border-[#e9e2d9] bg-[#faf7f2] p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDuplicateNode(selectedNode)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#e9e2d9] bg-white py-2 text-xs font-semibold text-[#475467] shadow-xs transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
          >
            <Copy className="h-3.5 w-3.5" />
            Duplicate
          </button>

          <button
            onClick={() => onDeleteNode(selectedNode.id)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </aside>
  );
}

function WebhookConfigFields({
  config,
  onChange,
}: {
  config: WebhookNodeConfig;
  onChange: (cfg: Partial<WebhookNodeConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold text-[#17202a]">Webhook Name</label>
        <input
          type="text"
          value={config.webhookName || ""}
          onChange={(e) => onChange({ webhookName: e.target.value })}
          placeholder="e.g. stripe_checkout_completed"
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">Method</label>
        <select
          value={config.method || "POST"}
          onChange={(e) => onChange({ method: e.target.value as any })}
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        >
          <option value="POST">POST</option>
          <option value="GET">GET</option>
          <option value="PUT">PUT</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">Endpoint Path</label>
        <input
          type="text"
          value={config.path || "/api/v1/trigger"}
          onChange={(e) => onChange({ path: e.target.value })}
          className="mt-1.5 w-full font-mono rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>
    </div>
  );
}

function AIConfigFields({
  config,
  onChange,
}: {
  config: AINodeConfig;
  onChange: (cfg: Partial<AINodeConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold text-[#17202a]">AI Provider</label>
        <select
          value={config.provider || "gemini"}
          onChange={(e) => onChange({ provider: e.target.value as any })}
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        >
          <option value="gemini">Google Gemini (Recommended)</option>
          <option value="openai">OpenAI</option>
          <option value="anthropic">Anthropic Claude</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">Model</label>
        <input
          type="text"
          value={config.model || (config.provider === "openai" ? "gpt-4o-mini" : "gemini-1.5-flash")}
          onChange={(e) => onChange({ model: e.target.value })}
          className="mt-1.5 w-full font-mono rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">Prompt</label>
        <textarea
          rows={3}
          value={config.prompt || ""}
          onChange={(e) => onChange({ prompt: e.target.value })}
          placeholder="e.g. Summarize the user issue and categorize its severity."
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
        <span className="text-[10px] text-[#8a94a6]">Use {"{{variable}}"} to insert previous step fields.</span>
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">System Instructions</label>
        <textarea
          rows={2}
          value={config.systemInstructions || ""}
          onChange={(e) => onChange({ systemInstructions: e.target.value })}
          placeholder="You are an AI assistant in NEXUS."
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>

      <div>
        <div className="flex justify-between font-semibold text-[#17202a]">
          <span>Temperature</span>
          <span className="font-mono text-[#ff6749]">{config.temperature ?? 0.7}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={config.temperature ?? 0.7}
          onChange={(e) => onChange({ temperature: parseFloat(e.target.value) })}
          className="mt-2 w-full accent-[#ff6749]"
        />
      </div>
    </div>
  );
}

function HTTPConfigFields({
  config,
  onChange,
}: {
  config: HTTPNodeConfig;
  onChange: (cfg: Partial<HTTPNodeConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold text-[#17202a]">Method</label>
        <select
          value={config.method || "GET"}
          onChange={(e) => onChange({ method: e.target.value as any })}
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        >
          <option value="GET">GET</option>
          <option value="POST">POST</option>
          <option value="PUT">PUT</option>
          <option value="PATCH">PATCH</option>
          <option value="DELETE">DELETE</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">URL</label>
        <input
          type="text"
          value={config.url || "https://httpbin.org/anything"}
          onChange={(e) => onChange({ url: e.target.value })}
          placeholder="https://api.example.com/endpoint"
          className="mt-1.5 w-full font-mono rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>

      {["POST", "PUT", "PATCH"].includes(config.method || "GET") && (
        <div>
          <label className="block font-semibold text-[#17202a]">Request Body (JSON)</label>
          <textarea
            rows={4}
            value={config.body || ""}
            onChange={(e) => onChange({ body: e.target.value })}
            placeholder='{"key": "value"}'
            className="mt-1.5 w-full font-mono rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
          />
        </div>
      )}
    </div>
  );
}

function DatabaseConfigFields({
  config,
  onChange,
}: {
  config: DatabaseNodeConfig;
  onChange: (cfg: Partial<DatabaseNodeConfig>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block font-semibold text-[#17202a]">Operation</label>
        <select
          value={config.operation || "SELECT"}
          onChange={(e) => onChange({ operation: e.target.value as any })}
          className="mt-1.5 w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        >
          <option value="SELECT">SELECT (Read)</option>
          <option value="INSERT">INSERT (Create)</option>
          <option value="UPDATE">UPDATE (Modify)</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-[#17202a]">Table Name</label>
        <input
          type="text"
          value={config.table || "workflow_records"}
          onChange={(e) => onChange({ table: e.target.value })}
          placeholder="workflow_records"
          className="mt-1.5 w-full font-mono rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3 py-2 text-xs outline-none focus:border-[#ff6749]"
        />
      </div>
    </div>
  );
}

function NodeIcon({ type }: { type: NodeType }) {
  switch (type) {
    case "webhook":
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#fff0eb] text-[#ff6749]">
          <Webhook className="h-4 w-4" />
        </div>
      );
    case "ai":
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eef8f6] text-[#2a9d8f]">
          <Sparkles className="h-4 w-4" />
        </div>
      );
    case "http":
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#eff8ff] text-[#0284c7]">
          <Globe className="h-4 w-4" />
        </div>
      );
    case "database":
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f5f3ff] text-[#7c3aed]">
          <Database className="h-4 w-4" />
        </div>
      );
    default:
      return (
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f4efe8] text-[#667085]">
          <Settings className="h-4 w-4" />
        </div>
      );
  }
}
