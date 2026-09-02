"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Accueil", href: "/dashboard", icon: "home" },
  { label: "Investir", href: "/dashboard/invest", icon: "wallet" },
  { label: "Gains", href: "/dashboard/earnings", icon: "chart" },
  { label: "Dépôt", href: "/dashboard/deposit", icon: "deposit" },
  { label: "Profil", href: "/dashboard/profile", icon: "user" },
];

const Icons: Record<string, React.ReactNode> = {
  home: <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
  wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  chart: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  deposit: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M12 6v12m-4-4l4 4 4-4" />,
  user: <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
};

export default function BottomNav() {
  const pathname = usePathname();
  const active = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A1030]/95 backdrop-blur-2xl border-t border-white/[0.06] safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        {ITEMS.map((item, i) => {
          const isActive = active(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[60px] py-1 rounded-xl transition-all duration-200 ${
                isActive ? "text-accent-400" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              <div className={`relative flex items-center justify-center w-10 h-7 rounded-lg transition-all duration-200 ${
                isActive ? "bg-primary-500/10" : ""
              }`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                  {Icons[item.icon]}
                </svg>
                {isActive && (
                  <span className="absolute -top-0.5 w-1 h-1 rounded-full bg-accent-400 shadow-[0_0_6px_rgba(0,198,255,0.6)]" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? "text-accent-400" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}