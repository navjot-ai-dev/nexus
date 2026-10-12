"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";

export default function StartBuildingButton({ className = "" }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-md opacity-80 ${className}`}
      >
        <span>Start Building</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    );
  }

  return (
    <Link
      href={session ? "/dashboard" : "/sign-in"}
      className={`inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-900 hover:shadow-lg active:translate-y-0 ring-1 ring-white/10 ${className}`}
    >
      <span>Start Building</span>
      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}