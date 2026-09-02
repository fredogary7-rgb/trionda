"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PLANS from "@/data/plans";

export default function InvestPage() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<typeof PLANS[0] | null>(null);
  const [step, setStep] = useState<"plans" | "confirm" | "done">("plans");
  const [buying, setBuying] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setBalance(parseFloat(d.wallet?.balance || "0"));
    }).finally(() => setLoading(false));
  }, []);

  const handleBuy = async () => {
    if (!selected) return;
    setBuying(true); setError("");
    try {
      const plan = PLANS.find(p => p.amount === selected.amount)!;
      const res = await fetch("/api/invest", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ planId: `plan-${plan.amount}` }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error); setBuying(false); return; }
      setResult(data.investment);
      setBalance(b => b - selected.amount);
      setStep("done");
    } catch { setError("Erreur réseau."); }
    finally { setBuying(false); }
  };

  if (loading) {
    return (<div className="max-w-7xl mx-auto p-6 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>);
  }
// Step 3: Success
  if (step === "done" && result) {
    return (
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <div className="card p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">Investissement confirmé !</h2>
          <p className="text-gray-400 text-sm mb-6">Votre plan est maintenant actif.</p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="text-gray-900 font-medium">{result.plan}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Montant</span><span className="text-brand-500 font-bold">{result.amount.toLocaleString("fr-FR")} FCFA</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Gain/jour</span><span className="text-emerald-400">{result.dailyGain.toLocaleString("fr-FR")} FCFA</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Gain total</span><span className="text-gold-400 font-semibold">{result.totalGain.toLocaleString("fr-FR")} FCFA</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Durée</span><span>{result.durationDays} jours</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Fin</span><span className="text-brand-500">{new Date(result.endDate).toLocaleDateString("fr-FR")}</span></div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => { setSelected(null); setStep("plans"); }} className="flex-1 btn-outline text-sm py-3">Acheter un autre</button>
            <button onClick={() => router.push(`/dashboard/invest/${result.id}`)} className="flex-1 btn-primary text-sm py-3">Suivre →</button>
          </div>
        </div>
      </div>
    );
  }
// Step 2: Confirmation
  if (step === "confirm" && selected) {
    return (
      <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
        <button onClick={() => setStep("plans")} className="text-gray-400 hover:text-gray-900 text-sm mb-4 flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Retour
        </button>
        <div className="card p-6">
          <h2 className="text-lg font-black text-gray-900 mb-6">Confirmer l&apos;investissement</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-400">Plan</span><span className="text-gray-900 font-medium">{selected.name}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Montant</span><span className="text-brand-500 font-bold">{selected.amount.toLocaleString("fr-FR")} FCFA</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Gain/jour</span><span className="text-emerald-400">{selected.dailyGain.toLocaleString("fr-FR")} FCFA ({selected.dailyReturn}%)</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Gain total</span><span className="text-gold-400 font-semibold">{selected.totalGain.toLocaleString("fr-FR")} FCFA</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">ROI</span><span className="text-gray-900">{selected.roi}%</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Durée</span><span>{selected.durationDays} jours</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-400">Votre solde</span><span className={balance < selected.amount ? "text-flame-400" : "text-gray-900"}>{balance.toLocaleString("fr-FR")} FCFA</span></div>
          </div>
          {balance < selected.amount && <div className="mb-4 p-3 bg-flame-500/10 border border-flame-500/20 rounded-xl text-xs text-flame-300">Solde insuffisant. Rechargez votre compte.</div>}
          {error && <div className="mb-4 p-3 bg-flame-500/10 border border-flame-500/20 rounded-xl text-xs text-flame-300">{error}</div>}
          <button onClick={handleBuy} disabled={buying || balance < selected.amount} className="btn-primary">{buying ? "Traitement..." : `Acheter pour ${selected.amount.toLocaleString("fr-FR")} FCFA`}</button>
        </div>
      </div>
    );
  }
// Step 1: Plan selection
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">Choisissez un plan</p>
          <h2 className="text-xl font-black text-gray-900">💰 Investir</h2>
        </div>
        <div className="bg-white rounded-xl px-4 py-2">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Solde</p>
          <p className="text-sm font-bold text-gray-900">{balance.toLocaleString("fr-FR")} FCFA</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {PLANS.map((plan) => (
          <button key={plan.amount} onClick={() => { setSelected(plan); setStep("confirm"); setError(""); }}
            className="card p-4 text-left hover:border-brand-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-900">{plan.name}</span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: plan.color }} />
            </div>
            <p className="text-2xl font-black text-gray-900 mb-1">{plan.amount.toLocaleString("fr-FR")} <span className="text-xs text-gray-400">FCFA</span></p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded font-medium">+{plan.dailyReturn}%/j</span>
              <span className="text-xs text-gray-400">{plan.durationDays} jours</span>
            </div>
            <p className="text-xs text-gray-400">+{plan.totalGain.toLocaleString("fr-FR")} FCFA · ROI {plan.roi}%</p>
          </button>
        ))}
      </div>
    </div>
  );
}