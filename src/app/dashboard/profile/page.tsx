"use client";

import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setData(d);
      setForm({ firstName: d.user.firstName, lastName: d.user.lastName, email: d.user.email || "" });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setMsg({ type: "", text: "" });
    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const j = await res.json();
      if (!res.ok) { setMsg({ type: "error", text: j.error || "Erreur" }); setSaving(false); return; }
      setData((d: any) => ({ ...d, user: { ...d.user, ...j.user } }));
      setMsg({ type: "success", text: "Profil mis à jour !" });
      setEdit(false);
    } catch { setMsg({ type: "error", text: "Erreur réseau." }); }
    finally { setSaving(false); }
  };

  const copyCode = () => {
    if (data?.user?.referralCode) {
      navigator.clipboard.writeText(data.user.referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  const d = data!;
  const user = d.user;
  const wallet = d.wallet;
  const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  const memberSince = new Date(user.createdAt).toLocaleDateString("fr-FR", { year: "numeric", month: "long" });

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-brand-500/20 flex items-center justify-center">
          <span className="text-2xl font-black text-brand-500">{initials}</span>
        </div>
        <h2 className="text-xl font-black text-gray-900">{user.firstName} {user.lastName}</h2>
        <p className="text-sm text-gray-400 mt-1">Membre depuis {memberSince}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Solde</p>
          <p className="text-sm font-bold text-brand-500">{parseFloat(wallet.balance || "0").toLocaleString("fr-FR")} F</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Investi</p>
          <p className="text-sm font-bold text-gray-900">{parseFloat(wallet.totalInvested || "0").toLocaleString("fr-FR")} F</p>
        </div>
        <div className="card p-3 text-center">
          <p className="text-[10px] text-gray-400 uppercase mb-0.5">Gains</p>
          <p className="text-sm font-bold text-emerald-400">{parseFloat(wallet.totalGains || "0").toLocaleString("fr-FR")} F</p>
        </div>
      </div>
{/* Quick Actions: Dépôt / Retrait */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <a href="/dashboard/deposit" className="card p-4 flex items-center gap-3 group cursor-pointer hover:border-emerald-500/20 transition-all">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <g><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m0 0l-6-6m6 6l6-6" strokeWidth={2} /><rect x="3" y="21" width="18" height="2" rx="1" fill="currentColor" /></g>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-emerald-400">Dépôt</p>
            <p className="text-[11px] text-gray-400">Recharger mon compte</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </a>
        <a href="/dashboard/withdraw" className="card p-4 flex items-center gap-3 group cursor-pointer hover:border-flame-500/20 transition-all">
          <div className="w-10 h-10 rounded-xl bg-flame-500/10 border border-flame-500/20 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <svg className="w-5 h-5 text-flame-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <g><path strokeLinecap="round" strokeLinejoin="round" d="M12 20V4m0 0L6 10m6-6l6 6" strokeWidth={2} /><rect x="3" y="1" width="18" height="2" rx="1" fill="currentColor" /></g>
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-flame-400">Retrait</p>
            <p className="text-[11px] text-gray-400">Retirer mes gains</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 ml-auto group-hover:text-gray-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        </a>
      </div>

      {/* Info Card */}
      <div className="card p-5 mb-4">
        {edit ? (
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Prénom</label>
              <input value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })}
                className="glass-input py-2.5 text-sm" placeholder="Votre prénom" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Nom</label>
              <input value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })}
                className="glass-input py-2.5 text-sm" placeholder="Votre nom" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Email</label>
              <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="glass-input py-2.5 text-sm" placeholder="vous@exemple.com" />
            </div>
            {msg.text && (
              <div className={`p-2 rounded-lg text-xs ${msg.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"}`}>{msg.text}</div>
            )}
            <div className="flex gap-2">
              <button onClick={() => { setEdit(false); setMsg({ type: "", text: "" }); }} className="flex-1 btn-outline py-2.5 text-sm">Annuler</button>
              <button onClick={handleSave} disabled={saving} className="flex-1 btn-primary py-2.5 text-sm">{saving ? "Sauvegarde..." : "Enregistrer"}</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-400">Téléphone</span>
              <span className="text-sm text-gray-900 font-mono">{user.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm text-gray-400">Email</span>
              <span className="text-sm text-gray-900">{user.email || "Non renseigné"}</span>
            </div>
            <button onClick={() => setEdit(true)} className="w-full mt-2 py-2.5 rounded-xl border border-gray-100 text-sm text-brand-500 hover:bg-brand-500/5 transition-colors">
              ✏️ Modifier mes infos
            </button>
          </div>
        )}
      </div>

      {/* Referral */}
      <div className="card p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Code de parrainage</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2.5 text-sm font-mono text-brand-500 font-semibold tracking-wider text-center">
            {user.referralCode}
          </div>
          <button onClick={copyCode}
            className={`px-4 py-2.5 rounded-lg text-xs font-medium transition-all ${
              copied ? "bg-emerald-500/10 text-emerald-400" : "bg-brand-500/10 text-brand-500 hover:bg-brand-500/20"
            }`}>
            {copied ? "✓ Copié" : "Copier"}
          </button>
        </div>
        <p className="text-[11px] text-gray-400 mt-2">Partagez ce code pour parrainer et gagner des commissions.</p>
      </div>

      {/* Danger zone */}
      <div className="card p-5 border-flame-500/10">
        <p className="text-sm font-semibold text-gray-700 mb-3">Session</p>
        <button onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full py-2.5 rounded-xl border border-flame-500/20 text-sm text-flame-400 hover:bg-flame-500/5 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Se déconnecter
        </button>
      </div>
    </div>
  );
}