"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandPanel from "@/components/BrandPanel";
import { MobileLogo, ErrorAlert, Spinner } from "@/components/ui/Misc";
import { InputField } from "@/components/ui/InputField";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", country: "Burkina Faso", password: "", confirmPassword: "", promoCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!form.phone || form.phone.replace(/[\s.-]/g, "").length < 8) {
      setError("Veuillez entrer un numéro de téléphone valide."); return;
    }
    if (form.password !== form.confirmPassword) { setError("Les mots de passe ne correspondent pas."); return; }
    if (form.password.length < 6) { setError("6 caractères minimum pour le mot de passe."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          phone: form.phone,
          email: form.email || null,
          country: form.country,
          password: form.password,
          promoCode: form.promoCode || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors de l'inscription."); return; }
      router.push("/login?registered=true");
    } catch { setError("Une erreur est survenue."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <BrandPanel />
      <div className="flex-1 flex items-center justify-center p-4 sm:p-12 bg-[#060B1A] relative overflow-hidden">
        {/* Mobile glow orbs */}
        <div className="lg:hidden absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-[60px]" />
        <div className="lg:hidden absolute bottom-0 left-0 w-48 h-48 bg-flame-500/5 rounded-full blur-[60px]" />

        <div className="w-full max-w-md animate-slide-up relative z-10">
          <div className="lg:hidden mb-8 text-center"><MobileLogo /></div>

          <div className="glass-card-glow p-6 sm:p-10">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-white mb-2">Inscription</h1>
              <p className="text-gray-400 text-sm">Créez votre compte investisseur</p>
            </div>

            {error && <ErrorAlert message={error} />}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <InputField id="firstName" label="Prénom" type="text" value={form.firstName} onChange={update("firstName")} placeholder="Jean" icon="user" />
                <InputField id="lastName" label="Nom" type="text" value={form.lastName} onChange={update("lastName")} placeholder="Ouédraogo" icon="user" />
              </div>
              <InputField id="phone" label="Téléphone *" type="tel" value={form.phone} onChange={update("phone")} placeholder="+226 XX XX XX XX" icon="phone" />
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">Pays</label>
                <div className="relative">
                  <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select id="country" value={form.country} onChange={update("country")}
                    className="input-light pl-11 appearance-none cursor-pointer">
                    <option value="Burkina Faso">🇧🇫 Burkina Faso</option>
                  </select>
                  <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <InputField id="email" label="Email (optionnel)" type="email" value={form.email} onChange={update("email")} placeholder="vous@exemple.com" icon="email" required={false} />
              <div className="relative">
                <InputField id="promoCode" label="Code promo / Parrainage" type="text" value={form.promoCode} onChange={update("promoCode")} placeholder="Ex: TRD-JO-ABCD" icon="tag" required={false} />
                <span className="absolute right-3 -top-1 text-[10px] text-gold-400 font-medium bg-[#060B1A] px-1.5 rounded">
                  🎁 Bonus
                </span>
              </div>
              <InputField id="password" label="Mot de passe" type="password" value={form.password} onChange={update("password")} placeholder="6 caractères minimum" icon="lock" />
              <InputField id="confirmPassword" label="Confirmer" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="••••••••" icon="lock" />

              <button type="submit" disabled={loading} className="btn-brand mt-2">
                {loading ? <Spinner text="Création..." /> : "Créer mon compte"}
              </button>
            </form>

            <div className="relative my-7">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
              <div className="relative flex justify-center"><span className="px-4 text-xs text-gray-600 bg-[#060B1A]">OU</span></div>
            </div>

            <p className="text-center text-sm text-gray-400">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-accent-400 hover:text-accent-300 font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}