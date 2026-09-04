"use client";

import { useEffect, useState } from "react";

const TYPE_META: Record<string, { label: string; icon: string; credit: boolean }> = {
  deposit: { label: "Dépôt", icon: "💳", credit: true },
  investment: { label: "Investissement", icon: "📈", credit: false },
  gain: { label: "Revenu quotidien", icon: "💰", credit: true },
  referral: { label: "Bonus parrainage", icon: "🤝", credit: true },
  withdrawal: { label: "Retrait", icon: "🏧", credit: false },
  credit: { label: "Crédit", icon: "➕", credit: true },
  debit: { label: "Débit", icon: "➖", credit: false },
};

const STATUS_META: Record<string, { label: string; cls: string }> = {
  pending: { label: "En attente", cls: "bg-amber-50 text-amber-600" },
  completed: { label: "Terminé", cls: "bg-emerald-50 text-emerald-600" },
  failed: { label: "Échoué", cls: "bg-flame-50 text-flame-500" },
  processing: { label: "En cours", cls: "bg-sky-50 text-sky-600" },
  queued: { label: "En file", cls: "bg-sky-50 text-sky-600" },
  reversed: { label: "Remboursé", cls: "bg-gray-100 text-gray-500" },
  cancelled: { label: "Annulé", cls: "bg-gray-100 text-gray-500" },
};

const FILTERS = [
  { key: "all", label: "Tout" },
  { key: "deposit", label: "Dépôts" },
  { key: "withdrawal", label: "Retraits" },
  { key: "gain", label: "Gains" },
  { key: "referral", label: "Parrainage" },
];

function formatDate(d: string) {
  const date = new Date(d);
  return (
    date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) +
    " · " +
    date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
  );
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/dashboard/transactions")
      .then((r) => r.json())
      .then((d) => setTransactions(d.transactions || []))
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? transactions : transactions.filter((t) => t.type === filter);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-6 flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-5">
        <p className="text-sm text-gray-400">Historique complet</p>
        <h2 className="text-xl font-black text-gray-900">🕐 Transactions</h2>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${
              filter === f.key
                ? "bg-brand-500/10 text-brand-500 border-brand-500/20"
                : "bg-white text-gray-400 border-gray-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Liste */}
      <div className="card p-5">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Aucune transaction.</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((tx: any) => {
              const meta = TYPE_META[tx.type] || { label: tx.type, icon: "•", credit: false };
              const st = STATUS_META[tx.status] || { label: tx.status || "—", cls: "bg-gray-100 text-gray-500" };
              const amt = Math.abs(parseFloat(tx.amount || "0"));
              return (
                <div key={tx.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-lg shrink-0">
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{meta.label}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-400 truncate">{tx.description || "—"}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(tx.createdAt)}</p>
                  </div>
                  <span className={`text-sm font-bold shrink-0 ${meta.credit ? "text-emerald-500" : "text-flame-500"}`}>
                    {meta.credit ? "+" : "-"}
                    {amt.toLocaleString("fr-FR")} F
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
