"use client";

import React, { useRef, useCallback, memo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  type Connection,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { workflowNodeTypes } from "./nodes";
import type { NexusNode, NodeType } from "@/types/workflow";
import { getNodeDefaultTitle, getNodeDefaultDescription } from "@/schemas/workflow";

interface WorkflowCanvasProps {
  nodes: Node[];
  edges: Edge[];
  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange<Edge>;
  onConnect: (connection: Connection) => void;
  onNodeClick: (node: NexusNode) => void;
  onPaneClick: () => void;
  onDropNode: (type: NodeType, position: { x: number; y: number }) => void;
  setReactFlowInstance: (instance: ReactFlowInstance) => void;
}

export const WorkflowCanvas = memo(function WorkflowCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
  onDropNode,
  setReactFlowInstance,
}: WorkflowCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData("application/nexus-node") as NodeType;
      if (!nodeType || !reactFlowWrapper.current) return;

      const bounds = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - bounds.left - 130,
        y: event.clientY - bounds.top - 40,
      };

      onDropNode(nodeType, position);
    },
    [onDropNode],
  );

  return (
    <main
      ref={reactFlowWrapper}
      className="relative flex-1 h-full w-full bg-[#faf7f2]"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={workflowNodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={(_, node) => onNodeClick(node as NexusNode)}
        onPaneClick={onPaneClick}
        onInit={setReactFlowInstance}
        fitView
        snapToGrid
        snapGrid={[16, 16]}
        defaultEdgeOptions={{
          animated: true,
          style: { stroke: "#ff6749", strokeWidth: 2 },
        }}
        proOptions={{ hideAttribution: true }}
      >
        <Background gap={24} size={1.5} color="#e6dfd5" />
        <Controls
          className="!bg-white !border !border-[#e9e2d9] !rounded-xl !shadow-md !overflow-hidden"
          showInteractive={false}
        />
        <MiniMap
          className="!bg-white/90 !border !border-[#e9e2d9] !rounded-2xl !shadow-md !overflow-hidden"
          nodeColor={(n) => {
            const t = n.type || (n.data as any)?.type;
            if (t === "webhook") return "#ff6749";
            if (t === "ai") return "#2a9d8f";
            if (t === "http") return "#0284c7";
            if (t === "database") return "#7c3aed";
            return "#a1a1aa";
          }}
          maskColor="rgba(244, 239, 232, 0.6)"
        />
      </ReactFlow>
    </main>
  );
});
