"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ArrowRight } from "lucide-react";

export default function StartBuildingButton({ className = "" }: { className?: string }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <span
        className={`inline-flex items-center gap-2 rounded-xl bg-[#ff6749] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] opacity-80 ${className}`}
      >
        <span>Start Building</span>
        <ArrowRight className="h-4 w-4" />
      </span>
    );
  }

  return (
    <Link
      href={session ? "/dashboard" : "/sign-in"}
      className={`inline-flex items-center gap-2 rounded-xl bg-[#ff6749] px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a] hover:shadow-[0_12px_30px_rgba(255,103,73,0.3)] ${className}`}
    >
      <span>Start Building</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}