export function MobileLogo() {
  return (
    <div className="inline-flex items-center gap-3">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-xl bg-primary-500" />
        <div className="absolute inset-[1px] rounded-[10px] bg-[#0A1030] flex items-center justify-center">
          <svg className="w-5 h-5 text-accent-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
      </div>
      <span className="text-2xl font-black tracking-tighter text-white">
        TRION<span className="text-accent-400">DA</span>
      </span>
    </div>
  );
}

export function SuccessAlert({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-emerald-300 text-sm">{message}</span>
    </div>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mb-6 p-4 bg-flame-500/10 border border-flame-500/20 rounded-xl flex items-center gap-3 animate-fade-in">
      <svg className="w-5 h-5 text-flame-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-flame-300 text-sm">{message}</span>
    </div>
  );
}

export function Spinner({ text }: { text: string }) {
  return (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
      {text}
    </span>
  );
}