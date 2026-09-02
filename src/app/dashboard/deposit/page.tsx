"use client";

import { useEffect, useState } from "react";

const PRESETS = [7000, 12000, 21000, 25000, 35000, 50000, 100000];
const ACCOUNT_NUMBER = "07940067";
const ACCOUNT_NAME = "Toure Ramata";

export default function DepositPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [amount, setAmount] = useState(7000);
  const [customAmount, setCustomAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [paidAmount, setPaidAmount] = useState(0);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const selectPreset = (val: number) => { setAmount(val); setCustomAmount(""); setMsg({ type: "", text: "" }); };
  const handleCustom = (val: string) => { setCustomAmount(val); const n = parseInt(val); if (n && n > 0) setAmount(n); };

  const goStep2 = () => { if (amount < 500) { setMsg({ type: "error", text: "Montant minimum 500 FCFA." }); return; } setStep(2); setMsg({ type: "", text: "" }); };

  const goStep3 = async () => {
    if (!phone || phone.trim().length < 8) { setMsg({ type: "error", text: "Numéro valide requis." }); return; }
    setSubmitting(true); setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/deposit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ amount, phone }) });
      const data = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: data.error }); setSubmitting(false); return; }
      setStep(3);
    } catch { setMsg({ type: "error", text: "Erreur réseau." }); }
    finally { setSubmitting(false); }
  };

  const verifyPayment = () => {
    setPaidAmount(amount);
    setMsg({ type: "success", text: "Paiement détecté ! Redirection..." });
    setTimeout(() => { window.location.href = "/dashboard"; }, 2000);
  };

  const copyText = (text: string) => { navigator.clipboard.writeText(text); setMsg({ type: "success", text: "Copié !" }); setTimeout(() => setMsg({ type: "", text: "" }), 2000); };

  // Step 1: Select amount
  if (step === 1) {
    return renderStep1(amount, customAmount, PRESETS, selectPreset, handleCustom, msg, goStep2);
  }

  // Step 2: Enter phone
  if (step === 2) {
    return renderStep2(amount, phone, setPhone, msg, goStep3, () => setStep(1), submitting);
  }

  // Step 3: Payment instructions
  return renderStep3(amount, phone, ACCOUNT_NUMBER, ACCOUNT_NAME, paidAmount, msg, copyText, verifyPayment, () => setStep(1));
}
function renderStep1(amount: number, custom: string, presets: number[], select: (v: number) => void, onCustom: (v: string) => void, msg: {type:string,text:string}, next: () => void) {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6"><p className="text-sm text-gray-400">Recharger votre compte</p><h2 className="text-xl font-black text-gray-900">💳 Dépôt Orange Money</h2></div>
      <div className="card p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Montant de la recharge</p>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {presets.map(v => (
            <button key={v} onClick={() => select(v)} className={`py-3 rounded-xl text-sm font-semibold transition-all border ${amount === v && !custom ? "bg-brand-500/10 border-brand-500 text-brand-500" : "bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200"}`}>{v.toLocaleString("fr-FR")}</button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mb-2">Ou saisissez un autre montant</p>
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
          <span className="text-sm text-gray-400 mr-2 font-bold">XOF</span>
          <input type="number" value={custom} onChange={e => onCustom(e.target.value)} className="bg-transparent outline-none w-full text-sm font-semibold text-gray-900 placeholder-gray-400" placeholder="Saisissez le montant" />
        </div>
      </div>
      <div className="card p-5 mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3">Mode de recharge</p>
        <div className="flex items-center justify-between bg-[#0A1030] rounded-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center text-sm">🍊</div>
            <div><p className="text-sm font-medium text-gray-900">Orange Money</p><p className="text-[10px] text-gray-400">Burkina Faso</p></div>
          </div>
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
        </div>
      </div>
      {msg.text && <div className={`mb-4 p-3 rounded-xl text-xs ${msg.type==="error"?"bg-flame-500/10 text-flame-400":"bg-emerald-500/10 text-emerald-400"}`}>{msg.text}</div>}
      <button onClick={next} className="btn-primary">Continuer</button>
      <p className="text-[11px] text-gray-400 text-center mt-4">Si le paiement n&apos;est pas arrivé, veuillez contacter le support.</p>
    </div>
  );
}
function renderStep2(amount: number, phone: string, setPhone: (v: string) => void, msg: {type:string,text:string}, next: () => void, back: () => void, loading: boolean) {
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <button onClick={back} className="text-gray-400 hover:text-gray-900 text-sm mb-4 flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>Retour</button>
      <div className="card p-6">
        <div className="text-center mb-5"><div className="text-lg font-black text-brand-500 tracking-wider mb-1">GOPAY</div><p className="text-xs text-gray-400">Paiement sécurisé</p></div>
        <div className="bg-gray-50 rounded-xl p-3 text-center mb-5"><p className="text-xs text-gray-400">Montant de paiement</p><p className="text-xl font-black text-brand-500">{amount.toLocaleString("fr-FR")} FCFA</p></div>
        <p className="text-xs text-gray-400 text-center mb-4">Mode de paiement</p>
        <div className="flex justify-center mb-5">
          <div className="bg-orange-500/10 border-2 border-orange-500/30 rounded-xl px-6 py-3 text-center">
            <div className="bg-orange-500 text-gray-900 font-bold text-xs px-3 py-1 rounded-lg inline-block mb-1">orange</div>
            <p className="text-xs text-orange-400 font-semibold">ORANGE MONEY</p>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-2">Numéro de téléphone</p>
        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 mb-4">
          <span className="text-sm text-gray-400 mr-2">+226</span>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="bg-transparent outline-none w-full text-sm text-gray-900 placeholder-gray-400" placeholder="Votre numéro Orange" />
        </div>
        <div className="flex items-start gap-2 p-3 bg-flame-500/5 border border-flame-500/10 rounded-xl mb-5">
          <span className="text-flame-400 text-sm shrink-0">⚠️</span>
          <p className="text-[11px] text-flame-300">Un numéro incorrect peut entraîner la perte des fonds.</p>
        </div>
        {msg.text && <div className={`mb-4 p-3 rounded-xl text-xs ${msg.type==="error"?"bg-flame-500/10 text-flame-400":"bg-emerald-500/10 text-emerald-400"}`}>{msg.text}</div>}
        <button onClick={next} disabled={loading} className="btn-primary">{loading ? "Traitement..." : "Confirmer →"}</button>
      </div>
    </div>
  );
}
function renderStep3(amount: number, phone: string, accNum: string, accName: string, paid: number, msg: {type:string,text:string}, copy: (t: string) => void, verify: () => void, restart: () => void) {
  const ussd = `*144*2*1*${accNum}*${amount}#`;
  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <div className="card p-6">
        <h3 className="text-base font-bold text-gray-900 mb-1">Effectuez le paiement</h3>
        <p className="text-xs text-gray-400 mb-4">Copiez le compte <span className="text-orange-400 font-semibold">ORANGE</span> et effectuez le paiement</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Montant à payer</span>
            <span className="text-sm font-bold text-brand-500">{amount.toLocaleString("fr-FR")} FCFA</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Compte Orange</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900 font-mono">{accNum}</span>
              <button onClick={() => copy(accNum)} className="text-xs text-brand-500 hover:text-brand-400">📋</button>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Nom du compte</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-900">{accName}</span>
              <button onClick={() => copy(accName)} className="text-xs text-brand-500 hover:text-brand-400">📋</button>
            </div>
          </div>
        </div>

        <a href={`tel:${encodeURIComponent(ussd)}`} className="block w-full bg-orange-500 hover:bg-orange-600 text-gray-900 font-semibold py-3.5 rounded-xl text-center text-sm transition-colors mb-3">
          📱 Cliquez pour payer
        </a>

        <div className="bg-gray-50 rounded-xl p-3 mb-5 flex items-center justify-between">
          <span className="text-xs font-mono text-orange-400 font-semibold break-all mr-2">{ussd}</span>
          <button onClick={() => copy(ussd)} className="text-xs bg-brand-500/10 text-brand-500 px-2 py-1 rounded-lg shrink-0">📋</button>
        </div>

        {msg.text && <div className={`mb-4 p-3 rounded-xl text-xs ${msg.type==="error"?"bg-flame-500/10 text-flame-400":"bg-emerald-500/10 text-emerald-400"}`}>{msg.text}</div>}

        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-gray-900 mb-1">Paiement effectué ?</p>
          <p className="text-[11px] text-gray-400 mb-3">Cliquez sur <span className="text-brand-500 font-bold">Vérifier</span> pour confirmer</p>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] text-gray-400">Montant payé</span>
              <p className={`font-bold text-sm ${paid > 0 ? "text-emerald-400" : "text-gray-400"}`}>{paid > 0 ? `${paid.toLocaleString("fr-FR")} FCFA` : "XOF 0"}</p>
            </div>
            <button onClick={verify} className="bg-brand-500 hover:bg-accent-500 text-gray-900 text-xs font-bold px-5 py-2.5 rounded-xl transition-colors">Vérifier</button>
          </div>
        </div>

        <button onClick={restart} className="w-full mt-4 py-2.5 text-xs text-gray-400 hover:text-gray-900 transition-colors">← Nouveau dépôt</button>
      </div>
    </div>
  );
}