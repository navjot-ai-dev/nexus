"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Play,
  RotateCw,
  Search,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Trash2,
  Power,
  Workflow,
  Layers,
  AlertCircle,
  Activity,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";
import type { WorkflowRecord } from "@/types/workflow";

interface StatsData {
  totalWorkflows: number;
  activeWorkflows: number;
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [workflows, setWorkflows] = useState<WorkflowRecord[]>([]);
  const [stats, setStats] = useState<StatsData>({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successfulExecutions: 0,
    failedExecutions: 0,
  });

  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Modal state for delete confirmation
  const [deleteModalId, setDeleteModalId] = useState<string | null>(null);
  const [executingId, setExecutingId] = useState<string | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setLoading(true);
      setError("");

      const [wfRes, statsRes] = await Promise.all([
        fetch("/api/nexus/workflows", { credentials: "include" }),
        fetch("/api/nexus/stats", { credentials: "include" }),
      ]);

      const wfData = await wfRes.json();
      if (!wfRes.ok) throw new Error(wfData.message || "Failed to load workflows");
      setWorkflows(wfData.data || []);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboardData(false);
  }, [loadDashboardData]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  /* =========================================
     TOGGLE ACTIVE / INACTIVE
  ========================================= */
  const toggleWorkflow = async (id: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/nexus/workflows/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ active: !currentActive }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setWorkflows((prev) =>
        prev.map((w) =>
          w.id === id ? { ...w, active: !currentActive, updatedAt: new Date().toISOString() } : w,
        ),
      );

      setStats((prev) => ({
        ...prev,
        activeWorkflows: currentActive ? prev.activeWorkflows - 1 : prev.activeWorkflows + 1,
      }));

      showToast(currentActive ? "Workflow deactivated" : "Workflow activated");
    } catch (err: any) {
      showToast(err.message || "Could not toggle status", "error");
    }
  };

  /* =========================================
     DELETE WORKFLOW
  ========================================= */
  const confirmDelete = async () => {
    if (!deleteModalId) return;

    try {
      const res = await fetch(`/api/nexus/workflows/${deleteModalId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setWorkflows((prev) => prev.filter((w) => w.id !== deleteModalId));
      setDeleteModalId(null);
      showToast("Workflow deleted successfully");
    } catch (err: any) {
      showToast(err.message || "Failed to delete workflow", "error");
    }
  };

  /* =========================================
     QUICK EXECUTE FROM DASHBOARD
  ========================================= */
  const quickExecute = async (id: string, active: boolean) => {
    if (!active) {
      showToast("Activate the workflow before executing", "error");
      return;
    }

    try {
      setExecutingId(id);
      const res = await fetch(`/api/nexus/workflows/${id}/execute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ input: {} }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      showToast("Execution completed successfully! 🚀");
      loadDashboardData(false);
    } catch (err: any) {
      showToast(err.message || "Execution failed", "error");
    } finally {
      setExecutingId(null);
    }
  };

  /* =========================================
     FILTER & SEARCH
  ========================================= */
  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      const matchesSearch =
        w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (w.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (filterStatus === "active") return matchesSearch && w.active;
      if (filterStatus === "inactive") return matchesSearch && !w.active;
      return matchesSearch;
    });
  }, [workflows, searchQuery, filterStatus]);

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 pb-24 selection:bg-slate-900 selection:text-white">
      {/* Top Navigation bar */}
      <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 px-6 py-3.5 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 shadow-md">
              <div className="h-3 w-3 rounded-full bg-indigo-500" />
              <div className="absolute h-5 w-5 rounded-full border border-white/20" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-950">NEXUS</span>
              <span className="ml-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                Workspace
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-slate-950 transition px-3 py-1.5 rounded-lg hover:bg-slate-100"
            >
              Documentation
            </Link>

            <button
              onClick={() => loadDashboardData(true)}
              disabled={loading}
              title="Refresh Data"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition shadow-2xs disabled:opacity-50"
            >
              <RotateCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>

            <Link
              href="/workflows/new"
              className="flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Workflow</span>
            </Link>

            <button
              onClick={async () => {
                await authClient.signOut();
                router.push("/sign-in");
              }}
              title="Sign Out"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-rose-600 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-6 pt-10">
        {/* Header Greeting */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950">
              {getGreeting()}, {session?.user?.name ? session.user.name.split(" ")[0] : "Architect"}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Visual orchestration, live telemetry, and topological execution pipelines.
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-6 flex items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700">
            <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            title="Total Workflows"
            value={stats.totalWorkflows}
            icon={<Workflow className="h-4 w-4 text-indigo-600" />}
            bg="bg-indigo-50"
          />
          <StatCard
            title="Active Workflows"
            value={stats.activeWorkflows}
            icon={<Power className="h-4 w-4 text-emerald-600" />}
            bg="bg-emerald-50"
          />
          <StatCard
            title="Total Executions"
            value={stats.totalExecutions}
            icon={<Activity className="h-4 w-4 text-sky-600" />}
            bg="bg-sky-50"
          />
          <StatCard
            title="Successful"
            value={stats.successfulExecutions}
            icon={<CheckCircle2 className="h-4 w-4 text-emerald-600" />}
            bg="bg-emerald-50"
          />
          <StatCard
            title="Failed"
            value={stats.failedExecutions}
            icon={<XCircle className="h-4 w-4 text-rose-600" />}
            bg="bg-rose-50"
          />
        </div>

        {/* Workflows Management Section */}
        <div className="mt-12">
          {/* Controls: Search and Filter */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-5">
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-bold text-slate-950">Workflow Pipelines</h2>
              <span className="rounded-full bg-slate-200/70 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-700">
                {filteredWorkflows.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search workflows by name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center rounded-xl border border-slate-200 bg-white p-1 text-xs shadow-2xs">
                <SlidersHorizontal className="h-3.5 w-3.5 ml-2 mr-1 text-slate-400 hidden sm:block" />
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "all"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "active"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "inactive"
                      ? "bg-slate-950 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  Inactive
                </button>
              </div>
            </div>
          </div>

          {/* Workflow List */}
          {loading ? (
            <div className="mt-6 grid gap-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 rounded-2xl border border-slate-200 bg-white p-5 animate-pulse"
                />
              ))}
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-slate-200 bg-white p-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                <Workflow className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">
                {searchQuery ? "No matching workflows found" : "No workflows created yet"}
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-500">
                {searchQuery
                  ? "Try searching for a different keyword or reset your status filter."
                  : "Create your first workflow to orchestrate AI models, APIs, and triggers."}
              </p>
              {!searchQuery && (
                <Link
                  href="/workflows/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-slate-800 transition"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Workflow
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-3.5">
              {filteredWorkflows.map((wf) => {
                const nodeCount = Array.isArray(wf.nodes) ? wf.nodes.length : 0;
                const edgeCount = Array.isArray(wf.edges) ? wf.edges.length : 0;
                const isExecuting = executingId === wf.id;

                return (
                  <div
                    key={wf.id}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md md:flex-row md:items-center"
                  >
                    {/* Left: Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <Link
                          href={`/workflows/${wf.id}`}
                          className="truncate text-base font-bold text-slate-950 hover:text-indigo-600 transition"
                        >
                          {wf.name}
                        </Link>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            wf.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              wf.active ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          />
                          {wf.active ? "Active" : "Inactive"}
                        </span>

                        {wf.lastExecution && (
                          <span
                            className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold font-mono ${
                              wf.lastExecution.status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : wf.lastExecution.status === "failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            Last: {wf.lastExecution.status}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                        {wf.description || "No description provided"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-slate-600">
                          <Layers className="h-3.5 w-3.5 text-indigo-500" />
                          {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
                        </span>
                        <span>•</span>
                        <span>
                          {edgeCount} {edgeCount === 1 ? "edge" : "edges"}
                        </span>
                        <span>•</span>
                        <span>Updated {formatDate(wf.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {/* Activate / Deactivate switch */}
                      <button
                        onClick={() => toggleWorkflow(wf.id, wf.active)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                          wf.active
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {wf.active ? "Deactivate" : "Activate"}
                      </button>

                      {/* Quick Execute */}
                      <button
                        onClick={() => quickExecute(wf.id, wf.active)}
                        disabled={isExecuting || !wf.active}
                        title={wf.active ? "Run workflow now" : "Activate workflow to execute"}
                        className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-900 transition hover:bg-slate-50 hover:border-slate-300 disabled:opacity-40 shadow-2xs"
                      >
                        {isExecuting ? (
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current text-indigo-600" />
                        )}
                        <span>{isExecuting ? "Running" : "Run"}</span>
                      </button>

                      {/* Open in Builder */}
                      <Link
                        href={`/workflows/${wf.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-slate-800"
                      >
                        <span>Open Canvas</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteModalId(wf.id)}
                        title="Delete workflow"
                        className="rounded-xl border border-rose-200 p-2 text-rose-600 transition hover:bg-rose-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-950">
              Delete this workflow?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              This action is permanent and cannot be undone. All execution history and logs for this workflow will be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
              >
                Delete Workflow
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border px-5 py-3 text-xs font-semibold shadow-xl transition-all animate-in slide-in-from-bottom duration-200 ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          ) : (
            <AlertCircle className="h-4 w-4 text-rose-600" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
  bg,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:shadow-xs transition">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">{title}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight text-slate-950">
        {value}
      </div>
    </div>
  );
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "Recent";
  }
}
