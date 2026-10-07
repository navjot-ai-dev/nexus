"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCw,
  ChevronRight,
  ChevronDown,
  Terminal,
  Activity,
  FileText,
  AlertTriangle,
} from "lucide-react";
import type { NodeExecutionStep, WorkflowExecutionOutput } from "@/types/workflow";

interface ExecutionRecord {
  id: string;
  workflowId: string;
  status: "pending" | "running" | "completed" | "failed";
  input: unknown;
  output: WorkflowExecutionOutput | any;
  error?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  createdAt: string;
}

interface ExecutionHistoryDrawerProps {
  workflowId: string;
  isOpen: boolean;
  onClose: () => void;
  selectedExecutionId?: string | null;
}

export function ExecutionHistoryDrawer({
  workflowId,
  isOpen,
  onClose,
  selectedExecutionId,
}: ExecutionHistoryDrawerProps) {
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeExecution, setActiveExecution] = useState<ExecutionRecord | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && workflowId) {
      loadHistory();
    }
  }, [isOpen, workflowId]);

  useEffect(() => {
    if (selectedExecutionId && executions.length > 0) {
      const match = executions.find((e) => e.id === selectedExecutionId);
      if (match) setActiveExecution(match);
    }
  }, [selectedExecutionId, executions]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/nexus/workflows/${workflowId}/executions`, {
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setExecutions(data.data || []);
        if (selectedExecutionId) {
          const match = (data.data || []).find((e: any) => e.id === selectedExecutionId);
          if (match) setActiveExecution(match);
        } else if (data.data && data.data.length > 0 && !activeExecution) {
          setActiveExecution(data.data[0]);
        }
      }
    } catch (err) {
      console.error("Failed to load executions history", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleNodeExpansion = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-xl flex-col border-l border-[#e9e2d9] bg-white shadow-2xl animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e9e2d9] px-6 py-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-[#ff6749]" />
          <div>
            <h2 className="text-base font-bold text-[#17202a]">Execution History</h2>
            <p className="text-xs text-[#8a94a6]">Inspect runs, node outputs & logs</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadHistory}
            disabled={loading}
            title="Refresh history"
            className="rounded-lg p-2 text-[#8a94a6] hover:bg-[#f4efe8] hover:text-[#17202a] disabled:opacity-50"
          >
            <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-[#8a94a6] hover:bg-[#f4efe8] hover:text-[#17202a]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left column: Run List */}
        <div className="w-56 border-r border-[#e9e2d9] bg-[#fffdf9] overflow-y-auto p-3 space-y-2">
          <p className="px-2 text-[10px] font-bold uppercase tracking-wider text-[#8a94a6]">
            Recent Runs ({executions.length})
          </p>

          {executions.length === 0 && !loading && (
            <div className="p-4 text-center text-xs text-[#8a94a6]">
              No executions yet. Run this workflow to see live logs!
            </div>
          )}

          {executions.map((exec) => {
            const isSelected = activeExecution?.id === exec.id;
            return (
              <button
                key={exec.id}
                onClick={() => setActiveExecution(exec)}
                className={`w-full rounded-xl p-3 text-left transition-all ${
                  isSelected
                    ? "border border-[#ff6749] bg-white shadow-sm"
                    : "border border-transparent hover:bg-white hover:border-[#e9e2d9]"
                }`}
              >
                <div className="flex items-center justify-between">
                  <StatusBadge status={exec.status} />
                  <span className="text-[10px] text-[#8a94a6]">
                    {formatRelativeTime(exec.createdAt)}
                  </span>
                </div>
                <div className="mt-1 font-mono text-[10px] text-[#667085] truncate">
                  ID: {exec.id.slice(0, 8)}...
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column: Execution Details & Node-by-Node logs */}
        <div className="flex-1 overflow-y-auto p-6 text-xs">
          {activeExecution ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="rounded-2xl border border-[#e9e2d9] bg-[#fffdf9] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={activeExecution.status} />
                    <span className="font-mono text-xs text-[#667085]">
                      {activeExecution.id}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#f4efe8] text-[11px]">
                  <div>
                    <span className="text-[#8a94a6]">Started:</span>{" "}
                    <span className="font-medium text-[#17202a]">
                      {activeExecution.startedAt
                        ? new Date(activeExecution.startedAt).toLocaleTimeString()
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8a94a6]">Completed:</span>{" "}
                    <span className="font-medium text-[#17202a]">
                      {activeExecution.completedAt
                        ? new Date(activeExecution.completedAt).toLocaleTimeString()
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8a94a6]">Duration:</span>{" "}
                    <span className="font-medium text-[#17202a]">
                      {activeExecution.output?.totalDurationMs
                        ? `${activeExecution.output.totalDurationMs} ms`
                        : "—"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#8a94a6]">Nodes:</span>{" "}
                    <span className="font-medium text-[#17202a]">
                      {activeExecution.output?.nodes?.length || 0} executed
                    </span>
                  </div>
                </div>

                {activeExecution.error && (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <AlertTriangle className="h-4 w-4" />
                      Execution Error
                    </div>
                    <p className="mt-1 font-mono text-[11px]">{activeExecution.error}</p>
                  </div>
                )}
              </div>

              {/* Node-by-node steps */}
              <div>
                <h3 className="mb-3 font-bold text-sm text-[#17202a]">Node Execution Steps</h3>

                {Array.isArray(activeExecution.output?.nodes) &&
                activeExecution.output.nodes.length > 0 ? (
                  <div className="space-y-3">
                    {activeExecution.output.nodes.map(
                      (step: NodeExecutionStep, idx: number) => {
                        const isExpanded = !!expandedNodes[step.nodeId];
                        return (
                          <div
                            key={step.nodeId || idx}
                            className="rounded-xl border border-[#e9e2d9] bg-white overflow-hidden shadow-xs"
                          >
                            <div
                              onClick={() => toggleNodeExpansion(step.nodeId)}
                              className="flex cursor-pointer items-center justify-between p-3.5 hover:bg-[#faf7f2] transition"
                            >
                              <div className="flex items-center gap-2.5">
                                <StepStatusIcon status={step.status} />
                                <div>
                                  <span className="font-bold text-[#17202a]">
                                    {step.nodeLabel || step.nodeType}
                                  </span>
                                  <span className="ml-2 font-mono text-[10px] uppercase text-[#8a94a6]">
                                    [{step.nodeType}]
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {step.durationMs !== undefined && (
                                  <span className="font-mono text-[11px] text-[#8a94a6]">
                                    {step.durationMs}ms
                                  </span>
                                )}
                                {isExpanded ? (
                                  <ChevronDown className="h-4 w-4 text-[#8a94a6]" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-[#8a94a6]" />
                                )}
                              </div>
                            </div>

                            {/* Expanded Details: Logs, Input, Output */}
                            {isExpanded && (
                              <div className="border-t border-[#f4efe8] bg-[#fffdf9] p-4 space-y-3">
                                {/* Logs */}
                                {step.logs && step.logs.length > 0 && (
                                  <div>
                                    <div className="flex items-center gap-1.5 font-semibold text-[#17202a] mb-1.5">
                                      <Terminal className="h-3.5 w-3.5 text-[#ff6749]" />
                                      Step Logs
                                    </div>
                                    <div className="rounded-xl bg-[#17202a] p-3 font-mono text-[11px] text-[#e0e7ff] space-y-1">
                                      {step.logs.map((log, lIdx) => (
                                        <div key={lIdx} className="leading-relaxed">
                                          {log}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Output */}
                                <div>
                                  <div className="flex items-center gap-1.5 font-semibold text-[#17202a] mb-1">
                                    <FileText className="h-3.5 w-3.5 text-[#2a9d8f]" />
                                    Output
                                  </div>
                                  <pre className="max-h-48 overflow-y-auto rounded-xl border border-[#e9e2d9] bg-white p-3 font-mono text-[11px] text-[#475467]">
                                    {JSON.stringify(step.output, null, 2)}
                                  </pre>
                                </div>

                                {/* Error if present */}
                                {step.error && (
                                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-rose-700">
                                    <span className="font-semibold">Error:</span> {step.error}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      },
                    )}
                  </div>
                ) : (
                  <div className="rounded-xl border border-dashed border-[#e9e2d9] p-6 text-center text-xs text-[#8a94a6]">
                    No detailed node breakdown found for this execution.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-[#8a94a6]">
              Select a run from the left panel to inspect details.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          <CheckCircle2 className="h-3 w-3" />
          Completed
        </span>
      );
    case "failed":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700">
          <XCircle className="h-3 w-3" />
          Failed
        </span>
      );
    case "running":
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700">
          <RotateCw className="h-3 w-3 animate-spin" />
          Running
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-bold text-gray-700">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
  }
}

function StepStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    case "failed":
      return <XCircle className="h-4 w-4 text-rose-500" />;
    case "running":
      return <RotateCw className="h-4 w-4 text-amber-500 animate-spin" />;
    default:
      return <Clock className="h-4 w-4 text-gray-300" />;
  }
}

function formatRelativeTime(dateString: string): string {
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return "Recent";
  }
}
