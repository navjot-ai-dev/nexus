import Navbar from "@/components/landing/Navbar";
import Link from "next/link";

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "getting-started", label: "Getting Started" },
  { id: "workflows", label: "Workflows" },
  { id: "nodes", label: "Nodes" },
  { id: "triggers", label: "Triggers" },
  { id: "ai", label: "AI Nodes" },
  { id: "webhooks", label: "Webhooks" },
  { id: "api", label: "API Nodes" },
  { id: "variables", label: "Variables" },
  { id: "execution", label: "Execution" },
  { id: "logs", label: "Execution Logs" },
  { id: "authentication", label: "Authentication" },
];

export default function DocsPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">

      {/* Navbar */}
      <Navbar />


      {/* Documentation Layout */}
      <div className="mx-auto flex max-w-7xl">

        {/* Sidebar */}
        <aside className="sticky top-[73px] hidden h-[calc(100vh-73px)] w-64 shrink-0 overflow-y-auto border-r border-black/5 px-6 py-10 lg:block">

          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
            Documentation
          </p>

          <nav className="space-y-1">

            {sections.map((section, index) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                  index === 0
                    ? "bg-[#fff0eb] font-semibold text-[#ff6749]"
                    : "text-gray-600 hover:bg-black/5 hover:text-[#17202a]"
                }`}
              >
                {section.label}
              </a>
            ))}

          </nav>

        </aside>


        {/* Main Documentation */}
        <article className="min-w-0 flex-1 px-6 py-14 md:px-12 lg:px-20">

          {/* Introduction */}
          <section id="introduction" className="scroll-mt-28">

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#ff6749]">
              NEXUS Documentation
            </p>

            <h1 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
              Build intelligent workflows.
            </h1>

            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-500">
              NEXUS is a visual workflow automation platform for
              connecting APIs, AI models, databases, webhooks and
              custom logic into powerful automated workflows.
            </p>

          </section>


          {/* Getting Started */}
          <section
            id="getting-started"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Getting Started
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              NEXUS allows you to create automated workflows without
              having to manually build every integration.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              A workflow consists of multiple nodes connected
              together. Each node performs a specific operation.
            </p>

            <div className="my-8 rounded-2xl bg-[#17202a] p-6">
              <div className="flex flex-wrap items-center gap-3 text-sm">

                <Node text="Trigger" />

                <Arrow />

                <Node text="AI" />

                <Arrow />

                <Node text="Database" />

                <Arrow />

                <Node text="Output" />

              </div>
            </div>

          </section>


          {/* Workflows */}
          <section
            id="workflows"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Workflows
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              A workflow defines how information moves through your
              automation.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              You can create workflows visually by adding nodes to
              the canvas and connecting them together.
            </p>

            <h3 className="mt-8 text-xl font-bold">
              Example
            </h3>

            <div className="mt-4 rounded-2xl border border-black/5 bg-white p-6 shadow-sm">

              <p className="font-mono text-sm text-gray-700">
                Webhook → AI Processor → Database → Response
              </p>

            </div>

          </section>


          {/* Nodes */}
          <section
            id="nodes"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Nodes
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Nodes are the building blocks of NEXUS workflows.
              Each node performs one specific task.
            </p>

            <div className="mt-6 space-y-5">

              <DocItem
                title="Trigger Node"
                text="Starts a workflow when an event occurs."
              />

              <DocItem
                title="AI Node"
                text="Processes information using an AI model."
              />

              <DocItem
                title="API Node"
                text="Sends requests to external APIs."
              />

              <DocItem
                title="Database Node"
                text="Reads or writes information to a database."
              />

              <DocItem
                title="Webhook Node"
                text="Receives HTTP requests from external services."
              />

            </div>

          </section>


          {/* Triggers */}
          <section
            id="triggers"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Triggers
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Triggers determine when a workflow should start.
            </p>

            <ul className="mt-6 list-disc space-y-3 pl-6 text-gray-600">
              <li>Manual trigger</li>
              <li>Webhook trigger</li>
              <li>Scheduled trigger</li>
              <li>API trigger</li>
              <li>Event-based trigger</li>
            </ul>

          </section>


          {/* AI */}
          <section
            id="ai"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              AI Nodes
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              AI nodes allow workflows to use AI models for tasks
              such as text generation, classification, summarization,
              extraction and decision making.
            </p>

            <div className="mt-6 rounded-2xl bg-[#f7f4ee] p-6">

              <p className="font-mono text-sm leading-7 text-gray-700">
                Input → AI Model → Structured Output
              </p>

            </div>

          </section>


          {/* Webhooks */}
          <section
            id="webhooks"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Webhooks
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Webhooks allow external applications to start NEXUS
              workflows by sending HTTP requests.
            </p>

            <div className="mt-6 rounded-2xl bg-[#17202a] p-6 font-mono text-sm text-gray-300">

              POST /api/webhooks/{`{workflowId}`}

            </div>

          </section>


          {/* API */}
          <section
            id="api"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              API Nodes
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              API nodes allow workflows to communicate with external
              services.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              You can configure the HTTP method, URL, headers,
              parameters and request body.
            </p>

            <div className="mt-6 rounded-2xl bg-[#17202a] p-6 font-mono text-sm leading-7 text-gray-300">
              GET /users
              <br />
              POST /messages
              <br />
              PUT /profile
              <br />
              DELETE /resource
            </div>

          </section>


          {/* Variables */}
          <section
            id="variables"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Variables
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Variables allow data to move between different nodes
              inside a workflow.
            </p>

            <div className="mt-6 rounded-2xl bg-[#f7f4ee] p-6 font-mono text-sm">
              {`{{trigger.user.email}}`}
            </div>

          </section>


          {/* Execution */}
          <section
            id="execution"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Workflow Execution
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              When a workflow starts, NEXUS processes each node
              according to the connections defined in the workflow.
            </p>

            <div className="mt-8 space-y-4">

              <Step number="01" text="Trigger starts the workflow" />

              <Step number="02" text="Input data is received" />

              <Step number="03" text="Nodes process the data" />

              <Step number="04" text="Results move to the next node" />

              <Step number="05" text="Workflow completes" />

            </div>

          </section>


          {/* Logs */}
          <section
            id="logs"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Execution Logs
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              Every workflow execution produces logs that help you
              understand what happened during execution.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Logs can contain node status, execution time, inputs,
              outputs and errors.
            </p>

          </section>


          {/* Authentication */}
          <section
            id="authentication"
            className="mt-24 scroll-mt-28"
          >

            <h2 className="text-3xl font-black">
              Authentication
            </h2>

            <p className="mt-5 leading-8 text-gray-600">
              NEXUS uses authentication to protect user accounts,
              workflows and private application data.
            </p>

            <p className="mt-4 leading-8 text-gray-600">
              Authenticated users can create workflows, manage
              integrations and inspect their workflow executions.
            </p>

          </section>


          {/* Final */}
          <section className="mt-24 border-t border-black/10 pt-12">

            <h2 className="text-2xl font-black">
              You're ready to build 🚀
            </h2>

            <p className="mt-4 leading-7 text-gray-500">
              Explore the workflow library or open the dashboard to
              start creating your first NEXUS workflow.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">

              <Link
                href="/workflows"
                className="rounded-full bg-[#ff6749] px-6 py-3 text-sm font-bold text-white transition hover:scale-105"
              >
                Explore workflows
              </Link>

              <Link
                href="/dashboard"
                className="rounded-full bg-[#17202a] px-6 py-3 text-sm font-bold text-white transition hover:scale-105"
              >
                Open dashboard
              </Link>

            </div>

          </section>

        </article>

      </div>
    </main>
  );
}


/* Components */

function Node({ text }: { text: string }) {
  return (
    <div className="rounded-xl bg-white px-4 py-3 font-semibold text-[#17202a]">
      {text}
    </div>
  );
}

function Arrow() {
  return (
    <span className="text-gray-400">
      →
    </span>
  );
}

function DocItem({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="border-b border-black/10 pb-5">
      <h3 className="font-bold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-7 text-gray-500">
        {text}
      </p>
    </div>
  );
}

function Step({
  number,
  text,
}: {
  number: string;
  text: string;
}) {
  return (
    <div className="flex items-center gap-4 border-b border-black/10 pb-4">
      <span className="font-mono text-sm font-bold text-[#ff6749]">
        {number}
      </span>

      <span className="text-gray-600">
        {text}
      </span>
    </div>
  );
}