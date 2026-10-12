"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from "@xyflow/react";

import { WorkflowCanvas } from "@/components/workflow/WorkflowCanvas";
import { NodePanel } from "@/components/workflow/NodePanel";
import { NodeConfigPanel } from "@/components/workflow/NodeConfigPanel";
import { WorkflowToolbar } from "@/components/workflow/WorkflowToolbar";
import { ExecutionHistoryDrawer } from "@/components/workflow/ExecutionHistoryDrawer";
import {
  normalizeWorkflowNodes,
  getNodeDefaultTitle,
  getNodeDefaultDescription,
} from "@/schemas/workflow";
import type { NexusNode, NodeType, WorkflowRecord } from "@/types/workflow";
import { Check, AlertCircle, Loader2 } from "lucide-react";

export default function EditWorkflowPage() {
  const params = useParams();
  const router = useRouter();
  const workflowId = params.id as string;

  const [workflow, setWorkflow] = useState<WorkflowRecord | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const [selectedNode, setSelectedNode] = useState<NexusNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [latestExecutionId, setLatestExecutionId] = useState<string | null>(null);

  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  /* =========================================
     LOAD WORKFLOW
  ========================================= */
  useEffect(() => {
    async function loadWorkflow() {
      try {
        setLoading(true);
        const res = await fetch(`/api/nexus/workflows/${workflowId}`, {
          credentials: "include",
        });

        const result = await res.json();
        if (!res.ok) {
          throw new Error(result.message || "Failed to load workflow");
        }

        const data = result.data as WorkflowRecord;
        setWorkflow(data);

        const normalized = normalizeWorkflowNodes(data.nodes || []);
        setNodes(normalized);
        setEdges((data.edges || []) as Edge[]);
      } catch (err: any) {
        showToast("error", err.message || "Error loading workflow");
      } finally {
        setLoading(false);
      }
    }

    if (workflowId) {
      loadWorkflow();
    }
  }, [workflowId, setNodes, setEdges]);

  /* =========================================
     CONNECT EDGES
  ========================================= */
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#ff6749", strokeWidth: 2 },
          },
          eds,
        ),
      );
      setHasUnsavedChanges(true);
    },
    [setEdges],
  );

  /* =========================================
     NODE SELECTION & CANVAS CLICKS
  ========================================= */
  const onNodeClick = useCallback(
    (node: NexusNode) => {
      setSelectedNode(node);
    },
    [],
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  /* =========================================
     ADD NODE (via click or drop)
  ========================================= */
  const addNodeToCanvas = useCallback(
    (type: NodeType, position?: { x: number; y: number }) => {
      const pos = position || {
        x: (nodes.length % 3) * 280 + 120,
        y: Math.floor(nodes.length / 3) * 160 + 100,
      };

      const defaultConfigs: Record<NodeType, any> = {
        webhook: {
          webhookName: "webhook_trigger",
          method: "POST",
          path: "/api/v1/trigger",
        },
        ai: {
          provider: "gemini",
          model: "gemini-1.5-flash",
          prompt: "Analyze the incoming data and produce a summary.",
          temperature: 0.7,
        },
        http: {
          method: "GET",
          url: "https://httpbin.org/anything",
          headers: {},
        },
        database: {
          operation: "SELECT",
          table: "workflow_records",
        },
        default: {},
      };

      const newNode: NexusNode = {
        id: `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        position: pos,
        data: {
          label: getNodeDefaultTitle(type),
          description: getNodeDefaultDescription(type),
          type,
          config: defaultConfigs[type] || {},
          status: "idle",
        },
      };

      setNodes((current) => [...current, newNode]);
      setSelectedNode(newNode);
      setHasUnsavedChanges(true);
      showToast("success", `Added ${newNode.data?.label || type} node`);
    },
    [nodes.length, setNodes],
  );

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData("application/nexus-node", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  /* =========================================
     UPDATE / DELETE / DUPLICATE NODES
  ========================================= */
  const onUpdateNode = useCallback(
    (nodeId: string, updatedData: Partial<NexusNode["data"]>) => {
      setNodes((current) =>
        current.map((n) => {
          if (n.id === nodeId) {
            const updated = {
              ...n,
              data: {
                ...n.data,
                ...updatedData,
              },
            };
            setSelectedNode(updated as NexusNode);
            return updated;
          }
          return n;
        }),
      );
      setHasUnsavedChanges(true);
    },
    [setNodes],
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((current) => current.filter((n) => n.id !== nodeId));
      setEdges((current) => current.filter((e) => e.source !== nodeId && e.target !== nodeId));
      if (selectedNode?.id === nodeId) {
        setSelectedNode(null);
      }
      setHasUnsavedChanges(true);
      showToast("success", "Node removed");
    },
    [selectedNode, setNodes, setEdges],
  );

  const onDuplicateNode = useCallback(
    (nodeToDup: NexusNode) => {
      const newNode: NexusNode = {
        ...nodeToDup,
        id: `${nodeToDup.type}_${Date.now()}`,
        position: {
          x: nodeToDup.position.x + 40,
          y: nodeToDup.position.y + 40,
        },
        data: {
          ...nodeToDup.data,
          label: `${nodeToDup.data?.label || "Node"} (Copy)`,
        },
      };

      setNodes((current) => [...current, newNode]);
      setSelectedNode(newNode);
      setHasUnsavedChanges(true);
      showToast("success", "Node duplicated");
    },
    [setNodes],
  );

  /* =========================================
     SAVE WORKFLOW
  ========================================= */
  const saveWorkflow = useCallback(async () => {
    if (!workflow) return;

    try {
      setSaving(true);
      const res = await fetch(`/api/nexus/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: workflow.name,
          description: workflow.description || "",
          nodes,
          edges,
          active: workflow.active,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to save workflow");
      }

      setWorkflow(result.data);
      setHasUnsavedChanges(false);
      showToast("success", "Workflow saved successfully 🚀");
    } catch (err: any) {
      showToast("error", err.message || "Error saving workflow");
    } finally {
      setSaving(false);
    }
  }, [workflow, workflowId, nodes, edges]);

  /* =========================================
     EXECUTE WORKFLOW
  ========================================= */
  const executeWorkflow = async () => {
    if (!workflow) return;

    if (!workflow.active) {
      showToast(
        "error",
        "Workflow is inactive. Please activate it before executing.",
      );
      return;
    }

    if (nodes.length === 0) {
      showToast("error", "Add at least one node to execute the workflow.");
      return;
    }

    try {
      setExecuting(true);

      // Temporarily mark nodes as running on the canvas
      setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          data: { ...n.data, status: "running" },
        })),
      );

      const res = await fetch(`/api/nexus/workflows/${workflowId}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ input: {} }),
      });

      const result = await res.json();

      if (!res.ok) {
        // Mark nodes as failed
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, status: "failed" },
          })),
        );
        throw new Error(result.message || "Execution failed");
      }

      const executionData = result.data;
      setLatestExecutionId(executionData.id);

      // Update node statuses on canvas based on node execution steps
      if (Array.isArray(executionData.output?.nodes)) {
        const stepMap = new Map<string, string>();
        for (const step of executionData.output.nodes) {
          stepMap.set(step.nodeId, step.status);
        }

        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: {
              ...n.data,
              status: (stepMap.get(n.id) as any) || "completed",
            },
          })),
        );
      } else {
        setNodes((nds) =>
          nds.map((n) => ({
            ...n,
            data: { ...n.data, status: "completed" },
          })),
        );
      }

      showToast("success", "Workflow executed successfully! Inspecting logs...");
      setIsHistoryOpen(true);
    } catch (err: any) {
      showToast("error", err.message || "Failed to execute workflow");
      setIsHistoryOpen(true);
    } finally {
      setExecuting(false);
    }
  };

  /* =========================================
     TOGGLE ACTIVE / INACTIVE
  ========================================= */
  const toggleActive = async () => {
    if (!workflow) return;
    const newActiveState = !workflow.active;

    try {
      const res = await fetch(`/api/nexus/workflows/${workflowId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: newActiveState }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setWorkflow((prev) => (prev ? { ...prev, active: newActiveState } : prev));
      showToast(
        "success",
        newActiveState ? "Workflow is now Active" : "Workflow set to Inactive",
      );
    } catch (err: any) {
      showToast("error", err.message || "Could not toggle status");
    }
  };

  // Keyboard shortcut Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveWorkflow();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveWorkflow]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fffdf9]">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff6749]" />
        <p className="mt-3 text-sm font-medium text-[#667085]">
          Loading workflow builder...
        </p>
      </div>
    );
  }

  if (!workflow) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-[#fffdf9] p-6 text-center">
        <h2 className="text-xl font-bold text-[#17202a]">Workflow Not Found</h2>
        <p className="mt-2 text-sm text-[#8a94a6]">
          This workflow could not be found or you do not have permission to view it.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-5 rounded-xl bg-[#ff6749] px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#f4573a]"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#fffdf9] text-[#17202a]">
      {/* Top Toolbar */}
      <WorkflowToolbar
        workflowName={workflow.name}
        workflowDescription={workflow.description}
        isActive={workflow.active}
        isSaving={saving}
        isExecuting={executing}
        hasUnsavedChanges={hasUnsavedChanges}
        onNameChange={(name) => {
          setWorkflow((prev) => (prev ? { ...prev, name } : prev));
          setHasUnsavedChanges(true);
        }}
        onDescriptionChange={(description) => {
          setWorkflow((prev) => (prev ? { ...prev, description } : prev));
          setHasUnsavedChanges(true);
        }}
        onToggleActive={toggleActive}
        onSave={saveWorkflow}
        onExecute={executeWorkflow}
        onToggleHistory={() => setIsHistoryOpen((prev) => !prev)}
        onFitView={() => reactFlowInstance.current?.fitView({ padding: 0.2 })}
      />

      {/* Main Builder Layout */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* Left: Node Library */}
        <NodePanel
          onAddNode={(type) => addNodeToCanvas(type)}
          onDragStart={onDragStart}
        />

        {/* Center: React Flow Canvas */}
        <WorkflowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onDropNode={(type, pos) => addNodeToCanvas(type, pos)}
          setReactFlowInstance={(inst) => {
            reactFlowInstance.current = inst;
          }}
        />

        {/* Right: Node Configuration Sidebar */}
        {selectedNode && (
          <NodeConfigPanel
            selectedNode={selectedNode}
            onUpdateNode={onUpdateNode}
            onDeleteNode={onDeleteNode}
            onDuplicateNode={onDuplicateNode}
            onClose={() => setSelectedNode(null)}
          />
        )}
      </div>

      {/* Execution History & Live Logs Drawer */}
      <ExecutionHistoryDrawer
        workflowId={workflowId}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        selectedExecutionId={latestExecutionId}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3.5 text-xs font-semibold shadow-xl transition-all animate-in slide-in-from-bottom duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}