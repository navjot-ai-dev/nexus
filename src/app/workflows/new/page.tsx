"use client";

import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { useCallback } from "react";

const initialNodes: Node[] = [
  {
    id: "trigger-1",
    position: { x: 100, y: 180 },
    data: {
      label: "Webhook Trigger",
    },
    style: {
      background: "#fffdf9",
      border: "1px solid #e9e2d9",
      borderRadius: "16px",
      padding: "16px",
      width: 190,
      boxShadow: "0 10px 30px rgba(30,41,59,0.08)",
    },
  },
];

const initialEdges: Edge[] = [];

export default function NewWorkflowPage() {
  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(connection, currentEdges),
      );
    },
    [setEdges],
  );

  return (
    <div className="h-screen bg-[#fffdf9] text-[#17202a]">
      {/* Header */}
      <header className="flex h-[76px] items-center justify-between border-b border-[#e9e2d9] bg-white px-6">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.03em]">
            New Workflow
          </h1>

          <p className="text-sm text-[#9aa3b2]">
            Build your automation visually
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-[#e9e2d9] px-5 py-2.5 text-sm font-medium text-[#667085] transition hover:bg-[#fff0eb]">
            Cancel
          </button>

          <button className="rounded-xl bg-[#ff6749] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]">
            Save Workflow
          </button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-76px)]">
        {/* Sidebar */}
        <aside className="w-[260px] border-r border-[#e9e2d9] bg-white p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa3b2]">
            Nodes
          </p>

          <div className="space-y-3">
            <NodeButton
              title="Webhook"
              description="Start from an HTTP request"
            />

            <NodeButton
              title="AI Processor"
              description="Process data with AI"
            />

            <NodeButton
              title="HTTP Request"
              description="Call an external API"
            />

            <NodeButton
              title="Database"
              description="Read or write data"
            />
          </div>
        </aside>

        {/* Canvas */}
        <main className="relative flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
          >
            <Background gap={20} />

            <Controls />

            <MiniMap />
          </ReactFlow>
        </main>
      </div>
    </div>
  );
}

function NodeButton({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <button className="w-full rounded-2xl border border-[#e9e2d9] bg-[#fffdf9] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#ffb5a5] hover:bg-[#fff0eb]">
      <div className="text-sm font-semibold text-[#17202a]">
        {title}
      </div>

      <div className="mt-1 text-xs leading-5 text-[#9aa3b2]">
        {description}
      </div>
    </button>
  );
}
