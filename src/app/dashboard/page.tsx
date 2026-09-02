"use client";

import { useEffect, useState } from "react";

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
    fetch("/api/dashboard").then((r) => r.json()).then(setData).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-accent-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  const d = data!;
  const balance = parseFloat(d.wallet.balance || "0");
  const invested = parseFloat(d.wallet.totalInvested || "0");
  const gains = parseFloat(d.wallet.totalGains || "0");

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-500 mb-1">Bon retour,</p>
        <h1 className="text-2xl font-black text-white">
          {d.user.firstName} <span className="text-accent-400">{d.user.lastName}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <WalletCard
          icon="wallet"
          label="Solde disponible"
          amount={balance}
          color="blue"
          hint="Rechargeable"
        />
        <WalletCard
          icon="chart"
          label="Total investi"
          amount={invested}
          color="gold"
          hint="En cours"
        />
        <WalletCard
          icon="gains"
          label="Gains totaux"
          amount={gains}
          color="green"
          hint="Cumulés"
        />
      </div>

      {/* Quick Actions: Dépôt / Retrait */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <QuickAction
          href="/dashboard/deposit"
          icon="deposit"
          label="Dépôt"
          desc="Recharger mon compte"
          color="text-emerald-400"
          bg="bg-emerald-500/10"
          border="border-emerald-500/20"
        />
        <QuickAction
          href="/dashboard/withdraw"
          icon="withdraw"
          label="Retrait"
          desc="Retirer mes gains"
          color="text-flame-400"
          bg="bg-flame-500/10"
          border="border-flame-500/20"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <PlansSection plans={d.plans} />
          <InvestmentsSection investments={d.investments} />
        </div>
        <div className="space-y-6">
          <ReferralSection count={d.referralCount} code={d.user.referralCode} />
          <TransactionsSection transactions={d.transactions} />
        </div>
      </div>
    </div>
  );
}
function WalletCard({ icon, label, amount, color, hint }: {
  icon: string; label: string; amount: number; color: "blue" | "gold" | "green"; hint: string;
}) {
  const gradients: Record<string, string> = {
    blue: "from-primary-500/20 via-primary-500/5 to-transparent",
    gold: "from-gold-500/20 via-gold-500/5 to-transparent",
    green: "from-emerald-500/20 via-emerald-500/5 to-transparent",
  };
  const glows: Record<string, string> = {
    blue: "bg-primary-500/20",
    gold: "bg-gold-500/20",
    green: "bg-emerald-500/20",
  };
  const iconsBg: Record<string, string> = {
    blue: "bg-primary-500/15",
    gold: "bg-gold-500/15",
    green: "bg-emerald-500/15",
  };
  const iconsBorder: Record<string, string> = {
    blue: "border-primary-500/20",
    gold: "border-gold-500/20",
    green: "border-emerald-500/20",
  };
  const textColors: Record<string, string> = {
    blue: "text-primary-400",
    gold: "text-gold-400",
    green: "text-emerald-400",
  };
  const glowRings: Record<string, string> = {
    blue: "bg-primary-500/10",
    gold: "bg-gold-500/10",
    green: "bg-emerald-500/10",
  };

  const svgIcons: Record<string, React.ReactNode> = {
    wallet: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M7 10v8m4-6v6m2-4v4m4-2v2" strokeWidth={2} />,
    chart: <><path strokeLinecap="round" strokeLinejoin="round" d="M3 17l6-6 4 4 8-8" strokeWidth={2} /><circle cx="19" cy="5" r="2" fill="currentColor" stroke="none" /></>,
    gains: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" strokeWidth={2} /><rect x="3" y="21" width="18" height="2" rx="1" fill="currentColor" opacity="0.5" /></>,
  };

  return (
    <div className="glass-card p-4 sm:p-5 relative overflow-hidden group cursor-default">
      {/* Fond dégradé */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[color]} opacity-40`} />
      {/* Grand cercle glow en arrière-plan */}
      <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full ${glowRings[color]} blur-2xl group-hover:scale-125 transition-transform duration-700`} />
      {/* Petit cercle décoratif */}
      <div className={`absolute -right-2 -top-2 w-16 h-16 rounded-full ${glows[color]} blur-xl`} />

      <div className="relative z-10">
        {/* Icône + label */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className={`w-8 h-8 rounded-lg ${iconsBg[color]} ${iconsBorder[color]} border flex items-center justify-center`}>
            <svg className={`w-4 h-4 ${textColors[color]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {svgIcons[icon]}
            </svg>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 font-medium uppercase tracking-wider leading-none">{label}</p>
            <p className={`text-[10px] ${textColors[color]} opacity-70`}>{hint}</p>
          </div>
        </div>

        {/* Montant avec séparateur de milliers */}
        <p className={`text-xl sm:text-2xl font-black ${textColors[color]} tracking-tight`}>
          {amount.toLocaleString("fr-FR").replace(/\u202f/g, "\u00A0")}
          <span className="text-[10px] font-medium text-gray-600 ml-1">FCFA</span>
        </p>

        {/* Barre de progression décorative */}
        <div className="mt-3 w-full h-1 rounded-full bg-white/[0.03] overflow-hidden">
          <div className={`h-full rounded-full ${amount > 0 ? textColors[color].replace("text-", "bg-") : "bg-transparent"}`}
            style={{ width: `${amount > 0 ? 40 + Math.min(60, Math.round(amount / 50000 * 60)) : 0}%`, transition: "width 1.5s ease-out" }} />
        </div>
      </div>
    </div>
  );
}

/* ── Section Wrapper ── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ── Plans ── */
function PlansSection({ plans }: { plans: any[] }) {
  if (plans.length === 0) return <Section title="Plans d'investissement"><p className="text-sm text-gray-500 text-center py-4">Aucun plan disponible</p></Section>;
  return (
    <Section title="Plans d'investissement">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {plans.map((plan: any) => (
          <div key={plan.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:border-primary-500/20 transition-all group cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{plan.durationDays} jours</p>
              </div>
              <div className="text-xs font-bold text-gold-400 bg-gold-400/10 px-2 py-0.5 rounded-full">+{plan.dailyReturn}%/j</div>
            </div>
            <div className="flex items-end justify-between">
              <p className="text-xs text-gray-500">Dès <span className="text-white font-medium">{parseFloat(plan.minAmount).toLocaleString("fr-FR")} FCFA</span></p>
              <svg className="w-4 h-4 text-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
/* ── Investments ── */
function InvestmentsSection({ investments }: { investments: any[] }) {
  if (investments.length === 0) {
    return (
      <Section title="Mes investissements actifs">
        <div className="text-center py-6">
          <p className="text-sm text-gray-500 mb-3">Aucun investissement actif.</p>
          <a href="/dashboard/invest" className="text-xs font-medium text-accent-400 hover:text-accent-300">Investir maintenant →</a>
        </div>
      </Section>
    );
  }
  return (
    <Section title="Mes investissements actifs">
      <div className="space-y-3">
        {investments.map((inv: any) => {
          const pct = inv.totalGain && inv.amount ? Math.min(100, Math.round((parseFloat(inv.totalGain) / parseFloat(inv.amount)) * 100)) : 0;
          const daysLeft = Math.max(0, Math.ceil((new Date(inv.endDate).getTime() - Date.now()) / 86400000));
          return (
            <div key={inv.id} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-white">{inv.plan.name}</span>
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{inv.status === "active" ? "Actif" : inv.status}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                <span>{parseFloat(inv.amount).toLocaleString("fr-FR")} FCFA</span>
                <span>{daysLeft}j restants</span>
              </div>
              <div className="w-full h-1 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-400 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

/* ── Referral ── */
function ReferralSection({ count, code }: { count: number; code: string }) {
  return (
    <Section title="Parrainage">
      <div className="text-center py-3">
        <p className="text-3xl font-black text-gradient mb-1">{count}</p>
        <p className="text-xs text-gray-500 mb-3">filleuls</p>
        <div className="bg-white/[0.03] rounded-lg px-3 py-2 text-xs text-gray-300 font-mono tracking-wider">{code}</div>
        <p className="text-[11px] text-gray-600 mt-2">Partagez votre code de parrainage</p>
      </div>
    </Section>
  );
}

/* ── Transactions ── */
function TransactionsSection({ transactions }: { transactions: any[] }) {
  if (transactions.length === 0) {
    return (
      <Section title="Dernières transactions">
        <p className="text-sm text-gray-500 text-center py-4">Aucune transaction</p>
      </Section>
    );
  }
  return (
    <Section title="Dernières transactions">
      <div className="space-y-2">
        {transactions.slice(0, 6).map((tx: any) => {
          const isCredit = tx.type === "deposit" || tx.type === "gain";
          const date = new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" });
          return (
            <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"}`}>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isCredit ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white truncate">{tx.description || tx.type}</p>
                <p className="text-[10px] text-gray-600">{date}</p>
              </div>
              <span className={`text-xs font-semibold ${isCredit ? "text-emerald-400" : "text-flame-400"}`}>
                {isCredit ? "+" : "-"}{parseFloat(tx.amount).toLocaleString("fr-FR")} F
              </span>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
/* ── Quick Action Card ── */
function QuickAction({ href, icon, label, desc, color, bg, border }: {
  href: string; icon: string; label: string; desc: string;
  color: string; bg: string; border: string;
}) {
  const icons: Record<string, React.ReactNode> = {
    deposit: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" strokeWidth={2} />
        <rect x="3" y="21" width="18" height="2" rx="1" fill="currentColor" />
      </g>
    ),
    withdraw: (
      <g>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 0L6 10m6-6l6 6" strokeWidth={2} />
        <rect x="3" y="1" width="18" height="2" rx="1" fill="currentColor" />
      </g>
    ),
  };

  return (
    <a href={href} className={`glass-card p-4 flex items-center gap-4 group cursor-pointer hover:${border} transition-all`}>
      <div className={`w-10 h-10 rounded-xl ${bg} ${border} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
        <svg className={`w-5 h-5 ${color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {icons[icon]}
        </svg>
      </div>
      <div>
        <p className={`text-sm font-bold ${color}`}>{label}</p>
        <p className="text-[11px] text-gray-500">{desc}</p>
      </div>
      <svg className="w-4 h-4 text-gray-600 ml-auto group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </a>
  );
}