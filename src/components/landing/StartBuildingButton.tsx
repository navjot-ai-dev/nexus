"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth-client";

export default function StartBuildingButton() {
  const { data: session, isPending } = authClient.useSession();

  // Prevent the wrong destination while session is loading
  if (isPending) {
    return (
      <span
        className="rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)]"
      >
        Start building
        <span className="ml-2">→</span>
      </span>
    );
  }

  return (
    <Link
      href={session ? "/dashboard" : "/sign-up"}
      className="rounded-xl bg-[#ff6749] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_25px_rgba(255,103,73,0.22)] transition hover:-translate-y-0.5 hover:bg-[#f4573a]"
    >
      Start building
      <span className="ml-2">→</span>
    </Link>
  );
}