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
    async function loadWorkflows() {
      try {
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
            result.message || "Failed to load workflows",
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
    }

    loadWorkflows();
  }, []);

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

          {/* ERROR */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}

          {/* EMPTY */}

          {!loading &&
            !error &&
            workflows.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#e9e2d9] bg-white p-12 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0eb] text-2xl">
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

          {!loading &&
            !error &&
            workflows.length > 0 && (
              <div className="grid gap-4">
                {workflows.map((workflow) => (
                  <div
                    key={workflow.id}
                    className="group rounded-2xl border border-[#e9e2d9] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_35px_rgba(30,41,59,0.07)]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="truncate text-base font-semibold">
                            {workflow.name}
                          </h3>

                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
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

                        <p className="mt-1 text-sm text-[#9aa3b2]">
                          {workflow.description ||
                            "No description"}
                        </p>

                        <div className="mt-3 flex items-center gap-4 text-xs text-[#9aa3b2]">
                          <span>
                            {workflow.nodes.length} nodes
                          </span>

                          <span>
                            {workflow.edges.length} connections
                          </span>

                          <span>
                            Updated{" "}
                            {formatDate(
                              workflow.updatedAt,
                            )}
                          </span>
                        </div>
                      </div>

                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="ml-5 shrink-0 rounded-xl border border-[#e9e2d9] px-4 py-2.5 text-sm font-medium text-[#667085] transition hover:border-[#ffb5a5] hover:bg-[#fff0eb] hover:text-[#ff6749]"
                      >
                        Open →
                      </Link>
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

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}