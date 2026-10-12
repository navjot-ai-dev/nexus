import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import StartBuildingButton from "@/components/landing/StartBuildingButton";
import Link from "next/link";
import {
  Webhook,
  Sparkles,
  Database,
  Globe,
  ArrowRight,
  Shield,
  Activity,
  Layers,
  Terminal,
  Cpu,
  GitBranch,
} from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      <Navbar />
      <Hero />

      {/* PRODUCT INTERACTIVE FLOW */}
      <section id="product" className="border-t border-[#eee8df] bg-[#fffdf9] px-6 py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              Infinite Extensibility
            </p>
            <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl text-[#17202a]">
              One visual canvas.
              <br />
              Enterprise reliability.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#667085]">
              Compose webhooks, LLMs, REST APIs, and database transactions into directed acyclic graphs.
              Every node is type-safe, observable, and isolated with SSRF protection.
            </p>
          </div>

          {/* Interactive Workflow Diagram */}
          <div className="relative mt-16 overflow-hidden rounded-[36px] border border-[#e8e1d8] bg-[#f8f5ef] p-8 md:p-12 shadow-[0_24px_60px_rgba(23,32,42,0.06)]">
            <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#ffb69e]/20 blur-[100px]" />
            <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-[#9be4da]/20 blur-[100px]" />

            <div className="relative flex flex-col items-center justify-center gap-6 lg:flex-row">
              <NodeCard
                badge="TRIGGER"
                badgeColor="bg-[#fff0eb] text-[#ff6749]"
                title="Webhook Listener"
                detail="POST /api/v1/events"
                icon={<Webhook className="h-5 w-5 text-[#ff6749]" />}
              />

              <FlowConnector label="Payload JSON" />

              <NodeCard
                badge="AI MODEL"
                badgeColor="bg-[#eef8f6] text-[#2a9d8f]"
                title="Gemini 1.5 Flash"
                detail="Extract intent & sentiment"
                icon={<Sparkles className="h-5 w-5 text-[#2a9d8f]" />}
              />

              <FlowConnector label="Structured Text" />

              <NodeCard
                badge="API"
                badgeColor="bg-[#eff8ff] text-[#0284c7]"
                title="HTTP Dispatcher"
                detail="Sync to CRM / Slack"
                icon={<Globe className="h-5 w-5 text-[#0284c7]" />}
              />

              <FlowConnector label="Response 200" />

              <NodeCard
                badge="STORAGE"
                badgeColor="bg-[#f5f3ff] text-[#7c3aed]"
                title="Database Store"
                detail="INSERT INTO audit_logs"
                icon={<Database className="h-5 w-5 text-[#7c3aed]" />}
              />
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER FEATURES (DEEP NAVY) */}
      <section id="features" className="bg-[#17202a] px-6 py-28 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff8b72]">
                Architected for Engineers
              </p>
              <h2 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                The technical standard
                <br />
                for workflow execution.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/60">
              NEXUS combines topological graph traversal, isolated node runners, and real-time step streaming.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<GitBranch className="h-5 w-5 text-[#ff8b72]" />}
              number="01"
              title="Topological Execution"
              text="Nodes execute strictly respecting dependency edges. Branching, parallel chains, and fallbacks are handled deterministically."
            />
            <FeatureCard
              icon={<Cpu className="h-5 w-5 text-[#43bcae]" />}
              number="02"
              title="Universal AI Abstraction"
              text="Plug in Google Gemini, OpenAI, or Anthropic models with unified prompt templates and automatic variable hydration."
            />
            <FeatureCard
              icon={<Shield className="h-5 w-5 text-[#ff8b72]" />}
              number="03"
              title="SSRF-Guarded HTTP Client"
              text="Outbound HTTP nodes reject loopback, internal RFC 1918 networks, and metadata endpoints to keep your infrastructure secure."
            />
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#fffdf9] px-6 py-24">
        <div className="mx-auto max-w-5xl rounded-[36px] bg-[#17202a] p-10 md:p-16 text-center text-white shadow-xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff8b72]">
            Ready to Build?
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl">
            Start automating with NEXUS today.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/70">
            Create visual workflows, connect AI models, and run reliable integrations in minutes.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <StartBuildingButton />
            <Link
              href="/docs"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-white/20"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#eee8df] bg-[#fffdf9] px-6 py-12 text-xs text-[#8a94a6]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#17202a]">
              <div className="h-2 w-2 rounded-full bg-[#ff6749]" />
            </div>
            <span className="font-bold text-[#17202a]">NEXUS Workflow OS</span>
            <span>—</span>
            <span>Visual Automation Platform</span>
          </div>

          <div className="flex items-center gap-6 font-semibold text-[#667085]">
            <Link href="/product" className="hover:text-[#17202a] transition">
              Product
            </Link>
            <Link href="/workflows" className="hover:text-[#17202a] transition">
              Workflows
            </Link>
            <Link href="/features" className="hover:text-[#17202a] transition">
              Features
            </Link>
            <Link href="/docs" className="hover:text-[#17202a] transition">
              Documentation
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NodeCard({
  title,
  detail,
  badge,
  badgeColor,
  icon,
}: {
  title: string;
  detail: string;
  badge: string;
  badgeColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="w-full sm:w-60 rounded-2xl border border-[#e8e1d8] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#faf7f2]">
          {icon}
        </div>
        <span className={`rounded-md px-2 py-0.5 font-mono text-[9px] font-bold ${badgeColor}`}>
          {badge}
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold text-[#17202a]">{title}</h3>
      <p className="mt-1 font-mono text-[11px] text-[#8a94a6] truncate">{detail}</p>
    </div>
  );
}

function FlowConnector({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <span className="hidden font-mono text-[9px] uppercase tracking-wider text-[#8a94a6] lg:block">
        {label}
      </span>
      <div className="hidden lg:flex items-center text-[#ff6749] text-base">
        →
      </div>
      <div className="lg:hidden text-[#ff6749] text-base">
        ↓
      </div>
    </div>
  );
}

function FeatureCard({
  number,
  title,
  text,
  icon,
}: {
  number: string;
  title: string;
  text: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 transition hover:-translate-y-1 hover:bg-white/[0.06]">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          {icon}
        </div>
        <span className="font-mono text-xs font-bold text-[#ff8b72]">{number}</span>
      </div>
      <h3 className="mt-8 text-xl font-bold">{title}</h3>
      <p className="mt-3 text-xs leading-relaxed text-white/60">{text}</p>
    </div>
  );
}