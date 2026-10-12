"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Plus,
  Play,
  RotateCw,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  Trash2,
  ExternalLink,
  Power,
  Workflow,
  Sparkles,
  Layers,
  AlertCircle,
  Activity,
  BarChart3,
  LogOut,
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
  const { data: session, isPending: isAuthPending } = authClient.useSession();

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

  const loadDashboardData = async () => {
    try {
      setLoading(true);
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
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
      loadDashboardData();
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
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a] pb-24">
      {/* Top Navigation bar */}
      <nav className="border-b border-[#e9e2d9] bg-white px-6 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[#17202a] shadow-md">
              <div className="h-3.5 w-3.5 rounded-full bg-[#ff6749]" />
              <div className="absolute h-6 w-6 rounded-full border border-white/20" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-[#17202a]">NEXUS</span>
              <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-[#8a94a6]">
                Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/docs"
              className="hidden sm:inline text-xs font-semibold text-[#667085] hover:text-[#17202a] transition"
            >
              Documentation
            </Link>

            <Link
              href="/workflows/new"
              className="flex items-center gap-2 rounded-xl bg-[#ff6749] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
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
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e9e2d9] text-[#667085] hover:bg-[#fff0eb] hover:text-[#ff6749] transition"
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
            <h1 className="text-3xl font-extrabold tracking-tight text-[#17202a]">
              {getGreeting()}, {session?.user?.name ? session.user.name.split(" ")[0] : "Builder"}
            </h1>
            <p className="mt-1 text-sm text-[#8a94a6]">
              Build, automate, and orchestrate your intelligent workflows.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-5">
          <StatCard
            title="Total Workflows"
            value={stats.totalWorkflows}
            icon={<Workflow className="h-4 w-4 text-[#ff6749]" />}
            bg="bg-[#fff0eb]"
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
            icon={<Activity className="h-4 w-4 text-[#0284c7]" />}
            bg="bg-[#eff8ff]"
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-[#17202a]">All Workflows</h2>
              <span className="rounded-full bg-[#f4efe8] px-2.5 py-0.5 text-xs font-bold text-[#667085]">
                {filteredWorkflows.length}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[240px]">
                <Search className="absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#8a94a6]" />
                <input
                  type="text"
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[#e9e2d9] bg-white pl-9 pr-4 py-2 text-xs outline-none focus:border-[#ff6749] focus:ring-1 focus:ring-[#ff6749]"
                />
              </div>

              {/* Status Filter */}
              <div className="flex rounded-xl border border-[#e9e2d9] bg-white p-1 text-xs">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "all"
                      ? "bg-[#ff6749] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#17202a]"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilterStatus("active")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "active"
                      ? "bg-[#ff6749] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#17202a]"
                  }`}
                >
                  Active
                </button>
                <button
                  onClick={() => setFilterStatus("inactive")}
                  className={`rounded-lg px-3 py-1 font-semibold transition ${
                    filterStatus === "inactive"
                      ? "bg-[#ff6749] text-white shadow-xs"
                      : "text-[#667085] hover:text-[#17202a]"
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
                  className="h-28 rounded-2xl border border-[#e9e2d9] bg-white p-5 animate-pulse"
                />
              ))}
            </div>
          ) : filteredWorkflows.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-[#e9e2d9] bg-white p-12 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0eb] text-[#ff6749]">
                <Workflow className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-base font-bold text-[#17202a]">
                {searchQuery ? "No matching workflows found" : "No workflows yet"}
              </h3>
              <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-[#8a94a6]">
                {searchQuery
                  ? "Try searching for a different keyword or clear your filter."
                  : "Create your first visual workflow to connect APIs, AI, and triggers."}
              </p>
              {!searchQuery && (
                <Link
                  href="/workflows/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ff6749] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#f4573a] transition"
                >
                  <Plus className="h-4 w-4" />
                  Create Your First Workflow
                </Link>
              )}
            </div>
          ) : (
            <div className="mt-6 grid gap-4">
              {filteredWorkflows.map((wf) => {
                const nodeCount = Array.isArray(wf.nodes) ? wf.nodes.length : 0;
                const edgeCount = Array.isArray(wf.edges) ? wf.edges.length : 0;
                const isExecuting = executingId === wf.id;

                return (
                  <div
                    key={wf.id}
                    className="group flex flex-col justify-between gap-4 rounded-2xl border border-[#e9e2d9] bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-[#ffb5a5] hover:shadow-md md:flex-row md:items-center"
                  >
                    {/* Left: Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/workflows/${wf.id}`}
                          className="truncate text-base font-bold text-[#17202a] hover:text-[#ff6749] transition"
                        >
                          {wf.name}
                        </Link>

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            wf.active
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-gray-100 text-[#8a94a6]"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              wf.active ? "bg-emerald-500" : "bg-gray-400"
                            }`}
                          />
                          {wf.active ? "Active" : "Inactive"}
                        </span>

                        {wf.lastExecution && (
                          <span
                            className={`hidden sm:inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                              wf.lastExecution.status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : wf.lastExecution.status === "failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            Last run: {wf.lastExecution.status}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 line-clamp-1 text-xs text-[#8a94a6]">
                        {wf.description || "No description provided"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#667085]">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-[#ff6749]" />
                          {nodeCount} {nodeCount === 1 ? "node" : "nodes"}
                        </span>
                        <span>•</span>
                        <span>
                          {edgeCount} {edgeCount === 1 ? "connection" : "connections"}
                        </span>
                        <span>•</span>
                        <span>Updated {formatDate(wf.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                      {/* Activate / Deactivate switch */}
                      <button
                        onClick={() => toggleWorkflow(wf.id, wf.active)}
                        className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                          wf.active
                            ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border border-[#e9e2d9] bg-[#f4efe8] text-[#667085] hover:bg-[#eae3d8]"
                        }`}
                      >
                        {wf.active ? "Deactivate" : "Activate"}
                      </button>

                      {/* Quick Execute */}
                      <button
                        onClick={() => quickExecute(wf.id, wf.active)}
                        disabled={isExecuting || !wf.active}
                        title={wf.active ? "Run workflow now" : "Activate workflow to execute"}
                        className="flex items-center gap-1.5 rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-3.5 py-2 text-xs font-semibold text-[#17202a] transition hover:border-[#ffb5a5] hover:bg-[#fff0eb] hover:text-[#ff6749] disabled:opacity-40"
                      >
                        {isExecuting ? (
                          <RotateCw className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5 fill-current" />
                        )}
                        <span>{isExecuting ? "Running" : "Run"}</span>
                      </button>

                      {/* Open in Builder */}
                      <Link
                        href={`/workflows/${wf.id}`}
                        className="flex items-center gap-1.5 rounded-xl bg-[#17202a] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#2c3b4d]"
                      >
                        <span>Open</span>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl border border-[#e9e2d9] bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Trash2 className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-[#17202a]">
              Delete this workflow?
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[#8a94a6]">
              This action is permanent and cannot be undone. All execution history and logs for this workflow will be permanently removed.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteModalId(null)}
                className="rounded-xl border border-[#e9e2d9] px-4 py-2 text-xs font-semibold text-[#667085] hover:bg-[#f4efe8]"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-rose-700"
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
    <div className="rounded-2xl border border-[#e9e2d9] bg-white p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#8a94a6]">{title}</span>
        <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${bg}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 text-2xl font-black tracking-tight text-[#17202a]">
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
