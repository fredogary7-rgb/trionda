"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Tableau de bord", href: "/dashboard", icon: "home" },
  { label: "Investir", href: "/dashboard/invest", icon: "wallet" },
  { label: "Mes gains", href: "/dashboard/earnings", icon: "chart" },
  { label: "Transactions", href: "/dashboard/transactions", icon: "clock" },
  { label: "Parrainage", href: "/dashboard/referral", icon: "users" },
];

const Icons: Record<string, React.ReactNode> = {
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  clock: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
  users: <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />,
};

export default function TopNav({ userName }: { userName?: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const active = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1030]/80 backdrop-blur-xl border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0">
            <div className="relative w-8 h-8">
              <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent-400 to-primary-600 shadow-[0_0_15px_rgba(0,198,255,0.3)]" />
              <div className="absolute inset-[1px] rounded-[7px] bg-[#0A1030] flex items-center justify-center">
                <svg className="w-4 h-4 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="text-lg font-black tracking-tighter hidden sm:block">TRION<span className="text-accent-400">DA</span></span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                  active(item.href) ? "bg-primary-500/10 text-accent-400" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{Icons[item.icon]}</svg>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: profile + mobile hamburger */}
          <div className="flex items-center gap-3">
            {userName && (
              <Link href="/dashboard/profile" className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/[0.03] transition-colors">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400/30 to-primary-600/30 flex items-center justify-center text-[10px] font-bold text-accent-300">
                  {userName.charAt(0)}
                </div>
                <span className="text-xs text-gray-300">{userName}</span>
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/[0.05] py-3 pb-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                  active(item.href) ? "bg-primary-500/10 text-accent-400" : "text-gray-400 hover:text-white hover:bg-white/[0.03]"
                }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{Icons[item.icon]}</svg>
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/[0.05] pt-3 mt-3 space-y-1">
              {userName && (
                <Link href="/dashboard/profile" onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-300 hover:bg-white/[0.03]">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-400/30 to-primary-600/30 flex items-center justify-center text-[10px] font-bold text-accent-300">
                    {userName.charAt(0)}
                  </div>
                  {userName}
                </Link>
              )}
              <button onClick={() => { setMenuOpen(false); signOut({ callbackUrl: "/login" }); }}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-flame-300 hover:bg-flame-500/5">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}