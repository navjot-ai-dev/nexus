"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Cpu } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { CustomNodeData } from "@/types/workflow";

export const DefaultFallbackNode = memo(function DefaultFallbackNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = (data || {}) as CustomNodeData;

  return (
    <BaseNode
      id={id}
      selected={selected}
      type="default"
      title={nodeData.label || "Workflow Step"}
      subtitle="Standard step"
      badge="STEP"
      icon={<Cpu className="h-5 w-5" />}
      iconBg="bg-[#f4efe8]"
      iconColor="text-[#667085]"
      accentBorder="bg-[#667085]"
      hasInput={true}
      hasOutput={true}
      status={nodeData.status}
    >
      <p className="truncate text-[11px] text-[#8a94a6]">
        {nodeData.description || "Connected workflow node"}
      </p>
    </BaseNode>
  );
});
