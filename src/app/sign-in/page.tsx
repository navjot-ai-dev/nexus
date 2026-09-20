export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-cyan-500/10">
        <p className="text-sm uppercase tracking-[0.24em] text-cyan-300">Sign in</p>
        <h1 className="mt-4 text-3xl font-bold">Welcome back</h1>
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">Email</div>
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">Password</div>
          <button className="w-full rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950">Continue</button>
        </div>
      </div>
    </main>
  );
}
