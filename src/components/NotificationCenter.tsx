"use client";

import { useEffect, useState, useRef } from "react";

interface Notif {
  id: string; title: string; desc: string; time: string;
  type: "credit" | "debit"; read: boolean;
}

export default function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch("/api/dashboard")
        .then(r => r.json())
        .then(d => {
          const tx = (d.transactions || []).slice(0, 10);
          const items: Notif[] = tx.map((t: any, i: number) => {
            const amt = Math.abs(parseFloat(t.amount || "0"));
            return {
              id: t.id,
              title: t.description || t.type,
              desc: amt.toLocaleString("fr-FR") + " FCFA",
              time: new Date(t.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }),
              type: ["deposit","gain","referral","credit"].includes(t.type) ? "credit" : "debit",
              read: i > 2,
            };
          });
          setNotifs(items);
        })
        .finally(() => setLoading(false));
    }
  }, [open]);

  const unread = notifs.filter(n => !n.read).length;
return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center relative hover:bg-gray-200 transition-colors">
        <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-flame-500 text-white text-[10px] font-bold flex items-center justify-center shadow-sm">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <Dropdown notifs={notifs} loading={loading} onMarkAll={() => setNotifs(prev => prev.map(n => ({ ...n, read: true })))} />
      )}
    </div>
  );
}

function Dropdown({ notifs, loading, onMarkAll }: { notifs: Notif[]; loading: boolean; onMarkAll: () => void }) {
  return (
    <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in z-50">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <h3 className="text-sm font-bold text-gray-900">Notifications</h3>
        <span className="text-[11px] text-brand-500 font-medium">{notifs.length} récentes</span>
      </div>

      <div className="max-h-[360px] overflow-y-auto">
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin w-5 h-5 border-2 border-brand-400 border-t-transparent rounded-full" />
          </div>
        ) : notifs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-sm text-gray-400">Aucune notification</p>
          </div>
        ) : (
          notifs.map(n => (
            <div key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer ${!n.read ? "bg-brand-50/50" : ""}`}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${n.type === "credit" ? "bg-emerald-100 text-emerald-600" : "bg-flame-100 text-flame-500"}`}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {n.type === "credit" ? <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /> : <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900 truncate">{n.title}</p>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />}
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{n.desc}</p>
                <p className="text-[10px] text-gray-400 mt-1">{n.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {notifs.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <button onClick={onMarkAll}
            className="w-full text-center text-xs text-brand-500 font-semibold hover:text-brand-600 transition-colors">
            Tout marquer comme lu
          </button>
        </div>
      )}
    </div>
  );
}