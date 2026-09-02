"use client";

import { useEffect, useState } from "react";

const SEG = [
  { l: "0 FCFA", c: "#CBD5E1", a: 0 },
  { l: "100 FCFA", c: "#93C5FD", a: 100 },
  { l: "200 FCFA", c: "#60A5FA", a: 200 },
  { l: "500 FCFA", c: "#3B82F6", a: 500 },
  { l: "1k", c: "#F59E0B", a: 1000 },
  { l: "2k", c: "#F97316", a: 2000 },
  { l: "5k", c: "#EF4444", a: 5000 },
  { l: "10k", c: "#8B5CF6", a: 10000 },
];

export default function WheelPage() {
  const [canPlay, setCanPlay] = useState(true);
  const [loading, setLoading] = useState(true);
  const [spinning, setSpinning] = useState(false);
  const [rot, setRot] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [resultAmount, setResultAmount] = useState(0);
  const [msg, setMsg] = useState({ t: "", m: "" });

  useEffect(() => {
    fetch("/api/wheel").then(r => r.json()).then(d => setCanPlay(d.canPlay)).finally(() => setLoading(false));
  }, []);

  const spin = async () => {
    if (spinning || !canPlay) return;
    setSpinning(true); setResult(null); setMsg({ t: "", m: "" });
    try {
      const res = await fetch("/api/wheel", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setMsg({ t: "error", m: data.error }); setSpinning(false); return; }
      const seg = 360 / SEG.length;
      const target = 360 - (data.prizeIndex * seg + seg / 2);
      const turns = 5 + Math.floor(Math.random() * 5);
      setRot(turns * 360 + target);
      setTimeout(() => {
        setResult(data.prize.label);
        setResultAmount(data.prize.amount);
        setCanPlay(false); setSpinning(false);
      }, 5000);
    } catch { setMsg({ t: "error", m: "Erreur reseau." }); setSpinning(false); }
  };
if (loading) {
    return <div className="max-w-md mx-auto p-4 flex justify-center py-20"><div className="animate-spin w-6 h-6 border-2 border-brand-400 border-t-transparent rounded-full" /></div>;
  }

  const conic = SEG.map((s, i) => `${s.c} ${i * 45}deg ${(i + 1) * 45}deg`).join(", ");

  return (
    <div className="max-w-md mx-auto p-4 sm:p-6 lg:p-8 text-center">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Tentez votre chance</p>
        <h1 className="text-2xl font-extrabold text-gray-900">Lucky Wheel</h1>
        <p className="text-xs text-gray-400 mt-1">1 tour gratuit par jour</p>
      </div>

      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto mb-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20">
          <div className="w-0 h-0 border-l-[14px] border-r-[14px] border-t-[24px] border-l-transparent border-r-transparent border-t-brand-600 drop-shadow-lg" />
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white shadow-lg z-10 flex items-center justify-center border-2 border-gray-200">
          <span className="text-sm font-black text-brand-600">GO</span>
        </div>
        <div className="w-full h-full rounded-full border-4 border-white shadow-xl"
          style={{
            background: `conic-gradient(${conic})`,
            transform: `rotate(${rot}deg)`,
            transition: spinning ? "transform 5s cubic-bezier(0.17,0.67,0.12,0.99)" : "none",
          }}
        />
        {SEG.map((s, i) => {
          const a = (i * 45 + 22.5) * (Math.PI / 180);
          const x = 50 + 36 * Math.cos(a - Math.PI / 2);
          const y = 50 + 36 * Math.sin(a - Math.PI / 2);
          const d = ["#F59E0B","#F97316","#EF4444","#8B5CF6"].includes(s.c);
          return <span key={i} className="absolute text-[9px] font-bold pointer-events-none"
            style={{ left: x + "%", top: y + "%", transform: "translate(-50%,-50%)", color: d ? "#fff" : "#1e293b" }}>
            {s.l}
          </span>;
        })}
      </div>
{msg.m && (
        <div className={`mb-4 p-3 rounded-xl text-sm font-medium ${msg.t === "error" ? "bg-flame-50 text-flame-600" : "bg-emerald-50 text-emerald-600"}`}>{msg.m}</div>
      )}

      {result && (
        <div className={`mb-4 p-4 rounded-2xl ${resultAmount > 0 ? "bg-emerald-50 border border-emerald-100" : "bg-gray-50 border border-gray-100"}`}>
          <p className="text-sm text-gray-500">Resultat</p>
          <p className={`text-2xl font-black ${resultAmount > 0 ? "text-emerald-600" : "text-gray-500"}`}>{result}</p>
          {resultAmount > 0 && <p className="text-xs text-emerald-500 mt-1">Ajoute a votre solde !</p>}
        </div>
      )}

      <button onClick={spin} disabled={!canPlay || spinning}
        className={`w-full py-4 rounded-2xl text-white font-bold text-base transition-all ${
          canPlay && !spinning ? "bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-500 hover:to-brand-600 shadow-lg shadow-brand-500/25 active:scale-[0.97]" : "bg-gray-300 cursor-not-allowed"
        }`}>
        {spinning ? "La roue tourne..." : canPlay ? "Tourner la roue" : "Revenez demain"}
      </button>

      <p className="text-[11px] text-gray-400 mt-4">Les gains sont credites directement sur votre solde.</p>
    </div>
  );
}