"use client";
import { useState, useEffect } from "react";

type Due = { id: string; title: string; amount: number; currency: string; deadline: string; type: string; status: string; myStatus: string; totalMembers: number; _count: { payments: number } };

export default function DuesPage() {
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", amount: "", currency: "GHS", deadline: "", type: "MONTHLY" });
  const [submitting, setSubmitting] = useState(false);
  const groupId = typeof window !== "undefined" ? localStorage.getItem("active_group_id") : null;

  const fetch_ = () => {
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/dues?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setDues(d.data.dues); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await fetch("/api/groups/dues", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, groupId }) });
    setShowForm(false); setForm({ title: "", description: "", amount: "", currency: "GHS", deadline: "", type: "MONTHLY" }); fetch_(); setSubmitting(false);
  };

  const statusStyle: Record<string, string> = { PAID: "bg-green-50 text-green-600", PENDING: "bg-rose-50 text-rose-600", PARTIAL: "bg-amber-50 text-amber-600" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Dues & Contributions 💰</h2><p className="text-gray-500 text-sm mt-1">Track and manage contributions</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Create</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <div className="grid grid-cols-3 gap-3">
              <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} placeholder="Amount" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <select value={form.currency} onChange={(e) => setForm({...form, currency: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="GHS">GHS</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="NGN">NGN</option>
              </select>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="MONTHLY">Monthly</option><option value="ONE_TIME">One-time</option><option value="WELFARE">Welfare</option>
              </select>
            </div>
            <input type="date" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition">{submitting ? "Creating..." : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : dues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">💰</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No dues created yet</h3>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition mt-2">+ Create Due</button>
        </div>
      ) : (
        <div className="space-y-4">
          {dues.map((due) => (
            <div key={due.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div><h3 className="font-bold text-gray-800">{due.title}</h3><p className="text-xs text-gray-400 mt-0.5">Due {new Date(due.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p></div>
                <p className="text-xl font-black text-gray-800 flex-shrink-0">{due.currency} {due.amount}</p>
              </div>
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-400">Collection progress</p>
                  <p className="text-xs font-semibold text-gray-600">{due._count.payments}/{due.totalMembers} paid</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full transition-all" style={{ width: `${due.totalMembers > 0 ? (due._count.payments / due.totalMembers) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                <span className={`text-sm font-bold px-3 py-1 rounded-xl ${statusStyle[due.myStatus] || "bg-gray-100 text-gray-500"}`}>My status: {due.myStatus}</span>
                {due.myStatus !== "PAID" && <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">Pay Now</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
