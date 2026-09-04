"use client";

import { useEffect, useState, type ReactNode } from "react";
import DashboardAnnouncementPopup from "@/components/DashboardAnnouncementPopup";

interface DashboardData {
  user: { firstName: string; lastName: string; referralCode: string };
  wallet: { balance: string; totalInvested: string; totalGains: string };
  investments: any[];
  transactions: any[];
  referralCount: number;
  plans: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const d = data!;
  const balance = parseFloat(d.wallet.balance || "0");

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-5 animate-fade-in">
      <DashboardAnnouncementPopup />
      <Greeting firstName={d.user.firstName} lastName={d.user.lastName} />
      <WalletCard balance={balance} name={`${d.user.firstName} ${d.user.lastName}`} code={d.user.referralCode} />
      <QuickActions />
      <Sections plans={d.plans} investments={d.investments} referral={{ count: d.referralCount, code: d.user.referralCode }} transactions={d.transactions} />
    </div>
  );
}

/* ── Greeting ── */
function Greeting({ firstName, lastName }: { firstName: string; lastName: string }) {
  return (
    <div className="mb-4">
      <p className="text-sm text-gray-400 mb-0.5">Bienvenue dans votre espace</p>
      <h1 className="text-xl font-extrabold text-gray-900">{firstName} <span className="text-brand-600">{lastName}</span></h1>
    </div>
  );
}

/* ── Wallet Card ── */
function WalletCard({ balance, name, code }: { balance: number; name: string; code: string }) {
  return (
    <div className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-5 sm:p-6 mb-5 shadow-lg shadow-brand-500/20">
      <div className="absolute -right-4 -top-4 w-32 h-32 rounded-full bg-white/5" />
      <div className="absolute right-8 bottom-4 w-24 h-24 rounded-full bg-white/5" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full border border-white/5" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-gray-900/60 font-medium uppercase tracking-wider">Compte principal</span>
          <span className="text-xs text-gray-900/70 font-medium bg-white/10 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />🇧🇫
          </span>
        </div>
        <p className="text-gray-900/90 text-sm font-semibold mb-4">{name}</p>
        <p className="text-[11px] text-gray-900/50 uppercase tracking-wider mb-0.5">Solde disponible</p>
        <p className="text-3xl font-black text-gray-900 tracking-tight mb-1">
          {balance.toLocaleString("fr-FR").replace(/\u202f/g, "\u00A0")}
          <span className="text-sm font-medium text-gray-900/60 ml-1.5">FCFA</span>
        </p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/10">
          <p className="text-xs text-gray-900/50">Code: {code}</p>
        </div>
      </div>
    </div>
  );
}

/* ── Quick Actions ── */
function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5 animate-slide-up">
      <a href="/dashboard/deposit" className="card card-padded flex items-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
        <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <g><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" strokeWidth={2} /><rect x="3" y="21" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" /></g>
          </svg>
        </div>
        <span className="text-sm font-bold text-brand-600">Recharger</span>
      </a>
      <a href="/dashboard/withdraw" className="card card-padded flex items-center gap-3 cursor-pointer hover:shadow-md transition-all active:scale-[0.98]">
        <div className="w-10 h-10 rounded-xl bg-flame-50 flex items-center justify-center shrink-0">
          <svg className="w-5 h-5 text-flame-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <g><path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 0L6 10m6-6l6 6" strokeWidth={2} /><rect x="3" y="1" width="18" height="2" rx="1" fill="currentColor" opacity="0.4" /></g>
          </svg>
        </div>
        <span className="text-sm font-bold text-flame-500">Retirer</span>
      </a>
    </div>
  );
}
/* ── Sections ── */
function Sections({ plans, investments, referral, transactions }: {
  plans: any[]; investments: any[]; referral: { count: number; code: string }; transactions: any[];
}) {
  return (
    <div className="space-y-5">
      <Card title="Plans d'investissement">
        {plans.length === 0 ? <Empty text="Aucun plan" /> : (
          <div className="grid grid-cols-2 gap-2.5">
            {plans.map((p: any) => (
              <a key={p.id} href="/dashboard/invest" className="p-3 rounded-2xl bg-gray-50 border border-gray-100 hover:border-brand-200 hover:bg-brand-50/50 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-900">{p.name}</p>
                  <span className="text-[10px] font-bold text-brand-600 bg-brand-100 px-1.5 py-0.5 rounded-full">+{p.dailyReturn}%/j</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className="text-[10px] text-gray-400">Dès <span className="text-gray-900 font-semibold">{parseFloat(p.minAmount).toLocaleString("fr-FR")} F</span></p>
                  <svg className="w-3.5 h-3.5 text-brand-400 opacity-0 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </div>
              </a>
            ))}
          </div>
        )}
      </Card>

      <Card title="Mes investissements">
        {investments.length === 0 ? <Empty text="Aucun investissement" action="Investir →" href="/dashboard/invest" /> : (
          <div className="space-y-2.5">
            {investments.map((inv: any) => {
              const pct = inv.totalGain && inv.amount ? Math.min(100, Math.round((parseFloat(inv.totalGain) / parseFloat(inv.amount)) * 100)) : 0;
              return (
                <div key={inv.id} className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-gray-900">{inv.plan.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600">{inv.status === "active" ? "Actif" : inv.status}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
                    <span>{parseFloat(inv.amount).toLocaleString("fr-FR")} FCFA</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-400 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card title="Parrainage">
        <div className="text-center py-2">
          <p className="text-3xl font-black text-brand-600 mb-1">{referral.count}</p>
          <p className="text-xs text-gray-400 mb-3">filleuls</p>
          <div className="bg-gray-100 rounded-xl px-3 py-2.5 text-xs text-gray-700 font-mono tracking-wider font-semibold">{referral.code}</div>
          <p className="text-[11px] text-gray-400 mt-2">Partagez votre code</p>
        </div>
      </Card>

      <Card title="Dernières transactions">
        {transactions.length === 0 ? <Empty text="Aucune transaction" /> : (
          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx: any) => {
              const isCredit = tx.type === "deposit" || tx.type === "gain" || tx.type === "referral" || tx.type === "wheel";
              const date = new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
              return (
                <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-100 text-emerald-600" : "bg-flame-100 text-flame-500"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {isCredit ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-800 truncate">{tx.description || tx.type}</p>
                    <p className="text-[10px] text-gray-400">{date}</p>
                  </div>
                  <span className={`text-xs font-semibold ${isCredit ? "text-emerald-600" : "text-flame-500"}`}>
                    {isCredit ? "+" : ""}{Math.abs(parseFloat(tx.amount)).toLocaleString("fr-FR")} F
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

/* ── Card ── */
function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="card card-padded">
      <h3 className="text-sm font-bold text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ── Empty ── */
function Empty({ text, action, href }: { text: string; action?: string; href?: string }) {
  return (
    <div className="text-center py-5">
      <p className="text-sm text-gray-400 mb-3">{text}</p>
      {action && href && <a href={href} className="text-xs font-semibold text-brand-500">{action}</a>}
    </div>
  );
}