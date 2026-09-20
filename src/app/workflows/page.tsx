import Navbar from "@/components/landing/Navbar";
import Link from "next/link";

const workflows = [
  {
    title: "AI Content Generator",
    description:
      "Generate content automatically using an AI-powered workflow.",
    nodes: ["Trigger", "AI", "Output"],
  },
  {
    title: "Webhook → AI → Database",
    description:
      "Receive data from a webhook, process it with AI, and save the result.",
    nodes: ["Webhook", "AI", "Database"],
  },
  {
    title: "API → AI → Email",
    description:
      "Fetch data from an API, analyze it with AI, and send an email.",
    nodes: ["API", "AI", "Email"],
  },
];

export default function WorkflowsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      {/* Header */}
      <Navbar />

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-16 pt-24">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
            Workflow Library
          </p>

          <h1 className="text-5xl font-black tracking-tight md:text-7xl">
            Build workflows
            <br />
            that <span className="text-[#ff6749]">think.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Start with a ready-made workflow or create your own automation
            from scratch using the NEXUS visual workflow builder.
          </p>
        </div>
      </section>

      {/* Workflow Cards */}
      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-24 md:grid-cols-3">
        {workflows.map((workflow) => (
          <div
            key={workflow.title}
            className="group rounded-[28px] border border-black/5 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl"
          >
            {/* Fake workflow preview */}
            <div className="mb-6 rounded-2xl bg-[#f7f4ee] p-5">
              <div className="flex flex-wrap items-center gap-2">
                {workflow.nodes.map((node, index) => (
                  <div key={node} className="flex items-center gap-2">
                    <div className="rounded-xl bg-white px-3 py-2 text-xs font-bold shadow-sm">
                      {node}
                    </div>

                    {index < workflow.nodes.length - 1 && (
                      <span className="text-gray-400">→</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <h2 className="text-xl font-bold">{workflow.title}</h2>

            <p className="mt-3 min-h-20 text-sm leading-6 text-gray-500">
              {workflow.description}
            </p>

            <Link
              href="/dashboard"
              className="mt-6 inline-flex rounded-full bg-[#ff6749] px-5 py-3 text-sm font-bold text-white transition hover:scale-105"
            >
              Use workflow →
            </Link>
          </div>
        ))}
      </section>
    </main>
  );
}