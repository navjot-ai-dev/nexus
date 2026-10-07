"use client";

import React, { memo } from "react";
import type { NodeProps } from "@xyflow/react";
import { Webhook } from "lucide-react";
import { BaseNode } from "./BaseNode";
import type { CustomNodeData, WebhookNodeConfig } from "@/types/workflow";

export const WebhookNode = memo(function WebhookNode({
  id,
  data,
  selected,
}: NodeProps) {
  const nodeData = (data || {}) as CustomNodeData;
  const config = (nodeData.config || {}) as WebhookNodeConfig;
  const path = config.path || "/api/v1/trigger";
  const method = config.method || "POST";

  return (
    <BaseNode
      id={id}
      selected={selected}
      type="webhook"
      title={nodeData.label || "Webhook Trigger"}
      subtitle="Entrypoint trigger"
      badge={method}
      icon={<Webhook className="h-5 w-5" />}
      iconBg="bg-[#fff0eb]"
      iconColor="text-[#ff6749]"
      accentBorder="bg-[#ff6749]"
      hasInput={false}
      hasOutput={true}
      status={nodeData.status}
    >
      <div className="flex items-center justify-between text-xs font-mono text-[#667085]">
        <span className="font-semibold text-[#17202a]">{method}</span>
        <span className="truncate max-w-[170px] text-[#8a94a6]">{path}</span>
      </div>
    </BaseNode>
  );
});
