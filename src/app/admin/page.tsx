"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const [data, setData] = useState<any>(null);
  const [tab, setTab] = useState<"users" | "deposits" | "withdrawals" | "credit">("users");
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });

  // Credit/debit form
  const [creditForm, setCreditForm] = useState({ userId: "", amount: "", description: "" });

  useEffect(() => {
    if (status === "unauthenticated") redirect("/login");
    if (status === "authenticated") {
      const isAdmin = (session?.user as { isAdmin?: boolean })?.isAdmin;
      if (!isAdmin) redirect("/dashboard");
      fetchData();
    }
  }, [status]);

  const fetchData = async () => {
    setLoading(true);
    const res = await fetch("/api/admin");
    setData(await res.json());
    setLoading(false);
  };

  const doAction = async (url: string, body: any) => {
    setActing(body.txId || body.userId || "action");
    setMsg({ type: "", text: "" });
    const res = await fetch(url, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await res.json();
    if (j.success) { setMsg({ type: "success", text: "Action réussie !" }); fetchData(); }
    else setMsg({ type: "error", text: j.error || "Erreur" });
    setActing("");
  };

  const handleCredit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creditForm.userId || !creditForm.amount) return;
    setActing("credit"); setMsg({ type: "", text: "" });
    const res = await fetch("/api/admin/actions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(creditForm) });
    const j = await res.json();
    if (j.success) { setMsg({ type: "success", text: "Opération réussie !" }); setCreditForm({ userId: "", amount: "", description: "" }); fetchData(); }
    else setMsg({ type: "error", text: j.error || "Erreur" });
    setActing("");
  };

  if (status === "loading" || loading) {
    return <div className="p-8 flex justify-center"><div className="animate-spin w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full" /></div>;
  }

  const fmt = (n: any) => parseFloat(n || "0").toLocaleString("fr-FR");

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm text-gray-400">Panneau d&apos;administration</p>
          <h1 className="text-2xl font-black text-gray-900">🛡️ Admin</h1>
        </div>
        <div className="text-xs text-gray-400">{data?.totalUsers} utilisateurs</div>
      </div>

      {msg.text && (
        <div className={`mb-4 p-3 rounded-xl text-sm ${msg.type === "success" ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"}`}>{msg.text}</div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {(["users","deposits","withdrawals","credit"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              tab === t ? "bg-brand-500/10 text-brand-500 border border-brand-500/20" : "bg-white text-gray-400 hover:text-gray-900"
            }`}>
            {t === "users" && `👥 Utilisateurs (${data?.users?.length || 0})`}
            {t === "deposits" && `💳 Dépôts (${data?.pendingDeposits?.length || 0})`}
            {t === "withdrawals" && `💸 Retraits (${data?.pendingWithdrawals?.length || 0})`}
            {t === "credit" && "💰 Créditer/Débiter"}
          </button>
        ))}
      </div>
{/* Users tab */}
      {tab === "users" && (
        <div className="card p-5">
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {data?.users?.map((u: any) => (
              <div key={u.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-[11px] text-gray-400">{u.phone}{u.email ? ` · ${u.email}` : ""}</p>
                </div>
                <div className="flex items-center gap-2">
                  {u.isBanned && <span className="text-[10px] px-1.5 py-0.5 rounded bg-flame-500/10 text-flame-400">Banni</span>}
                  {u.isAdmin && <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400">Admin</span>}
                  <button onClick={() => doAction("/api/admin/actions", { userId: u.id, action: u.isBanned ? "unban" : "ban" })}
                    disabled={acting === u.id}
                    className={`text-[10px] px-2 py-1 rounded font-medium ${u.isBanned ? "bg-emerald-500/10 text-emerald-400" : "bg-flame-500/10 text-flame-400"} hover:opacity-80 transition-opacity`}>
                    {acting === u.id ? "..." : u.isBanned ? "Débannir" : "Bannir"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Deposits tab */}
      {tab === "deposits" && (
        <div className="card p-5">
          {data?.pendingDeposits?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucun dépôt en attente.</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {data?.pendingDeposits?.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.user.firstName} {tx.user.lastName}</p>
                    <p className="text-[11px] text-gray-400">{tx.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-emerald-400">+{fmt(tx.amount)} FCFA</span>
                    <button onClick={() => doAction("/api/admin/actions", { txId: tx.id })}
                      disabled={acting === tx.id}
                      className="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors">
                      {acting === tx.id ? "..." : "Approuver"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Withdrawals tab */}
      {tab === "withdrawals" && (
        <div className="card p-5">
          {data?.pendingWithdrawals?.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Aucun retrait en attente.</p>
          ) : (
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {data?.pendingWithdrawals?.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{tx.user.firstName} {tx.user.lastName}</p>
                    <p className="text-[11px] text-gray-400">{tx.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-flame-400">{fmt(Math.abs(tx.amount))} FCFA</span>
                    <button onClick={() => doAction("/api/admin/actions", { txId: tx.id })}
                      disabled={acting === tx.id}
                      className="text-[11px] px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 font-medium transition-colors">
                      {acting === tx.id ? "..." : "Approuver"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Credit tab */}
      {tab === "credit" && (
        <div className="card p-5">
          <form onSubmit={handleCredit} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">ID utilisateur</label>
              <input value={creditForm.userId} onChange={e => setCreditForm({ ...creditForm, userId: e.target.value })}
                className="input-light py-2.5 text-sm" placeholder="UUID de l'utilisateur" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Montant (+ crédit, - débit)</label>
              <input value={creditForm.amount} onChange={e => setCreditForm({ ...creditForm, amount: e.target.value })}
                className="input-light py-2.5 text-sm" placeholder="+10000 ou -5000" type="number" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Description</label>
              <input value={creditForm.description} onChange={e => setCreditForm({ ...creditForm, description: e.target.value })}
                className="input-light py-2.5 text-sm" placeholder="Motif de l'opération" />
            </div>
            <button type="submit" disabled={acting === "credit"} className="btn-brand text-sm">
              {acting === "credit" ? "Traitement..." : "Exécuter"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}