
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Workflow = {
  id: string;
  name: string;
  description: string | null;
  nodes: unknown[];
  edges: unknown[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function DashboardPage() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/nexus/workflows",
        {
          method: "GET",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load workflows",
        );
      }

      setWorkflows(result.data ?? []);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load workflows",
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * DELETE WORKFLOW
   */

  const deleteWorkflow = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this workflow?",
    );

    if (!confirmed) return;

    try {
      setError("");

      const response = await fetch(
        `/api/nexus/workflows/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete workflow",
        );
      }

      setWorkflows((current) =>
        current.filter(
          (workflow) => workflow.id !== id,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to delete workflow",
      );
    }
  };

  /*
   * ACTIVATE / DEACTIVATE WORKFLOW
   */

  const toggleWorkflow = async (
    id: string,
    currentActive: boolean,
  ) => {
    try {
      setError("");

      const response = await fetch(
        `/api/nexus/workflows/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            active: !currentActive,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to update workflow",
        );
      }

      setWorkflows((current) =>
        current.map((workflow) =>
          workflow.id === id
            ? {
                ...workflow,
                active: !currentActive,
                updatedAt:
                  result.data?.updatedAt ??
                  workflow.updatedAt,
              }
            : workflow,
        ),
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to update workflow",
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf9] px-6 py-10 text-[#17202a]">
      <div className="mx-auto max-w-[1200px]">
        {/* HEADER */}

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#ff6749]">
              NEXUS
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em]">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-[#9aa3b2]">
              Manage your automation workflows.
            </p>
          </div>

          <Link
            href="/workflows/new"
            className="rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
          >
            + Create Workflow
          </Link>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mt-6 flex items-center justify-between rounded-xl border border-red-200 bg-red-50 px-5 py-3">
            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              onClick={() => setError("")}
              className="text-sm font-medium text-red-500 hover:text-red-700"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* WORKFLOWS */}

        <section className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              My Workflows
            </h2>

            <span className="text-sm text-[#9aa3b2]">
              {workflows.length}{" "}
              {workflows.length === 1
                ? "workflow"
                : "workflows"}
            </span>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="rounded-2xl border border-[#e9e2d9] bg-white p-8 text-center">
              <p className="text-sm text-[#9aa3b2]">
                Loading workflows...
              </p>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            workflows.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#e9e2d9] bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0eb] text-2xl text-[#ff6749]">
                  +
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  No workflows yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#9aa3b2]">
                  Create your first workflow and
                  start building your automation.
                </p>

                <Link
                  href="/workflows/new"
                  className="mt-6 inline-flex rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#f4573a]"
                >
                  Create your first workflow →
                </Link>
              </div>
            )}

          {/* WORKFLOW LIST */}

          {!loading && workflows.length > 0 && (
            <div className="grid gap-4">
              {workflows.map((workflow) => (
                <div
                  key={workflow.id}
                  className="group rounded-2xl border border-[#e9e2d9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(30,41,59,0.07)]"
                >
                  <div className="flex items-center justify-between gap-5">
                    {/* WORKFLOW INFO */}

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="truncate text-base font-semibold">
                          {workflow.name}
                        </h3>

                        <span
                          className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                            workflow.active
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-50 text-[#9aa3b2]"
                          }`}
                        >
                          {workflow.active
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm text-[#9aa3b2]">
                        {workflow.description ||
                          "No description"}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#9aa3b2]">
                        <span>
                          {workflow.nodes.length}{" "}
                          {workflow.nodes.length === 1
                            ? "node"
                            : "nodes"}
                        </span>

                        <span>
                          {workflow.edges.length}{" "}
                          {workflow.edges.length === 1
                            ? "connection"
                            : "connections"}
                        </span>

                        <span>
                          Updated{" "}
                          {formatDate(
                            workflow.updatedAt,
                          )}
                        </span>
                      </div>
                    </div>

                    {/* ACTIONS */}

                    <div className="flex shrink-0 items-center gap-2">
                      {/* ACTIVATE / DEACTIVATE */}

                      <button
                        onClick={() =>
                          toggleWorkflow(
                            workflow.id,
                            workflow.active,
                          )
                        }
                        className={`rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                          workflow.active
                            ? "border border-green-200 bg-green-50 text-green-600 hover:bg-green-100"
                            : "border border-[#e9e2d9] text-[#667085] hover:bg-[#fff0eb]"
                        }`}
                      >
                        {workflow.active
                          ? "Active"
                          : "Activate"}
                      </button>

                      {/* OPEN */}

                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="rounded-xl border border-[#e9e2d9] px-4 py-2.5 text-sm font-medium text-[#667085] transition hover:border-[#ffb5a5] hover:bg-[#fff0eb] hover:text-[#ff6749]"
                      >
                        Open →
                      </Link>

                      {/* DELETE */}

                      <button
                        onClick={() =>
                          deleteWorkflow(
                            workflow.id,
                          )
                        }
                        className="rounded-xl border border-red-100 px-4 py-2.5 text-sm font-medium text-red-500 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/*
 * FORMAT DATE
 */

function formatDate(date: string) {
  try {
    return new Intl.DateTimeFormat("en", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  } catch {
    return "Unknown";
  }
}

