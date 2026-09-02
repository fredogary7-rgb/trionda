"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import BrandPanel from "@/components/BrandPanel";
import { MobileLogo, ErrorAlert, Spinner } from "@/components/ui/Misc";
import { InputField } from "@/components/ui/InputField";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", promoCode: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [field]: e.target.value });

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
              <InputField id="email" label="Email (optionnel)" type="email" value={form.email} onChange={update("email")} placeholder="vous@exemple.com" icon="email" required={false} />
              <div className="relative">
                <InputField id="promoCode" label="Code promo / Parrainage" type="text" value={form.promoCode} onChange={update("promoCode")} placeholder="Ex: TRD-JO-ABCD" icon="tag" required={false} />
                <span className="absolute right-3 -top-1 text-[10px] text-gold-400 font-medium bg-[#060B1A] px-1.5 rounded">
                  🎁 Bonus
                </span>
              </div>
              <InputField id="password" label="Mot de passe" type="password" value={form.password} onChange={update("password")} placeholder="6 caractères minimum" icon="lock" />
              <InputField id="confirmPassword" label="Confirmer" type="password" value={form.confirmPassword} onChange={update("confirmPassword")} placeholder="••••••••" icon="lock" />

              <button type="submit" disabled={loading} className="btn-primary mt-2">
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