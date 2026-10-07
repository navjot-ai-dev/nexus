"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Globe } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { CustomNodeData, HTTPNodeConfig } from "@/types/workflow";

export const HTTPNode = memo(function HTTPNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = (data || {}) as CustomNodeData;
  const config = (nodeData.config || {}) as HTTPNodeConfig;
  const method = config.method || "GET";
  const url = config.url || "https://httpbin.org/anything";

  return (
    <BaseNode
      id={id}
      selected={selected}
      type="http"
      title={nodeData.label || "HTTP Request"}
      subtitle="Outbound API Call"
      badge={method}
      icon={<Globe className="h-5 w-5" />}
      iconBg="bg-[#eff8ff]"
      iconColor="text-[#0284c7]"
      accentBorder="bg-[#0284c7]"
      hasInput={true}
      hasOutput={true}
      status={nodeData.status}
    >
      <div className="flex items-center gap-2 font-mono text-[11px]">
        <span
          className={`font-bold px-1.5 py-0.5 rounded ${
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
        <span className="truncate text-[#667085] flex-1">{url}</span>
      </div>
    </BaseNode>
  );
});
