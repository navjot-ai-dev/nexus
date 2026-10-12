"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { signInSchema } from "@/schemas/auth";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

    const { error: authError } = await authClient.signIn.email({
      email,
      password,
    });

    if (authError) {
      setError(authError.message || "Invalid email or password");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-5 py-12 text-[#17202a]">
      <div className="mx-auto flex min-h-[85vh] max-w-md flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo */}
          <Link href="/" className="mb-8 flex items-center justify-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px] bg-[#17202a] shadow-lg">
              <div className="h-4 w-4 rounded-full bg-[#ff6749]" />
              <div className="absolute h-7 w-7 rounded-full border border-white/20" />
            </div>

            <div>
              <div className="text-[20px] font-black tracking-[-0.04em] text-[#17202a]">
                NEXUS
              </div>
              <div className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#8a94a6]">
                Workflow OS
              </div>
            </div>
          </Link>

          {/* Card */}
          <div className="rounded-[32px] border border-[#e9e2d9] bg-white p-8 shadow-[0_20px_70px_rgba(30,41,59,0.06)]">
            <div className="mb-7 text-center">
              <h1 className="text-2xl font-black tracking-tight text-[#17202a]">
                Welcome back
              </h1>
              <p className="mt-1.5 text-xs text-[#8a94a6]">
                Sign in to your NEXUS workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#17202a]">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    required
                    className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] pl-10 pr-4 py-2.5 text-xs text-[#17202a] outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-[#17202a]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] pl-10 pr-10 py-2.5 text-xs text-[#17202a] outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a94a6] hover:text-[#17202a]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-700">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#ff6749] py-3 text-xs font-bold text-white shadow-[0_8px_25px_rgba(255,103,73,0.25)] transition hover:-translate-y-0.5 hover:bg-[#f4573a] disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to Dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign up */}
            <p className="mt-6 text-center text-xs text-[#8a94a6]">
              Don't have a NEXUS account?{" "}
              <Link
                href="/sign-up"
                className="font-bold text-[#ff6749] hover:underline"
              >
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}