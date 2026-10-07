"use client";

import React from "react";
import { Webhook, Sparkles, Globe, Database, Plus, GripVertical } from "lucide-react";
import type { NodeType } from "@/types/workflow";

interface NodePanelProps {
  onAddNode: (type: NodeType) => void;
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const AVAILABLE_NODES: {
  type: NodeType;
  title: string;
  category: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    type: "webhook",
    title: "Webhook Trigger",
    category: "Triggers",
    description: "Start workflow from an incoming HTTP request",
    icon: <Webhook className="h-4 w-4" />,
    iconBg: "bg-[#fff0eb]",
    iconColor: "text-[#ff6749]",
  },
  {
    type: "ai",
    title: "AI Processor",
    category: "Intelligence",
    description: "Analyze, classify, or generate text with LLMs",
    icon: <Sparkles className="h-4 w-4" />,
    iconBg: "bg-[#eef8f6]",
    iconColor: "text-[#2a9d8f]",
  },
  {
    type: "http",
    title: "HTTP Request",
    category: "Integrations",
    description: "Call any external REST API or webhook endpoint",
    icon: <Globe className="h-4 w-4" />,
    iconBg: "bg-[#eff8ff]",
    iconColor: "text-[#0284c7]",
  },
  {
    type: "database",
    title: "Database Query",
    category: "Storage",
    description: "Safely execute SELECT, INSERT, or UPDATE operations",
    icon: <Database className="h-4 w-4" />,
    iconBg: "bg-[#f5f3ff]",
    iconColor: "text-[#7c3aed]",
  },
];

export function NodePanel({ onAddNode, onDragStart }: NodePanelProps) {
  return (
    <aside className="flex h-full w-72 flex-col border-r border-[#e9e2d9] bg-white">
      {/* Panel Header */}
      <div className="border-b border-[#e9e2d9] p-4">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#8a94a6]">
          Node Library
        </p>
        <p className="mt-1 text-xs text-[#667085]">
          Drag to canvas or click to add
        </p>
      </div>

      {/* Node Cards */}
      <div className="flex-1 space-y-2.5 overflow-y-auto p-3.5">
        {AVAILABLE_NODES.map((node) => (
          <div
            key={node.type}
            draggable
            onDragStart={(e) => onDragStart(e, node.type)}
            onClick={() => onAddNode(node.type)}
            className="group relative flex cursor-grab items-start gap-3 rounded-xl border border-[#e9e2d9] bg-[#fffdf9] p-3 transition-all duration-150 hover:-translate-y-0.5 hover:border-[#ffb5a5] hover:bg-[#fff0eb] hover:shadow-sm active:cursor-grabbing"
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${node.iconBg} ${node.iconColor} shadow-xs transition group-hover:scale-105`}
            >
              {node.icon}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#17202a]">
                  {node.title}
                </span>
                <button
                  type="button"
                  title="Add to canvas"
                  className="opacity-0 transition group-hover:opacity-100 text-[#ff6749] hover:bg-white p-1 rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddNode(node.type);
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-relaxed text-[#8a94a6]">
                {node.description}
              </p>
            </div>

            <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-40 transition">
              <GripVertical className="h-3 w-3 text-[#667085]" />
            </div>
          </div>
        ))}
      </div>

      {/* Help Footer */}
      <div className="border-t border-[#e9e2d9] bg-[#faf7f2] p-4 text-[11px] text-[#8a94a6]">
        <p className="font-semibold text-[#17202a]">Tip</p>
        <p className="mt-0.5">
          Connect nodes from right outputs to left inputs to establish the execution order.
        </p>
      </div>
    </aside>
  );
}
