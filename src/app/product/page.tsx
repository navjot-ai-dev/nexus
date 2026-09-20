import Link from "next/link";

const capabilities = [
  {
    number: "01",
    title: "Visual Workflows",
    description:
      "Design complex automations visually by connecting triggers, logic, APIs, AI models, and data.",
  },
  {
    number: "02",
    title: "AI Automation",
    description:
      "Add intelligent processing to your workflows using AI-powered nodes.",
  },
  {
    number: "03",
    title: "API Connectivity",
    description:
      "Connect external services and APIs without building every integration from scratch.",
  },
  {
    number: "04",
    title: "Event Driven",
    description:
      "Start workflows from webhooks, schedules, API requests, or application events.",
  },
];

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-black/5 bg-[#fffdf9]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight"
          >
            NEXUS<span className="text-[#ff6749]">.</span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/product"
              className="text-sm font-semibold text-[#ff6749]"
            >
              Product
            </Link>

            <Link
              href="/workflows"
              className="text-sm text-gray-600 transition hover:text-[#17202a]"
            >
              Workflows
            </Link>

            <Link
              href="/features"
              className="text-sm text-gray-600 transition hover:text-[#17202a]"
            >
              Features
            </Link>

            <Link
              href="/docs"
              className="text-sm text-gray-600 transition hover:text-[#17202a]"
            >
              Docs
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="hidden px-4 py-2 text-sm font-semibold text-gray-600 sm:block"
            >
              Sign in
            </Link>

            <Link
              href="/sign-up"
              className="rounded-full bg-[#17202a] px-5 py-2.5 text-sm font-semibold text-white transition hover:scale-105"
            >
              Start building
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-24 md:pt-32">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              The NEXUS Platform
            </p>

            <h1 className="mt-5 text-5xl font-black tracking-tight md:text-7xl">
              One place to
              <br />
              <span className="text-[#ff6749]">automate everything.</span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-500">
              NEXUS gives developers a visual environment for building
              intelligent workflows that connect APIs, AI models,
              databases, webhooks, and custom logic.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/sign-up"
                className="rounded-full bg-[#ff6749] px-7 py-3.5 text-sm font-bold text-white transition hover:scale-105"
              >
                Start building →
              </Link>

              <Link
                href="/docs"
                className="rounded-full border border-black/10 bg-white px-7 py-3.5 text-sm font-bold transition hover:bg-gray-50"
              >
                Read documentation
              </Link>
            </div>
          </div>

          {/* Workflow Visual */}
          <div className="relative">
            <div className="rounded-[36px] border border-black/5 bg-white p-6 shadow-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Workflow
                  </p>

                  <h3 className="mt-1 font-bold">
                    AI Content Pipeline
                  </h3>
                </div>

                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
                  Active
                </span>
              </div>

              <div className="space-y-3">
                <WorkflowNode
                  label="Webhook"
                  description="Receive request"
                />

                <Connector />

                <WorkflowNode
                  label="AI Processor"
                  description="Generate content"
                />

                <Connector />

                <WorkflowNode
                  label="Database"
                  description="Save result"
                />

                <Connector />

                <WorkflowNode
                  label="Response"
                  description="Return result"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              What NEXUS does
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Everything your workflow needs.
            </h2>
          </div>

          <div className="mt-16 divide-y divide-black/10">
            {capabilities.map((item) => (
              <div
                key={item.number}
                className="grid gap-6 py-10 md:grid-cols-[100px_280px_1fr] md:items-center"
              >
                <span className="font-mono text-sm font-bold text-[#ff6749]">
                  {item.number}
                </span>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="max-w-xl leading-7 text-gray-500">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow lifecycle */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-16 lg:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              How it works
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              From event to
              <br />
              completed action.
            </h2>

            <p className="mt-6 max-w-lg leading-8 text-gray-500">
              NEXUS takes an incoming event, processes it through
              your workflow, and executes each connected node.
            </p>
          </div>

          <div className="space-y-8">
            <Lifecycle
              number="01"
              title="Trigger"
              text="Something starts the workflow."
            />

            <Lifecycle
              number="02"
              title="Process"
              text="Nodes transform and analyze the data."
            />

            <Lifecycle
              number="03"
              title="Connect"
              text="Information moves between services."
            />

            <Lifecycle
              number="04"
              title="Execute"
              text="The workflow completes the requested action."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-6 mb-10 overflow-hidden rounded-[40px] bg-[#17202a] px-6 py-24 text-center text-white">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#ff6749]">
          NEXUS
        </p>

        <h2 className="mx-auto mt-5 max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
          Turn your ideas into workflows.
        </h2>

        <p className="mx-auto mt-6 max-w-xl leading-7 text-gray-400">
          Build, connect, automate, and monitor everything from one
          powerful workflow environment.
        </p>

        <Link
          href="/sign-up"
          className="mt-9 inline-flex rounded-full bg-[#ff6749] px-8 py-4 text-sm font-bold text-white transition hover:scale-105"
        >
          Start building →
        </Link>
      </section>
    </main>
  );
}

/* Workflow node */

function WorkflowNode({
  label,
  description,
}: {
  label: string;
  description: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-black/5 bg-[#fffdf9] px-5 py-4">
      <div>
        <p className="font-bold">{label}</p>
        <p className="mt-1 text-xs text-gray-400">
          {description}
        </p>
      </div>

      <span className="h-2.5 w-2.5 rounded-full bg-[#ff6749]" />
    </div>
  );
}

/* Connector */

function Connector() {
  return (
    <div className="ml-8 h-5 border-l border-dashed border-gray-300" />
  );
}

/* Lifecycle */

function Lifecycle({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-5 border-b border-black/10 pb-7">
      <span className="font-mono text-sm font-bold text-[#ff6749]">
        {number}
      </span>

      <div>
        <h3 className="text-xl font-bold">{title}</h3>

        <p className="mt-2 text-gray-500">{text}</p>
      </div>
    </div>
  );
}