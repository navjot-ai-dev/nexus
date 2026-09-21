"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Something went wrong");
      return;
    }

    window.location.href = "/dashboard";
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fffdf9] px-6">

      <div className="w-full max-w-md">

        <Link
          href="/"
          className="mb-10 block text-center text-2xl font-black tracking-tight"
        >
          NEXUS<span className="text-[#ff6749]">.</span>
        </Link>

        <div className="rounded-[28px] border border-[#e9e2d9] bg-white p-8 shadow-[0_20px_60px_rgba(30,41,59,0.08)]">

          <h1 className="text-3xl font-black">
            Create your account
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Start building intelligent workflows with NEXUS.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Name
              </label>

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#ff6749]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#ff6749]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold">
                Password
              </label>

              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-3 outline-none transition focus:border-[#ff6749]"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#ff6749] py-3.5 font-semibold text-white transition hover:bg-[#f4573a] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>

          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="font-semibold text-[#ff6749] hover:underline"
            >
              Sign in
            </Link>
          </p>

        </div>

      </div>

    </main>
  );
}