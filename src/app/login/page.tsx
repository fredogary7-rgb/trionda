"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import BrandPanel from "@/components/BrandPanel";
import { MobileLogo, ErrorAlert, SuccessAlert, Spinner } from "@/components/ui/Misc";
import { InputField } from "@/components/ui/InputField";

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
    <div className="flex-1 flex items-center justify-center p-4 sm:p-12 bg-[#060B1A]">
      {/* Mobile background glow */}
      <div className="lg:hidden absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-[80px]" />
      <div className="lg:hidden absolute bottom-0 left-0 w-64 h-64 bg-flame-500/5 rounded-full blur-[80px]" />

      <div className="w-full max-w-md animate-slide-up relative z-10">
        <div className="lg:hidden mb-8 text-center"><MobileLogo /></div>

        <div className="glass-card-glow p-6 sm:p-10">
          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-2">Connexion</h1>
            <p className="text-gray-400 text-sm">Accédez à votre espace investisseur</p>
          </div>

          {registered && <SuccessAlert message="Compte créé avec succès ! Connectez-vous." />}
          {error && <ErrorAlert message={error} />}

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField id="identifier" label="Téléphone ou Email" type="text" value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder="+226 XX XX XX XX ou email" icon="phone" />
            <InputField id="password" label="Mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" icon="lock" />
            <button type="submit" disabled={loading} className="btn-brand mt-2">
              {loading ? <Spinner text="Connexion..." /> : "Se connecter"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/[0.06]" /></div>
            <div className="relative flex justify-center"><span className="px-4 text-xs text-gray-600 bg-[#060B1A]">OU</span></div>
          </div>

          <p className="text-center text-sm text-gray-400">
            Pas encore de compte ?{" "}
            <Link href="/register" className="text-accent-400 hover:text-accent-300 font-semibold transition-colors">
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
    <div className="min-h-screen flex">
      <BrandPanel />
      <Suspense fallback={<div className="flex-1 bg-[#060B1A]" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}