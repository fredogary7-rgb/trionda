"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandPanel from "@/components/BrandPanel";

export default function RegisterPage() {
  const router = useRouter();
  const [f, setF] = useState({ fn:"", ln:"", ph:"", em:"", co:"Burkina Faso", pw:"", cp:"", pc:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const up = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!f.ph || f.ph.replace(/[\s.-]/g,"").length < 8) { setError("Telephone invalide."); return; }
    if (f.pw !== f.cp) { setError("Mots de passe differents."); return; }
    if (f.pw.length < 6) { setError("6 caracteres min."); return; }
    setLoading(true);
    try {
      const r = await fetch("/api/auth/register", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: f.fn, lastName: f.ln, phone: f.ph, email: f.em || null, country: f.co, password: f.pw, promoCode: f.pc || null }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error || "Erreur"); return; }
      router.push("/login?registered=true");
    } catch { setError("Erreur reseau."); }
    finally { setLoading(false); }
  };
return (
    <div className="min-h-screen flex bg-surface">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 bg-surface">
        <div className="w-full max-w-md animate-slide-up">
          <div className="lg:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" /></svg>
              </div>
              <span className="text-2xl font-black text-gray-900">TRION<span className="text-brand-600">DA</span></span>
            </div>
          </div>

          <div className="card p-6 sm:p-10">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Inscription</h1>
            <p className="text-sm text-gray-500 mb-5">Creez votre compte investisseur</p>

            {error && (
              <div className="mb-4 p-4 bg-flame-50 border border-flame-100 rounded-xl flex items-center gap-3">
                <svg className="w-5 h-5 text-flame-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-flame-600 text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={submit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Prenom</label><input type="text" value={f.fn} onChange={up("fn")} className="input-light" placeholder="Jean" required /></div>
                <div><label className="block text-xs font-medium text-gray-600 mb-1">Nom</label><input type="text" value={f.ln} onChange={up("ln")} className="input-light" placeholder="Ouedraogo" required /></div>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Telephone *</label><input type="tel" value={f.ph} onChange={up("ph")} className="input-light" placeholder="+226 XX XX XX XX" required /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Pays</label><div className="input-light flex items-center gap-2 cursor-default"><span className="text-lg">🇧🇫</span><span className="text-gray-900 font-medium">Burkina Faso</span></div></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Email (optionnel)</label><input type="email" value={f.em} onChange={up("em")} className="input-light" placeholder="vous@exemple.com" /></div>
              <div className="relative">
                <label className="block text-xs font-medium text-gray-600 mb-1">Code promo</label>
                <input type="text" value={f.pc} onChange={up("pc")} className="input-light" placeholder="Ex: TRD-JO-ABCD" />
                <span className="absolute right-3 top-0 text-[10px] text-gold-500 font-semibold bg-white px-1.5 rounded">Bonus</span>
              </div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Mot de passe</label><input type="password" value={f.pw} onChange={up("pw")} className="input-light" placeholder="6 caracteres min." required /></div>
              <div><label className="block text-xs font-medium text-gray-600 mb-1">Confirmer</label><input type="password" value={f.cp} onChange={up("cp")} className="input-light" placeholder="........" required /></div>
              <button type="submit" disabled={loading} className="btn-brand mt-2">{loading ? "Creation..." : "Creer mon compte"}</button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
              <div className="relative flex justify-center"><span className="px-4 text-xs text-gray-400 bg-white">OU</span></div>
            </div>

            <p className="text-center text-sm text-gray-500">
              Deja un compte ? <Link href="/login" className="text-brand-600 hover:text-brand-700 font-semibold">Se connecter</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}