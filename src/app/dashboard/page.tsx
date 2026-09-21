import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      <div className="flex min-h-screen">

        {/* Sidebar */}
        <aside className="hidden w-[250px] border-r border-[#e9e2d9] bg-white/70 px-5 py-6 md:flex md:flex-col">

          {/* Logo */}
          <div className="mb-10 flex items-center gap-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-[13px] bg-[#17202a]">
              <div className="h-3.5 w-3.5 rounded-full bg-[#ff6749]" />
              <div className="absolute h-6 w-6 rounded-full border border-white/20" />
            </div>

            <div>
              <div className="text-lg font-bold tracking-[-0.04em]">
                NEXUS
              </div>
              <div className="text-[8px] font-semibold uppercase tracking-[0.22em] text-[#9aa3b2]">
                Workflow OS
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">

            <a
              href="/dashboard"
              className="flex items-center gap-3 rounded-xl bg-[#fff0eb] px-4 py-3 text-sm font-semibold text-[#ff6749]"
            >
              <span>⌂</span>
              Overview
            </a>

            <a
              href="/dashboard/workflows"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#667085] transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
            >
              <span>◇</span>
              Workflows
            </a>

            <a
              href="/dashboard/executions"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#667085] transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
            >
              <span>↗</span>
              Executions
            </a>

            <a
              href="/dashboard/templates"
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-[#667085] transition hover:bg-[#fff0eb] hover:text-[#ff6749]"
            >
              <span>▦</span>
              Templates
            </a>
          </nav>

          {/* Bottom */}
          <div className="mt-auto">
            <div className="mb-4 rounded-2xl bg-[#fff7f3] p-4">
              <p className="text-xs font-semibold text-[#17202a]">
                Build your first workflow
              </p>

              <p className="mt-1 text-[11px] leading-5 text-[#667085]">
                Connect apps, APIs and AI into one automated flow.
              </p>

              <a
                href="/dashboard/workflows/new"
                className="mt-4 block rounded-lg bg-[#ff6749] px-3 py-2 text-center text-xs font-semibold text-white transition hover:bg-[#f4573a]"
              >
                Create workflow
              </a>
            </div>

            {/* User */}
            <div className="flex items-center gap-3 border-t border-[#e9e2d9] pt-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#17202a] text-sm font-bold text-white">
                {session.user.name?.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {session.user.name}
                </p>

                <p className="truncate text-[11px] text-[#9aa3b2]">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <section className="flex-1 px-6 py-8 md:px-10">

          {/* Header */}
          <div className="mx-auto max-w-[1200px]">

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">

              <div>
                <p className="text-sm font-medium text-[#ff6749]">
                  Workspace
                </p>

                <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] md:text-4xl">
                  Good to see you, {session.user.name} 👋
                </h1>

                <p className="mt-2 text-sm text-[#667085]">
                  Build, automate and monitor your workflows.
                </p>
              </div>

              <a
                href="/dashboard/workflows/new"
                className="inline-flex items-center justify-center rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
              >
                + Create workflow
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              <Stat
                label="Total workflows"
                value="0"
                icon="◇"
              />

              <Stat
                label="Active workflows"
                value="0"
                icon="●"
              />

              <Stat
                label="Executions"
                value="0"
                icon="↗"
              />

              <Stat
                label="Success rate"
                value="—"
                icon="✓"
              />

            </div>

            {/* Content */}
            <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">

              {/* Workflows */}
              <div className="rounded-[24px] border border-[#e9e2d9] bg-white p-6">

                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">
                      Recent workflows
                    </h2>

                    <p className="mt-1 text-xs text-[#9aa3b2]">
                      Your latest automation workflows
                    </p>
                  </div>

                  <a
                    href="/dashboard/workflows"
                    className="text-xs font-semibold text-[#ff6749]"
                  >
                    View all →
                  </a>
                </div>

                {/* Empty state */}
                <div className="flex min-h-[260px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0eb] text-2xl text-[#ff6749]">
                    ◇
                  </div>

                  <h3 className="mt-5 text-base font-semibold">
                    No workflows yet
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-[#667085]">
                    Create your first workflow and connect triggers,
                    AI, APIs and databases.
                  </p>

                  <a
                    href="/dashboard/workflows/new"
                    className="mt-5 rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-2.5 text-sm font-semibold transition hover:border-[#ff6749] hover:text-[#ff6749]"
                  >
                    Create your first workflow
                  </a>

                </div>
              </div>

              {/* Activity */}
              <div className="rounded-[24px] border border-[#e9e2d9] bg-white p-6">

                <div>
                  <h2 className="text-lg font-bold">
                    Recent activity
                  </h2>

                  <p className="mt-1 text-xs text-[#9aa3b2]">
                    Workflow execution activity
                  </p>
                </div>

                <div className="flex min-h-[260px] items-center justify-center text-center">
                  <div>
                    <div className="text-3xl">◌</div>

                    <p className="mt-3 text-sm font-medium">
                      No activity yet
                    </p>

                    <p className="mt-1 text-xs text-[#9aa3b2]">
                      Your workflow executions will appear here.
                    </p>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-[20px] border border-[#e9e2d9] bg-white p-5">

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-[#667085]">
          {label}
        </span>

        <span className="text-sm text-[#ff6749]">
          {icon}
        </span>
      </div>

      <div className="mt-4 text-2xl font-bold tracking-[-0.03em]">
        {value}
      </div>

    </div>
  );
}