"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import BrandPanel from "@/components/BrandPanel";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const result = await signIn("credentials", { identifier, password, redirect: false });
      if (result?.error) setError("Identifiant ou mot de passe incorrect.");
      else router.push("/dashboard");
    } catch { setError("Une erreur est survenue."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 sm:p-12 bg-surface">
      <div className="w-full max-w-md animate-slide-up">
        {/* Mobile logo */}
        <div className="lg:hidden mb-8 text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-gray-900">TRION<span className="text-brand-600">DA</span></span>
          </div>
        </div>

        <div className="card p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Connexion</h1>
            <p className="text-sm text-gray-500">Accédez à votre espace investisseur</p>
          </div>

          {registered && (
            <div className="mb-5 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-emerald-700 text-sm">Compte créé avec succès ! Connectez-vous.</span>
            </div>
          )}
          {error && (
            <div className="mb-5 p-4 bg-flame-50 border border-flame-100 rounded-xl flex items-center gap-3 animate-fade-in">
              <svg className="w-5 h-5 text-flame-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-flame-600 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Téléphone ou Email</label>
              <input id="identifier" type="text" value={identifier} onChange={e => setIdentifier(e.target.value)}
                className="input-light" placeholder="70 12 34 56 ou email" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Mot de passe</label>
              <input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="input-light" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-brand mt-2">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                  Connexion...
                </span>
              ) : "Se connecter"}
            </button>
          </form>

          <div className="relative my-7">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center"><span className="px-4 text-xs text-gray-400 bg-white">OU</span></div>
          </div>

          <p className="text-center text-sm text-gray-500">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex bg-surface">
      <BrandPanel />
      <Suspense fallback={<div className="flex-1 bg-surface" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}