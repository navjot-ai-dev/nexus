import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <main className="min-h-screen bg-[#fffdf9] px-6 py-24 text-[#17202a]">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold">
          Welcome back, {session.user.name} 👋
        </h1>

        <p className="mt-3 text-[#667085]">
          Your NEXUS workspace is ready.
        </p>
      </div>
    </main>
  );
}