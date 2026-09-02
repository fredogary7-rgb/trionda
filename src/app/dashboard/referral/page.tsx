"use client";

import { useEffect, useState } from "react";

export default function ReferralPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard").then(r => r.json()).then(d => {
      setData({ referralCode: d.user.referralCode, referralCount: d.referralCount });
    }).finally(() => setLoading(false));
  }, []);

  const copyCode = () => {
    if (data?.referralCode) {
      navigator.clipboard.writeText(data.referralCode);
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return <div className="max-w-7xl mx-auto p-6 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-accent-400 border-t-transparent rounded-full" /></div>;
  }

  const code = data?.referralCode || "";
  const count = data?.referralCount || 0;
  const refLink = `https://trionda.com/register?ref=${code}`;

  return (
    <div className="max-w-lg mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Invitez et gagnez</p>
        <h2 className="text-xl font-black text-white">👥 Parrainage</h2>
      </div>

      {/* Niveaux de parrainage */}
      <div className="glass-card p-5 mb-4">
        <p className="text-sm font-semibold text-gray-300 mb-4">Niveaux de commission</p>
        <p className="text-xs text-gray-500 mb-4">Recevez un pourcentage sur le <strong className="text-white">premier dépôt</strong> de vos filleuls.</p>

        <div className="space-y-3">
          <LevelCard level={1} pct={15} icon="⭐" color="text-gold-400" bg="bg-gold-500/10" border="border-gold-500/20" desc="Parrain direct" />
          <LevelCard level={2} pct={2} icon="💎" color="text-accent-400" bg="bg-accent-400/10" border="border-accent-400/20" desc="Parrain du parrain" />
          <LevelCard level={3} pct={1} icon="🔹" color="text-emerald-400" bg="bg-emerald-500/10" border="border-emerald-500/20" desc="Niveau 3" />
        </div>

        <div className="mt-4 p-3 bg-[#0A0F1E] rounded-xl text-[11px] text-gray-400">
          <p><strong className="text-white">Exemple :</strong> Vous parrainez Jean. Jean fait un dépôt de <strong className="text-accent-400">10 000 FCFA</strong>.</p>
          <div className="mt-2 space-y-0.5">
            <p className="text-gold-400">→ Niveau 1 (Vous) : 15% × 10 000 = <strong>1 500 FCFA</strong></p>
            <p className="text-accent-400">→ Niveau 2 (Votre parrain) : 2% × 10 000 = <strong>200 FCFA</strong></p>
            <p className="text-emerald-400">→ Niveau 3 : 1% × 10 000 = <strong>100 FCFA</strong></p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="glass-card p-6 mb-4 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 flex items-center justify-center">
          <span className="text-2xl font-black text-gold-400">{count}</span>
        </div>
        <p className="text-sm text-white font-semibold">Filleul{count > 1 ? "s" : ""} parrainé{count > 1 ? "s" : ""}</p>
        <p className="text-xs text-gray-500 mt-1">Continuez à partager votre code !</p>
      </div>

      {/* Code */}
      <div className="glass-card p-5 mb-4">
        <p className="text-sm font-semibold text-gray-300 mb-3">Votre code de parrainage</p>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 bg-[#0A0F1E] rounded-lg px-4 py-3 text-base font-mono text-accent-400 font-bold tracking-widest text-center">{code}</div>
          <button onClick={copyCode}
            className={`px-4 py-3 rounded-lg text-xs font-semibold transition-all ${copied ? "bg-emerald-500/10 text-emerald-400" : "bg-accent-400/10 text-accent-400 hover:bg-accent-400/20"}`}>
            {copied ? "✓" : "📋"}
          </button>
        </div>

        <p className="text-xs text-gray-500 mb-3">Lien d&apos;invitation</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-[#0A0F1E] rounded-lg px-3 py-2.5 text-[11px] text-gray-400 truncate">{refLink}</div>
          <button onClick={() => { navigator.clipboard.writeText(refLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="px-3 py-2.5 rounded-lg text-xs bg-accent-400/10 text-accent-400 hover:bg-accent-400/20">Copier</button>
        </div>
      </div>

      {/* How it works */}
      <div className="glass-card p-5">
        <p className="text-sm font-semibold text-gray-300 mb-4">Comment ça marche ?</p>
        <div className="space-y-4">
          <Step num={1} text="Partagez votre code ou lien d'invitation" />
          <Step num={2} text="Votre ami s'inscrit avec votre code" />
          <Step num={3} text="Vous recevez 15% sur son premier dépôt" />
        </div>
      </div>
    </div>
  );
}

function LevelCard({ level, pct, icon, color, bg, border, desc }: { level: number; pct: number; icon: string; color: string; bg: string; border: string; desc: string }) {
  return (
    <div className={`flex items-center gap-3 p-3 rounded-xl ${bg} ${border}`}>
      <span className="text-lg">{icon}</span>
      <div className="flex-1">
        <p className={`text-sm font-bold ${color}`}>Niveau {level} — {pct}%</p>
        <p className="text-[11px] text-gray-500">{desc}</p>
      </div>
      <span className={`text-lg font-black ${color}`}>{pct}%</span>
    </div>
  );
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-6 h-6 rounded-full bg-accent-400/10 flex items-center justify-center shrink-0">
        <span className="text-[11px] font-bold text-accent-400">{num}</span>
      </div>
      <p className="text-sm text-gray-300">{text}</p>
    </div>
  );
}