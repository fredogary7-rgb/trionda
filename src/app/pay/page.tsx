"use client";

import { useState } from "react";
import Link from "next/link";
import { SENDAVAPAY_COUNTRIES, SENDAVAPAY_SERVICES } from "@/data/sendavapay";

const PRESETS = [7000, 12000, 21000, 25000, 35000, 50000, 100000];

export default function PayPage() {
  const [amount, setAmount] = useState(7000);
  const [customAmount, setCustomAmount] = useState("");
  const [countryIdx, setCountryIdx] = useState(0);
  const [operatorIdx, setOperatorIdx] = useState(0);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const country = SENDAVAPAY_COUNTRIES[countryIdx];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const cleanPhone = phone.replace(/[\s.-]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      setError("Numéro invalide.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, phone: `${country.dial}${cleanPhone}`, name: name || undefined, operator: SENDAVAPAY_SERVICES[operatorIdx].name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur");
        setLoading(false);
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError("Erreur réseau.");
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

        <div className="card p-6 sm:p-8">
          <h1 className="text-xl font-black text-gray-900 mb-1">💳 Dépôt Mobile Money</h1>
          <p className="text-sm text-gray-500 mb-6">Paiement instantané et sécurisé via SendavaPay</p>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Montant (FCFA)</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {PRESETS.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => { setAmount(v); setCustomAmount(""); }}
                    className={`py-2.5 rounded-xl text-sm font-semibold transition-all border ${
                      amount === v && !customAmount
                        ? "bg-brand-500/10 border-brand-500 text-brand-500"
                        : "bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200"
                    }`}
                  >
                    {v.toLocaleString("fr-FR")}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => {
                  setCustomAmount(e.target.value);
                  const n = parseInt(e.target.value);
                  if (n > 0) setAmount(n);
                }}
                className="input-light"
                placeholder="Autre montant (min. 500)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Pays</label>
              <select value={countryIdx} onChange={(e) => setCountryIdx(parseInt(e.target.value))} className="input-light">
                {SENDAVAPAY_COUNTRIES.map((c, i) => (
                  <option key={c.code} value={i}>
                    {c.flag} {c.name} ({c.dial})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Opérateur</label>
              <div className="grid grid-cols-3 gap-2">
                {SENDAVAPAY_SERVICES.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    onClick={() => setOperatorIdx(i)}
                    className={`py-3 rounded-xl text-xs font-semibold transition-all border ${
                      operatorIdx === i
                        ? "bg-brand-500/10 border-brand-500 text-brand-500"
                        : "bg-gray-50 border-gray-100 text-gray-900 hover:border-gray-200"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Numéro Mobile Money</label>
              <div className="input-light flex items-center gap-2">
                <span className="text-gray-900 font-semibold shrink-0">{country.dial}</span>
                <span className="text-gray-300">|</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-transparent outline-none w-full"
                  placeholder="90 12 34 56"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-2">Nom (optionnel)</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-light" placeholder="Votre nom" />
            </div>

            {error && (
              <div className="p-3 rounded-xl text-xs bg-flame-50 border border-flame-100 text-flame-600">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-brand">
              {loading ? "Redirection..." : "Payer maintenant"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
