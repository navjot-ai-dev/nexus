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

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  nodes: Node[];
  edges: Edge[];
  active: boolean;
};

export default function EditWorkflowPage() {
  const params = useParams();
  const router = useRouter();

  const workflowId = params.id as string;

  const [workflow, setWorkflow] =
    useState<Workflow | null>(null);

  const [nodes, setNodes, onNodesChange] =
    useNodesState<Node>([]);

  const [edges, setEdges, onEdgesChange] =
    useEdgesState<Edge>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const reactFlowWrapper =
    useRef<HTMLDivElement>(null);

  /*
   * LOAD WORKFLOW
   */

  useEffect(() => {
    async function loadWorkflow() {
      try {
        const response = await fetch(
          `/api/nexus/workflows/${workflowId}`,
          {
            credentials: "include",
          },
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load workflow",
          );
        }

        const data = result.data as Workflow;

        setWorkflow(data);

        setNodes((data.nodes ?? []) as Node[]);
        setEdges(data.edges ?? []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load workflow",
        );
      } finally {
        setLoading(false);
      }
    }

    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId, setNodes, setEdges]);

  /*
   * CONNECT NODES
   */

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

  /*
   * SAVE WORKFLOW
   */

  const saveWorkflow = async () => {
    if (!workflow) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/nexus/workflows/${workflowId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",

          body: JSON.stringify({
            name: workflow.name,
            description:
              workflow.description || "",
            nodes,
            edges,
            active: workflow.active,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to save workflow",
        );
      }

      setWorkflow(result.data);

      alert("Workflow saved successfully 🚀");
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to save workflow",
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * DRAG NODES
   */

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

  /*
   * LOADING
   */

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fffdf9]">
        <p className="text-sm text-[#9aa3b2]">
          Loading workflow...
        </p>
      </div>
    );
  }

  /*
   * ERROR
   */

  if (error && !workflow) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fffdf9]">
        <p className="text-sm text-red-500">
          {error}
        </p>

        <button
          onClick={() => router.push("/dashboard")}
          className="mt-4 rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!workflow) return null;

  return (
    <div className="h-screen bg-[#fffdf9] text-[#17202a]">
      {/* HEADER */}

      <header className="flex h-19 items-center justify-between border-b border-[#e9e2d9] bg-white px-6">
        <div>
          <h1 className="text-xl font-bold tracking-[-0.03em]">
            {workflow.name}
          </h1>

          <p className="text-sm text-[#9aa3b2]">
            Edit your workflow
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              router.push("/dashboard")
            }
            className="rounded-xl border border-[#e9e2d9] px-5 py-2.5 text-sm font-medium text-[#667085] transition hover:bg-[#fff0eb]"
          >
            Back
          </button>

          <button
            onClick={saveWorkflow}
            disabled={saving}
            className="rounded-xl bg-[#ff6749] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a] disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}

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
        <div className="absolute left-1/2 top-23 z-50 -translate-x-1/2 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-sm text-red-600 shadow-lg">
          {error}
        </div>
      )}

      <div className="flex h-[calc(100vh-76px)]">
        {/* SIDEBAR */}

        <aside className="w-65 border-r border-[#e9e2d9] bg-white p-5">
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
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa3b2]">
              Description
            </p>

            <p className="text-sm leading-6 text-[#667085]">
              {workflow.description ||
                "No description"}
            </p>
          </div>

          {/* STATUS */}

          <div className="mt-8 rounded-xl border border-[#e9e2d9] bg-[#fffdf9] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#9aa3b2]">
              Status
            </p>

            <div className="mt-2 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  workflow.active
                    ? "bg-green-500"
                    : "bg-gray-300"
                }`}
              />

              <span className="text-sm font-medium">
                {workflow.active
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>
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