import Link from "next/link";

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800">
      {/* Cercles décoratifs subtils */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white/5" />
      <div className="absolute top-1/3 -left-32 w-72 h-72 rounded-full bg-white/3" />
      <div className="absolute -bottom-40 right-1/4 w-80 h-80 rounded-full bg-white/5" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-white/10" />

      <div className="relative z-10 flex flex-col justify-between p-14 w-full">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center shadow-lg">
              <svg className="w-6 h-6 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">TRION<span className="text-white/80">DA</span></span>
          </Link>
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-white/90 uppercase tracking-widest">Investissement Pro</span>
          </div>
          <h2 className="text-5xl font-black leading-tight tracking-tighter text-white">
            L&apos;INVESTISSEMENT
            <br />
            <span className="text-white/70">NOUVELLE GÉNÉRATION</span>
          </h2>
          <p className="text-lg text-white/60 leading-relaxed max-w-md">
            La plateforme qui révolutionne l&apos;investissement au Burkina Faso.
            Performance, transparence, innovation.
          </p>
          <div className="flex gap-5 pt-4">
            <StatBadge value="+12%" label="Rendement" />
            <StatBadge value="24/7" label="Disponible" />
            <StatBadge value="100%" label="Sécurisé" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-sm text-white/40">&copy; {new Date().getFullYear()} Trionda</p>
          <span className="text-white/30">·</span>
          <p className="text-sm text-white/40">Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-black text-white">{value}</div>
      <div className="text-[11px] text-white/50 mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}