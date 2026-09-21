"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { signInSchema } from "@/schemas/auth";
import { authClient } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");

    // Zod validation
    const result = signInSchema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    const { error } = await authClient.signIn.email({
      email,
      password,
    });

    if (error) {
      setError(error.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-10 text-[#17202a]">
      <div className="mx-auto flex min-h-[90vh] max-w-[1200px] items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <Link href="/" className="mb-10 flex items-center justify-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#17202a] shadow-lg">
              <div className="h-4 w-4 rounded-full bg-[#ff6749]" />
              <div className="absolute h-7 w-7 rounded-full border border-white/20" />
            </div>

            <div>
              <div className="text-[20px] font-bold tracking-[-0.04em]">
                NEXUS
              </div>
              <div className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9aa3b2]">
                Workflow OS
              </div>
            </div>
          </Link>

          {/* Card */}
          <div className="rounded-[28px] border border-[#e9e2d9] bg-white p-8 shadow-[0_20px_70px_rgba(30,41,59,0.08)]">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-[-0.04em]">
                Welcome back
              </h1>

              <p className="mt-2 text-sm text-[#667085]">
                Sign in to continue building workflows.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] px-4 py-3 text-sm outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#ff6749] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            {/* Sign up */}
            <p className="mt-7 text-center text-sm text-[#667085]">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="font-semibold text-[#ff6749] hover:underline"
              >
                Create one
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}