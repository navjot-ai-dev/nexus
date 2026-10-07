"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Database } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { CustomNodeData, DatabaseNodeConfig } from "@/types/workflow";

export const DatabaseNode = memo(function DatabaseNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = (data || {}) as CustomNodeData;
  const config = (nodeData.config || {}) as DatabaseNodeConfig;
  const operation = config.operation || "SELECT";
  const table = config.table || "workflow_records";

  return (
    <BaseNode
      id={id}
      selected={selected}
      type="database"
      title={nodeData.label || "Database Query"}
      subtitle="Persistent storage"
      badge={operation}
      icon={<Database className="h-5 w-5" />}
      iconBg="bg-[#f5f3ff]"
      iconColor="text-[#7c3aed]"
      accentBorder="bg-[#7c3aed]"
      hasInput={true}
      hasOutput={true}
      status={nodeData.status}
    >
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="font-semibold text-[#7c3aed]">{operation}</span>
        <span className="truncate text-[#667085]">table: {table}</span>
      </div>
    </BaseNode>
  );
});
