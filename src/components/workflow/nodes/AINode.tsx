"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Sparkles } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { CustomNodeData, AINodeConfig } from "@/types/workflow";

export const AINode = memo(function AINode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = (data || {}) as CustomNodeData;
  const config = (nodeData.config || {}) as AINodeConfig;
  const model = config.model || "gemini-1.5-flash";
  const prompt = config.prompt || "Analyze and transform context payload";

  return (
    <BaseNode
      id={id}
      selected={selected}
      type="ai"
      title={nodeData.label || "AI Processor"}
      subtitle={config.provider || "Gemini"}
      badge="LLM"
      icon={<Sparkles className="h-5 w-5" />}
      iconBg="bg-[#eef8f6]"
      iconColor="text-[#2a9d8f]"
      accentBorder="bg-[#2a9d8f]"
      hasInput={true}
      hasOutput={true}
      status={nodeData.status}
    >
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-medium text-[#667085]">
          <span className="text-[#2a9d8f] font-mono">{model}</span>
          <span>temp: {config.temperature ?? 0.7}</span>
        </div>
        <p className="truncate text-[11px] text-[#8a94a6] italic">
          "{prompt}"
        </p>
      </div>
    </BaseNode>
  );
});
