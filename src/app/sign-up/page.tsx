"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { authClient } from "@/lib/auth-client";
import { Eye, EyeOff, Lock, Mail, User, ArrowRight, Loader2 } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Failed to create account");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-6 py-12 text-[#17202a]">
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
                Create your account
              </h1>
              <p className="mt-1.5 text-xs text-[#8a94a6]">
                Start building intelligent workflows today
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#17202a]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] pl-10 pr-4 py-2.5 text-xs text-[#17202a] outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#17202a]">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full rounded-xl border border-[#e9e2d9] bg-[#fffdf9] pl-10 pr-4 py-2.5 text-xs text-[#17202a] outline-none transition focus:border-[#ff6749] focus:ring-2 focus:ring-[#ff6749]/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#17202a]">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a94a6]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
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
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Sign In */}
            <p className="mt-6 text-center text-xs text-[#8a94a6]">
              Already have an account?{" "}
              <Link
                href="/sign-in"
                className="font-bold text-[#ff6749] hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}