"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function EarningsPage() {
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setData({ investments: d.investments, transactions: d.transactions });
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  const investments = data?.investments || [];
  const txFiltered = (data?.transactions || []).filter((t: any) => t.type === "investment" || t.type === "gain");
  const totalActive = investments.reduce((s: number, i: any) => s + (i.status === "active" ? parseFloat(i.amount) : 0), 0);
  const totalGains = investments.reduce((s: number, i: any) => s + parseFloat(i.totalGain), 0);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-400">Historique et suivi</p>
        <h2 className="text-xl font-black text-gray-900">📈 Mes gains</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Investissements actifs</p>
          <p className="text-xl font-black text-gray-900">{investments.filter((i: any) => i.status === "active").length}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Montant actif</p>
          <p className="text-xl font-black text-brand-500">{totalActive.toLocaleString("fr-FR")} F</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs text-gray-400 mb-1">Gains cumulés</p>
          <p className="text-xl font-black text-emerald-400">{totalGains.toLocaleString("fr-FR")} F</p>
        </div>
      </div>
{/* Active investments */}
      <div className="card p-5 mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Mes investissements</h3>
        {investments.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-6">Aucun investissement. <a href="/dashboard/invest" className="text-brand-500">Investir →</a></p>
        ) : (
          <div className="space-y-3">
            {investments.map((inv: any) => {
              const amount = parseFloat(inv.amount);
              const pct = Math.min(100, Math.round((Math.max(0, (Date.now() - new Date(inv.startDate).getTime()) / 86400000) / inv.plan.durationDays) * 100));
              const daysLeft = Math.max(0, Math.ceil((new Date(inv.endDate).getTime() - Date.now()) / 86400000));
              return (
                <div key={inv.id} onClick={() => router.push(`/dashboard/invest/${inv.id}`)}
                  className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-brand-500/20 cursor-pointer transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-900">{inv.plan.name}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400">{inv.status === "active" ? "Actif" : inv.status}</span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5">
                    <span>{amount.toLocaleString("fr-FR")} FCFA</span><span>{daysLeft}j restants</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-gray-100/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Transaction history */}
      <div className="card p-5">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Historique des transactions</h3>
        {txFiltered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">Aucune transaction</p>
        ) : (
          <div className="space-y-2">
            {txFiltered.map((tx: any) => {
              const isCredit = tx.type === "gain";
              const date = new Date(tx.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
              return (
                <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-white/[0.03] last:border-0">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCredit ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"}`}>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      {isCredit ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />}
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-900 truncate">{tx.description || tx.type}</p>
                    <p className="text-[10px] text-gray-400">{date}</p>
                  </div>
                  <span className={`text-xs font-semibold ${isCredit ? "text-emerald-400" : "text-flame-400"}`}>
                    {isCredit ? "+" : ""}{parseFloat(tx.amount).toLocaleString("fr-FR")} F
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}