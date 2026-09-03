"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { label: "Accueil", href: "/dashboard", icon: "home" },
  { label: "Investir", href: "/dashboard/invest", icon: "wallet" },
  { label: "Dépôt", href: "/dashboard/referral", icon: "deposit" },
  { label: "Gains", href: "/dashboard/earnings", icon: "chart" },
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
  const active = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100 safe-area-bottom">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-1">
        {ITEMS.map((item) => {
          const isActive = active(item.href);
          return (
            <Link key={item.href} href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] py-1 rounded-xl transition-all ${
                isActive ? "text-brand-600" : "text-gray-400 hover:text-gray-600"
              }`}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isActive ? 2 : 1.5}>
                {Icons[item.icon]}
              </svg>
              <span className={`text-[10px] font-semibold ${isActive ? "text-brand-600" : ""}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}