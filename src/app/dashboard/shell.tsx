"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import TopNav from "@/components/TopNav";
import BottomNav from "@/components/BottomNav";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "unauthenticated") redirect("/login");
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#060B1A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-accent-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const name = session?.user?.name || "";
  const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin ?? false;

  return (
    <div className="min-h-screen bg-[#060B1A] pb-20">
      <TopNav userName={name} isAdmin={isAdmin} />
      {children}
      <BottomNav />
    </div>
  );
}