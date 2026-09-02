"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function InvestDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [inv, setInv] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/invest/${id}`).then(r => r.json()).then(setInv).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>;
  }
  if (!inv) {
    return <div className="max-w-lg mx-auto p-6 text-center"><p className="text-gray-400">Investissement introuvable.</p></div>;
  }

  const amount = parseFloat(inv.amount);
  const dailyGain = parseFloat(inv.dailyGain);
  const totalGain = parseFloat(inv.totalGain);
  const endDate = new Date(inv.endDate);
  const now = new Date();
  const daysElapsed = Math.max(0, Math.floor((now.getTime() - new Date(inv.startDate).getTime()) / 86400000));
  const daysTotal = Math.ceil((endDate.getTime() - new Date(inv.startDate).getTime()) / 86400000);
  const daysLeft = Math.max(0, daysTotal - daysElapsed);
  const expectedGain = dailyGain * Math.min(daysElapsed, daysTotal);
  const pct = Math.min(100, Math.round((daysElapsed / daysTotal) * 100));

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <button onClick={() => router.push("/dashboard/invest")} className="text-gray-400 hover:text-gray-900 text-sm mb-4 flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Retour
      </button>

      <div className="card p-6 mb-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-black text-gray-900">{inv.plan.name}</h2>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${inv.status === "active" ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"}`}>
            {inv.status === "active" ? "Actif" : inv.status}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Progression</span><span>{pct}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-50 overflow-hidden">
            <div className="h-full rounded-full bg-brand-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex justify-between text-[10px] text-gray-400 mt-1">
            <span>{new Date(inv.startDate).toLocaleDateString("fr-FR")}</span>
            <span>{endDate.toLocaleDateString("fr-FR")}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Montant</p>
            <p className="text-lg font-black text-brand-500">{amount.toLocaleString("fr-FR")} F</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Gain/jour</p>
            <p className="text-lg font-black text-emerald-400">{dailyGain.toLocaleString("fr-FR")} F</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Gain cumulé</p>
            <p className="text-lg font-black text-gold-400">{expectedGain.toLocaleString("fr-FR")} F</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-400 mb-1">Jours restants</p>
            <p className="text-lg font-black text-gray-900">{daysLeft}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-400">Jours écoulés</span><span>{daysElapsed} / {daysTotal}</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Gain total attendu</span><span className="text-gold-400 font-semibold">{(dailyGain * daysTotal).toLocaleString("fr-FR")} FCFA</span></div>
          <div className="flex justify-between"><span className="text-gray-400">Date de fin</span><span className="text-brand-500">{endDate.toLocaleDateString("fr-FR")}</span></div>
        </div>
      </div>
    </div>
  );
}