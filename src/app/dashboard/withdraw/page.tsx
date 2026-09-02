"use client";

import { useEffect, useState } from "react";

export default function WithdrawPage() {
  const [balance, setBalance] = useState(0);
  const [hasActiveInvest, setHasActiveInvest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const fetchData = () => {
    setLoading(true);
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setBalance(parseFloat(d.wallet?.balance || "0"));
      setHasActiveInvest(d.investments?.some((i: any) => i.status === "active") ?? false);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const reset = () => { setDone(false); setAmount(""); setPhone(""); setName(""); fetchData(); };

  const handleSubmit = async () => {
    const amt = parseInt(amount);
    if (!amt || amt < 500) { setMsg({ type: "error", text: "Montant minimum 500 FCFA." }); return; }
    if (amt > balance) { setMsg({ type: "error", text: "Solde insuffisant." }); return; }
    if (!phone || phone.trim().length < 8) { setMsg({ type: "error", text: "Numéro valide requis." }); return; }

    setSubmitting(true); setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/withdraw", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt, phone, name }),
      });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error }); setSubmitting(false); return; }
      setDone(true);
    } catch { setMsg({ type: "error", text: "Erreur réseau." }); }
    finally { setSubmitting(false); }
  };
if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-accent-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 text-center">
        <div className="glass-card p-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          </div>
          <h2 className="text-xl font-black text-white mb-2">Retrait demandé !</h2>
          <p className="text-gray-400 text-sm mb-4">
            Votre demande de <span className="text-accent-400 font-bold">{parseInt(amount).toLocaleString("fr-FR")} FCFA</span> est enregistrée.
          </p>
          <p className="text-xs text-gray-500 mb-6">Traitement sous 24-48h.</p>
          <button onClick={reset} className="btn-primary text-sm">Nouveau retrait</button>
        </div>
      </div>
    );
return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Retirer vos gains</p>
        <h2 className="text-xl font-black text-white">💸 Retrait</h2>
      </div>

      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-gray-300">Solde disponible</p>
          <p className="text-lg font-black text-accent-400">{balance.toLocaleString("fr-FR")} FCFA</p>
        </div>

        {!hasActiveInvest ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-flame-500/10 flex items-center justify-center">
              <svg className="w-6 h-6 text-flame-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-flame-300 mb-1">Aucun investissement actif</p>
            <p className="text-xs text-gray-500 mb-4">Vous devez avoir un investissement en cours pour retirer.</p>
            <a href="/dashboard/invest" className="text-accent-400 text-sm font-medium">Investir maintenant →</a>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Montant (FCFA)</label>
              <div className="flex items-center bg-[#0A0F1E] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-sm text-gray-500 mr-2">XOF</span>
                <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm font-semibold text-white placeholder-gray-600"
                  placeholder="Ex: 25000" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Numéro Orange Money</label>
              <div className="flex items-center bg-[#0A0F1E] border border-white/[0.08] rounded-xl px-4 py-3">
                <span className="text-sm text-gray-500 mr-2">+226</span>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="bg-transparent outline-none w-full text-sm text-white placeholder-gray-600"
                  placeholder="Votre numéro Orange" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Nom du bénéficiaire</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="glass-input py-2.5 text-sm" placeholder="Nom sur le compte Orange" />
            </div>
            <div className="flex items-start gap-2 p-3 bg-flame-500/5 border border-flame-500/10 rounded-xl">
              <span className="text-flame-400 text-sm shrink-0">⚠️</span>
              <p className="text-[11px] text-flame-300">Vérifiez le numéro et le montant. Traitement sous 24-48h.</p>
            </div>
            {msg.text && (
              <div className={`p-3 rounded-xl text-xs ${msg.type === "error" ? "bg-flame-500/10 text-flame-400" : "bg-emerald-500/10 text-emerald-400"}`}>{msg.text}</div>
            )}
            <button onClick={handleSubmit} disabled={submitting}
              className="btn-primary">{submitting ? "Traitement..." : "Demander le retrait"}</button>
          </div>
        )}
      </div>
    </div>
  );
}
  }