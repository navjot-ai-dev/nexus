import Hero from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fffdf9] text-[#17202a]">
      <Navbar />

      <Hero />

      {/* PRODUCT */}
      <section
        id="product"
        className="border-t border-[#eee8df] bg-[#fffdf9] px-6 py-32"
      >
        <div className="mx-auto max-w-7xl">

          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff6749]">
              Everything connected
            </p>

            <h2 className="mt-5 text-5xl font-bold tracking-[-0.05em] sm:text-6xl">
              One canvas.
              <br />
              Infinite possibilities.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#667085]">
              Connect triggers, AI models, databases and APIs
              into powerful automated workflows.
            </p>
          </div>

          {/* workflow visual */}
          <div className="relative mt-20 overflow-hidden rounded-[35px] border border-[#e8e1d8] bg-[#f8f5ef] p-10 shadow-[0_30px_80px_rgba(23,32,42,0.08)]">

            <div className="absolute right-[-100px] top-[-100px] h-[350px] w-[350px] rounded-full bg-[#ffb69e]/20 blur-[100px]" />

            <div className="relative flex min-h-[400px] items-center justify-center">

              <div className="flex flex-col items-center gap-5 md:flex-row">

                <WorkflowBox
                  color="coral"
                  icon="ϟ"
                  title="Webhook"
                  text="Receive event"
                />

                <Arrow />

                <WorkflowBox
                  color="teal"
                  icon="✦"
                  title="AI Processor"
                  text="Analyze data"
                />

                <Arrow />

                <WorkflowBox
                  color="orange"
                  icon="◉"
                  title="Database"
                  text="Store result"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DARK FEATURES */}
      <section
        id="features"
        className="bg-[#17202a] px-6 py-32 text-white"
      >
        <div className="mx-auto max-w-7xl">

          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#ff8b72]">
            Built for builders
          </p>

          <h2 className="mt-5 max-w-3xl text-5xl font-bold tracking-[-0.05em] sm:text-6xl">
            Powerful backend.
            <br />
            Beautiful frontend.
          </h2>

          <div className="mt-20 grid gap-5 md:grid-cols-3">
            <Feature
              number="01"
              title="Visual workflows"
              text="Build complex automation with drag, drop and connect."
            />

            <Feature
              number="02"
              title="AI native"
              text="Connect local AI models and create intelligent workflows."
            />

            <Feature
              number="03"
              title="Real-time execution"
              text="Watch every workflow node execute live."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#fffdf9] px-6 py-12">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="font-bold">NEXUS.</div>

          <div className="text-sm text-[#98a2b3]">
            Build. Connect. Automate.
          </div>
        </div>
      </footer>
    </main>
  );
}

function Arrow() {
  return (
    <div className="hidden text-2xl text-[#bdb5aa] md:block">
      →
    </div>
  );
}

function WorkflowBox({
  icon,
  title,
  text,
  color,
}: {
  icon: string;
  title: string;
  text: string;
  color: "coral" | "teal" | "orange";
}) {
  const styles = {
    coral: "bg-[#fff0eb] text-[#ff6749]",
    teal: "bg-[#e7f8f5] text-[#2a9d8f]",
    orange: "bg-[#fff2df] text-[#df8b3e]",
  };

  return (
    <div className="w-[230px] rounded-3xl border border-[#e7e0d7] bg-white p-6 shadow-[0_15px_40px_rgba(23,32,42,0.08)] transition hover:-translate-y-2">

      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${styles[color]}`}
      >
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-[#98a2b3]">
        {text}
      </p>

      <div className="mt-5 h-1.5 rounded-full bg-[#f1ede7]">
        <div
          className={`h-full w-2/3 rounded-full ${
            color === "coral"
              ? "bg-[#ff6749]"
              : color === "teal"
                ? "bg-[#2a9d8f]"
                : "bg-[#f4a261]"
          }`}
        />
      </div>
    </div>
  );
}

function Feature({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 transition hover:-translate-y-1 hover:bg-white/[0.07]">

      <span className="text-sm text-[#ff8b72]">
        {number}
      </span>

      <h3 className="mt-16 text-2xl font-semibold">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-white/50">
        {text}
      </p>
    </div>
  );
}