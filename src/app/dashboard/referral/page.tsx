"use client";

import { useEffect, useState } from "react";

export default function ReferralPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard")
      .then(r => r.json())
      .then(d => {
        setData({
          referralCode: d.user?.referralCode || "",
          referralCount: d.referralCount || 0,
        });
      })
      .catch(() => {
        setData({
          referralCode: "",
          referralCount: 0,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const copyText = async (text: string) => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center py-20">
        <div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  const code = data?.referralCode || "";
  const count = data?.referralCount || 0;

  const baseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : "https://trionda.com";
  const refLink = code
    ? `${baseUrl}/register?ref=${code}`
    : `${baseUrl}/register`;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-sm text-gray-400">
          Invitez vos proches et gagnez des commissions
        </p>

        <h2 className="text-xl font-black text-gray-900">
          👥 Parrainage
        </h2>
      </div>

      {/* NIVEAUX DE COMMISSION */}
      <div className="card p-5 mb-4">

        <p className="text-sm font-semibold text-gray-700 mb-2">
          Commissions de parrainage
        </p>

        <p className="text-xs text-gray-400 mb-4">
          Vous gagnez une commission lorsque vos filleuls réalisent un
          investissement.
        </p>

        <div className="space-y-3">

          {/* NIVEAU A */}
          <LevelCard
            level="A"
            pct={15}
            icon="⭐"
            color="text-gold-400"
            bg="bg-gold-500/10"
            border="border-gold-500/20"
            desc="Filleul de niveau A"
          />

          {/* NIVEAU B */}
          <LevelCard
            level="B"
            pct={2}
            icon="💎"
            color="text-brand-500"
            bg="bg-brand-500/10"
            border="border-brand-500/20"
            desc="Filleul de niveau B"
          />

          {/* NIVEAU C */}
          <LevelCard
            level="C"
            pct={1}
            icon="🔹"
            color="text-emerald-400"
            bg="bg-emerald-500/10"
            border="border-emerald-500/20"
            desc="Filleul de niveau C"
          />

        </div>

        {/* EXPLICATION */}
        <div className="mt-4 p-4 bg-gray-50 rounded-xl text-[11px] text-gray-500">

          <p className="font-semibold text-gray-900 mb-2">
            Comment sont calculées les commissions ?
          </p>

          <div className="space-y-1.5">

            <p>
              <span className="text-gold-400 font-bold">
                Niveau A :
              </span>{" "}
              vous recevez <strong className="text-gray-900">10 %</strong>{" "}
              de l'investissement de votre filleul A.
            </p>

            <p>
              <span className="text-brand-500 font-bold">
                Niveau B :
              </span>{" "}
              vous recevez <strong className="text-gray-900">2 %</strong>{" "}
              de l'investissement de votre filleul B.
            </p>

            <p>
              <span className="text-emerald-400 font-bold">
                Niveau C :
              </span>{" "}
              vous recevez <strong className="text-gray-900">1 %</strong>{" "}
              de l'investissement de votre filleul C.
            </p>

          </div>
        </div>

        {/* EXEMPLE */}
        <div className="mt-3 p-4 bg-brand-500/5 border border-brand-500/10 rounded-xl">

          <p className="text-xs font-semibold text-gray-900 mb-2">
            💰 Exemple
          </p>

          <p className="text-[11px] text-gray-500 mb-3">
            Si un filleul investit <strong className="text-brand-500">
              100 000 FCFA
            </strong> :
          </p>

          <div className="space-y-1">

            <p className="text-[11px] text-gold-400">
              → Niveau A : 10 % ={" "}
              <strong>10 000 FCFA</strong>
            </p>

            <p className="text-[11px] text-brand-500">
              → Niveau B : 2 % ={" "}
              <strong>2 000 FCFA</strong>
            </p>

            <p className="text-[11px] text-emerald-400">
              → Niveau C : 1 % ={" "}
              <strong>1 000 FCFA</strong>
            </p>

          </div>
        </div>

      </div>

      {/* STATISTIQUES */}
      <div className="card p-6 mb-4 text-center">

        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">

          <span className="text-2xl font-black text-gold-400">
            {count}
          </span>

        </div>

        <p className="text-sm text-gray-900 font-semibold">
          {count} filleul{count > 1 ? "s" : ""}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          Partagez votre lien pour développer votre équipe.
        </p>

      </div>

      {/* CODE DE PARRAINAGE */}
      <div className="card p-5 mb-4">

        <p className="text-sm font-semibold text-gray-700 mb-3">
          Votre code de parrainage
        </p>

        <div className="flex items-center gap-2 mb-4">

          <div className="flex-1 bg-gray-50 rounded-lg px-4 py-3 text-base font-mono text-brand-500 font-bold tracking-widest text-center">
            {code || "—"}
          </div>

          <button
            onClick={() => copyText(code)}
            disabled={!code}
            className={`px-4 py-3 rounded-lg text-xs font-semibold transition-all ${
              copied
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-brand-500/10 text-brand-500 hover:bg-brand-500/20"
            }`}
          >
            {copied ? "✓" : "📋"}
          </button>

        </div>

        {/* LIEN */}
        <p className="text-xs text-gray-400 mb-3">
          Votre lien d'invitation
        </p>

        <div className="flex items-center gap-2">

          <div className="flex-1 bg-gray-50 rounded-lg px-3 py-2.5 text-[11px] text-gray-400 truncate">
            {refLink}
          </div>

          <button
            onClick={() => copyText(refLink)}
            className="px-3 py-2.5 rounded-lg text-xs bg-brand-500/10 text-brand-500 hover:bg-brand-500/20"
          >
            Copier
          </button>

        </div>

      </div>

      {/* COMMENT ÇA MARCHE */}
      <div className="card p-5">

        <p className="text-sm font-semibold text-gray-700 mb-4">
          Comment ça marche ?
        </p>

        <div className="space-y-4">

          <Step
            num={1}
            text="Partagez votre code ou votre lien d'invitation."
          />

          <Step
            num={2}
            text="Votre filleul s'inscrit avec votre code de parrainage."
          />

          <Step
            num={3}
            text="Lorsque votre filleul investit, vous recevez votre commission selon son niveau."
          />

          <Step
            num={4}
            text="Niveau A : 10 % • Niveau B : 2 % • Niveau C : 1 %."
          />

        </div>

      </div>

    </div>
  );
}


/* =========================
   CARTE NIVEAU
========================= */

function LevelCard({
  level,
  pct,
  icon,
  color,
  bg,
  border,
  desc,
}: {
  level: string;
  pct: number;
  icon: string;
  color: string;
  bg: string;
  border: string;
  desc: string;
}) {
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl ${bg} ${border}`}
    >

      <span className="text-lg">
        {icon}
      </span>

      <div className="flex-1">

        <p className={`text-sm font-bold ${color}`}>
          Niveau {level} — {pct}%
        </p>

        <p className="text-[11px] text-gray-400">
          {desc}
        </p>

      </div>

      <span className={`text-lg font-black ${color}`}>
        {pct}%
      </span>

    </div>
  );
}


/* =========================
   ÉTAPE
========================= */

function Step({
  num,
  text,
}: {
  num: number;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3">

      <div className="w-6 h-6 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">

        <span className="text-[11px] font-bold text-brand-500">
          {num}
        </span>

      </div>

      <p className="text-sm text-gray-700">
        {text}
      </p>

    </div>
  );
}