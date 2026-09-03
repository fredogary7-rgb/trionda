"use client";

export default function TriondaBall({ color = "#0D47C7", size = 48 }: { color?: string; size?: number }) {
  const id = `ball-${color.replace("#", "")}-${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0 drop-shadow-sm">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#e8eef5" />
          <stop offset="100%" stopColor="#9aa8bd" />
        </radialGradient>
      </defs>
      {/* Ball base */}
      <circle cx="50" cy="50" r="48" fill={`url(#${id})`} />
      <circle cx="50" cy="50" r="47" fill="none" stroke="#5b6a80" strokeWidth="1" opacity="0.4" />

      {/* Center pentagon */}
      <polygon points="50,35 64.3,45.4 58.9,63.5 41.1,63.5 35.7,45.4" fill={color} stroke="#1e293b" strokeWidth="1.2" />
      {/* Top pentagon (partial) */}
      <polygon points="50,10 61,17.7 57,33 43,33 39,17.7" fill={color} stroke="#1e293b" strokeWidth="1.2" />
      {/* Bottom pentagon (partial) */}
      <polygon points="50,90 61,82.3 57,67 43,67 39,82.3" fill={color} stroke="#1e293b" strokeWidth="1.2" />

      {/* Connecting seams */}
      <line x1="64.3" y1="45.4" x2="78" y2="34" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="58.9" y1="63.5" x2="72" y2="76" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="35.7" y1="45.4" x2="22" y2="34" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="41.1" y1="63.5" x2="28" y2="76" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="66" y1="24" x2="72" y2="10" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="34" y1="24" x2="28" y2="10" stroke="#1e293b" strokeWidth="1.4" strokeLinecap="round" />

      {/* Highlight */}
      <ellipse cx="36" cy="30" rx="14" ry="10" fill="white" opacity="0.35" transform="rotate(-25 36 30)" />
    </svg>
  );
}