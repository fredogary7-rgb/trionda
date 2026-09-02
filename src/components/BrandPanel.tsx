import Link from "next/link";

export default function BrandPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#060B1A] via-[#0A1030] to-[#060B1A]">
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary-500/8 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 -left-32 w-72 h-72 bg-accent-500/6 rounded-full blur-[80px]" />
      <div className="absolute -bottom-32 right-1/4 w-80 h-80 bg-gold-500/6 rounded-full blur-[100px]" />

      <div className="relative z-10 flex flex-col justify-between p-14 w-full">
        <div>
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="relative w-11 h-11">
              <div className="absolute inset-0 rounded-xl bg-primary-500" />
              <div className="absolute inset-[1px] rounded-[10px] bg-[#0A1030] flex items-center justify-center">
                <svg className="w-6 h-6 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            </div>
            <span className="text-2xl font-black tracking-tighter">
              TRION<span className="text-accent-400">DA</span>
            </span>
          </Link>
        </div>

        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/15">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-400 animate-pulse" />
            <span className="text-xs font-medium text-accent-400 uppercase tracking-widest">Investissement Pro</span>
          </div>
          <h2 className="text-5xl font-black leading-tight tracking-tighter">
            L&apos;INVESTISSEMENT
            <br />
            <span className="text-gradient">NOUVELLE GÉNÉRATION</span>
          </h2>
          <p className="text-lg text-gray-400 leading-relaxed max-w-md">
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
          <p className="text-sm text-gray-600">&copy; {new Date().getFullYear()} Trionda</p>
          <span className="text-gray-700">·</span>
          <p className="text-sm text-gray-600">Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
}

function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-xl font-black text-gradient">{value}</div>
      <div className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider">{label}</div>
    </div>
  );
}