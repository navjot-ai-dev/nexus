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

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

export default function NewWorkflowPage() {
  const router = useRouter();

  const [nodes, setNodes, onNodesChange] =
    useNodesState(initialNodes);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState(initialEdges);

  const [workflowName, setWorkflowName] =
    useState("Untitled Workflow");

  const [description, setDescription] =
    useState("");

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const reactFlowWrapper =
    useRef<HTMLDivElement>(null);

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((currentEdges) =>
        addEdge(
          {
            ...connection,
            animated: true,
          },
          currentEdges,
        ),
      );
    },
    [setEdges],
  );

  const onDragStart = (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
  ) => {
    event.dataTransfer.setData(
      "application/reactflow",
      nodeType,
    );

    event.dataTransfer.effectAllowed = "move";
  };

  const onDragOver = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    },
    [],
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData(
        "application/reactflow",
      );

      if (!type || !reactFlowWrapper.current) {
        return;
      }

      const bounds =
        reactFlowWrapper.current.getBoundingClientRect();

      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type: "default",
        position,
        data: {
          label: getNodeLabel(type),
        },
        style: getNodeStyle(type),
      };

      setNodes((currentNodes) => [
        ...currentNodes,
        newNode,
      ]);
    },
    [setNodes],
  );

  const saveWorkflow = async () => {
    setError("");

    if (!workflowName.trim()) {
      setError("Please enter a workflow name.");
      return;
    }

    if (nodes.length === 0) {
      setError("Add at least one node to your workflow.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/nexus/workflows",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: workflowName.trim(),
            description: description.trim(),
            nodes,
            edges,
            active: false,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save workflow.",
        );
      }

      console.log(
        "Workflow created:",
        result.data,
      );

      router.push("/dashboard");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen bg-[#fffdf9] text-[#17202a]">
      {/* HEADER */}

      <header className="flex h-[76px] items-center justify-between border-b border-[#e9e2d9] bg-white px-6">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-[-0.03em]">
              New Workflow
            </h1>

            <p className="text-sm text-[#9aa3b2]">
              Build your automation visually
            </p>
          </div>

          {/* WORKFLOW NAME */}

          <input
            value={workflowName}
            onChange={(event) =>
              setWorkflowName(event.target.value)
            }
            className="ml-4 w-[260px] rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-2.5 text-sm outline-none transition focus:border-[#ff6749]"
            placeholder="Workflow name"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/dashboard")}
            className="rounded-xl border border-[#e9e2d9] px-5 py-2.5 text-sm font-medium text-[#667085] transition hover:bg-[#fff0eb]"
          >
            Cancel
          </button>

          <button
            onClick={saveWorkflow}
            disabled={saving}
            className="rounded-xl bg-[#ff6749] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Workflow"}

            {!saving && (
              <span className="ml-2">
                →
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ERROR */}

      {error && (
        <div className="absolute left-1/2 top-[92px] z-50 -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600 shadow-lg">
          {error}
        </div>
      )}

      <div className="flex h-[calc(100vh-76px)]">
        {/* SIDEBAR */}

        <aside className="w-[260px] border-r border-[#e9e2d9] bg-white p-5">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-[#9aa3b2]">
            Nodes
          </p>

          <div className="space-y-3">
            <NodeButton
              title="Webhook"
              description="Start from an HTTP request"
              type="webhook"
              onDragStart={onDragStart}
            />

            <NodeButton
              title="AI Processor"
              description="Process data with AI"
              type="ai"
              onDragStart={onDragStart}
            />

            <NodeButton
              title="HTTP Request"
              description="Call an external API"
              type="http"
              onDragStart={onDragStart}
            />

            <NodeButton
              title="Database"
              description="Read or write data"
              type="database"
              onDragStart={onDragStart}
            />
          </div>

          {/* DESCRIPTION */}

          <div className="mt-8">
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa3b2]">
              Description
            </label>

            <textarea
              value={description}
              onChange={(event) =>
                setDescription(event.target.value)
              }
              placeholder="What does this workflow do?"
              rows={4}
              className="w-full resize-none rounded-xl border border-[#e9e2d9] bg-[#fffdf9] p-3 text-sm outline-none transition focus:border-[#ff6749]"
            />
          </div>
        </aside>

        {/* CANVAS */}

        <main
          ref={reactFlowWrapper}
          className="relative flex-1"
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
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
  type,
  onDragStart,
}: {
  title: string;
  description: string;
  type: string;
  onDragStart: (
    event: React.DragEvent<HTMLButtonElement>,
    nodeType: string,
  ) => void;
}) {
  return (
    <button
      draggable
      onDragStart={(event) =>
        onDragStart(event, type)
      }
      className="w-full cursor-grab rounded-2xl border border-[#e9e2d9] bg-[#fffdf9] p-4 text-left transition hover:-translate-y-0.5 hover:border-[#ffb5a5] hover:bg-[#fff0eb] active:cursor-grabbing"
    >
      <div className="text-sm font-semibold text-[#17202a]">
        {title}
      </div>

      <div className="mt-1 text-xs leading-5 text-[#9aa3b2]">
        {description}
      </div>
    </button>
  );
}

function getNodeLabel(type: string) {
  switch (type) {
    case "webhook":
      return "Webhook";

    case "ai":
      return "AI Processor";

    case "http":
      return "HTTP Request";

    case "database":
      return "Database";

    default:
      return "Node";
  }
}

function getNodeStyle(type: string) {
  const base = {
    border: "1px solid #e9e2d9",
    borderRadius: "16px",
    padding: "16px",
    width: 190,
    boxShadow:
      "0 10px 30px rgba(30,41,59,0.08)",
  };

  switch (type) {
    case "webhook":
      return {
        ...base,
        background: "#fffdf9",
      };

    case "ai":
      return {
        ...base,
        background: "#fff0eb",
      };

    case "http":
      return {
        ...base,
        background: "#f3f8f7",
      };

    case "database":
      return {
        ...base,
        background: "#f7f4ff",
      };

    default:
      return {
        ...base,
        background: "#fffdf9",
      };
  }
}