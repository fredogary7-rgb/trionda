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
          <Step num={3} text="Vous recevez une commission sur ses investissements" />
        </div>
      </div>
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