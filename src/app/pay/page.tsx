"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SENDAVAPAY_BASE_URL, SENDAVAPAY_COUNTRIES } from "@/data/sendavapay";

const PRESETS = [7000, 12000, 21000, 25000, 35000, 50000, 100000];

interface Operator {
  id: string;
  name: string;
  requiresOtp: boolean;
  status: string;
}

export default function PayPage() {
  const router = useRouter();
  const [amount, setAmount] = useState(7000);
  const [customAmount, setCustomAmount] = useState("");
  const [countryIdx, setCountryIdx] = useState(0);
  const [operators, setOperators] = useState<Operator[]>([]);
  const [operatorsLoading, setOperatorsLoading] = useState(false);
  const [operatorIdx, setOperatorIdx] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState<"form" | "otp" | "pending">("form");
  const [paymentToken, setPaymentToken] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const country = SENDAVAPAY_COUNTRIES[countryIdx];

  useEffect(() => {
    let cancelled = false;
    setOperatorsLoading(true);
    setOperatorIdx(0);
    setOperators([]);
    fetch(`${SENDAVAPAY_BASE_URL}/operators/${country.code}`)
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return;
        const list: Operator[] = Array.isArray(d?.data) ? d.data : [];
        setOperators(list.filter((o) => o.status === "online"));
      })
      .catch(() => {
        if (!cancelled) setOperators([]);
      })
      .finally(() => {
        if (!cancelled) setOperatorsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [country.code]);

  useEffect(() => {
    if (step !== "pending" || !paymentToken) return;
    const check = async () => {
      try {
        const r = await fetch(`${SENDAVAPAY_BASE_URL}/payment-token/${paymentToken}`);
        const d = await r.json();
        const st = d?.data?.status;
        if (st === "completed") router.push("/dashboard");
        else if (st === "failed") {
          setStep("form");
          setError("Paiement échoué. Réessayez.");
        }
      } catch {}
    };
    check();
    const iv = setInterval(check, 5000);
    return () => clearInterval(iv);
  }, [step, paymentToken, router]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanPhone = phone.replace(/[\s.-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      setError("Numéro invalide.");
      return;
    }
    const op = operators[operatorIdx];
    if (!op) {
      setError("Aucun opérateur disponible pour ce pays.");
      return;
    }
    setLoading(true);
    try {
      const r1 = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phone: `${country.dial}${cleanPhone}`,
          name: name || undefined,
          country: country.code,
          currency: country.currency,
        }),
      });
      const d1 = await r1.json();
      if (!r1.ok || !d1.paymentToken) {
        setError(d1.error || "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }
      setPaymentToken(d1.paymentToken);

      const r2 = await fetch(`${SENDAVAPAY_BASE_URL}/initiate-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentToken: d1.paymentToken,
          payerName: name || "Client",
          payerPhone: `${country.dial}${cleanPhone}`,
          payerCountry: country.code,
          operatorId: op.id,
        }),
      });
      const d2 = await r2.json();
      if (d2.requiresOtp) {
        setOtpToken(d2.otpToken);
        setStatusMsg(d2.message || "Code OTP envoyé par SMS.");
        setStep("otp");
      } else if (d2.requiresRedirect) {
        window.location.href = d2.redirectUrl;
      } else if (d2.success) {
        setStatusMsg(d2.message || "Confirmez le paiement sur votre téléphone.");
        setStep("pending");
      } else {
        setError(d2.message || d2.error || "Impossible d'initier le paiement.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  const submitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const r = await fetch(`${SENDAVAPAY_BASE_URL}/submit-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otpToken, otp }),
      });
      const d = await r.json();
      if (d.success) {
        setStatusMsg("Paiement en cours. Confirmez sur votre téléphone.");
        setStep("pending");
      } else {
        setError(d.message || d.error || "OTP invalide.");
      }
    } catch {
      setError("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-md animate-slide-up">
        <Link href="/dashboard" className="text-gray-400 hover:text-gray-900 text-sm mb-4 inline-flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
          Retour
        </Link>

        {step === "otp" ? (
          <div className="card p-6 sm:p-8">
            <h1 className="text-xl font-black text-gray-900 mb-1">🔐 Code OTP</h1>
            <p className="text-sm text-gray-500 mb-6">{statusMsg}</p>
            <form onSubmit={submitOtp} className="space-y-4">
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="input-light text-center tracking-widest" placeholder="••••••" maxLength={6} required />
              {error && <div className="p-3 rounded-xl text-xs bg-flame-50 border border-flame-100 text-flame-600">{error}</div>}
              <button type="submit" disabled={loading} className="btn-brand">{loading ? "Vérification..." : "Valider le code"}</button>
            </form>
          </div>
        ) : step === "pending" ? (
          <div className="card p-6 sm:p-8 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-brand-500/10 flex items-center justify-center mb-4">
              <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
            </div>
            <h1 className="text-lg font-black text-gray-900 mb-2">Paiement en attente</h1>
            <p className="text-sm text-gray-500">{statusMsg || "Confirmez la transaction sur votre téléphone."}</p>
            <p className="text-xs text-gray-400 mt-4">Vous serez redirigé automatiquement une fois le paiement confirmé.</p>
          </div>
        ) : (
          <div className="card p-6 sm:p-8">
            <h1 className="text-xl font-black text-gray-900 mb-1">💳 Dépôt Mobile Money</h1>
            <p className="text-sm text-gray-500 mb-6">Paiement instantané via SendavaPay</p>

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Montant (FCFA)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {PRESETS.map((v) => (
                    <button key={v} type="button" onClick={() => { setAmount(v); setCustomAmount(""); }} className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${amount === v && !customAmount ? "bg-brand-500/10 border-brand-500 text-brand-500" : "bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200"}`}>
                      {v.toLocaleString("fr-FR")}
                    </button>
                  ))}
                </div>
                <input type="number" value={customAmount} onChange={(e) => { setCustomAmount(e.target.value); const n = parseInt(e.target.value); if (n > 0) setAmount(n); }} className="input-light" placeholder="Autre montant (min. 100)" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Pays</label>
                <select value={countryIdx} onChange={(e) => setCountryIdx(parseInt(e.target.value))} className="input-light">
                  {SENDAVAPAY_COUNTRIES.map((c, i) => (
                    <option key={c.code} value={i}>{c.flag} {c.name} ({c.currency})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Opérateur</label>
                {operatorsLoading ? (
                  <div className="py-3 text-xs text-gray-400">Chargement des opérateurs…</div>
                ) : operators.length === 0 ? (
                  <div className="py-3 text-xs text-gray-400">Aucun opérateur disponible.</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {operators.map((op, i) => (
                      <button key={op.id} type="button" onClick={() => setOperatorIdx(i)} className={`py-3 rounded-xl text-xs font-semibold transition-all border ${operatorIdx === i ? "bg-brand-500/10 border-brand-500 text-brand-500" : "bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200"}`}>
                        {op.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Numéro Mobile Money</label>
                <div className="input-light flex items-center gap-2">
                  <span className="text-gray-900 font-semibold shrink-0">{country.dial}</span>
                  <span className="text-gray-300">|</span>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-transparent outline-none w-full" placeholder="90 12 34 56" required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Nom (optionnel)</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-light" placeholder="Votre nom" />
              </div>

              {error && <div className="p-3 rounded-xl text-xs bg-flame-50 border border-flame-100 text-flame-600">{error}</div>}

              <button type="submit" disabled={loading} className="btn-brand">{loading ? "Envoi..." : "Payer maintenant"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
