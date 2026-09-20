export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-4 text-sm uppercase tracking-[0.24em] text-rose-300">Dashboard</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Operational clarity in real time.</h1>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Revenue</p>
            <p className="mt-3 text-3xl font-bold">$284K</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Active workflows</p>
            <p className="mt-3 text-3xl font-bold">128</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">Automation score</p>
            <p className="mt-3 text-3xl font-bold">94%</p>
          </div>
        </div>
      </div>
    </main>
  );
}
