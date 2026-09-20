export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-20 text-white">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-violet-500/10">
        <p className="text-sm uppercase tracking-[0.24em] text-violet-300">Sign up</p>
        <h1 className="mt-4 text-3xl font-bold">Create your account</h1>
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">Full name</div>
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">Work email</div>
          <div className="rounded-xl border border-white/10 bg-slate-900/80 p-3 text-slate-300">Password</div>
          <button className="w-full rounded-xl bg-violet-500 px-4 py-3 font-semibold text-white">Get started</button>
        </div>
      </div>
    </main>
  );
}
