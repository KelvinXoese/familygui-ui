"use client";
import { useState, useEffect } from "react";

type Due = {
  id: string; title: string; amount: number; currency: string; deadline: string;
  description?: string; type: string; status: string;
  myStatus: string; totalMembers: number; _count: { payments: number };
};

const typeStyle: Record<string, string> = {
  MONTHLY: "bg-indigo-50 text-indigo-600", ONE_TIME: "bg-purple-50 text-purple-600", WELFARE: "bg-rose-50 text-rose-600",
};
const statusStyle: Record<string, string> = {
  PAID: "bg-green-50 text-green-600", PENDING: "bg-rose-50 text-rose-600", PARTIAL: "bg-amber-50 text-amber-600",
};

export default function DuesPage() {
  const [dues, setDues] = useState<Due[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", amount: "", currency: "GHS", deadline: "", type: "MONTHLY" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchDues = () => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/dues?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setDues(d.data.dues); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDues(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const familyId = localStorage.getItem("active_family_id");
    try {
      const res = await fetch("/api/families/dues", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, familyId }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setShowForm(false); setForm({ title: "", description: "", amount: "", currency: "GHS", deadline: "", type: "MONTHLY" }); fetchDues();
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const summary = {
    paid: dues.reduce((s, d) => s + (d.myStatus === "PAID" ? d.amount : 0), 0),
    pending: dues.reduce((s, d) => s + (d.myStatus === "PENDING" ? d.amount : 0), 0),
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dues & Contributions 💰</h2>
          <p className="text-gray-500 text-sm mt-1">Track and manage family contributions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Create Due
        </button>
      </div>

      {dues.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-3">
          <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
            <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Total Paid</p>
            <p className="text-2xl font-black text-green-600 mt-1">GHS {summary.paid}</p>
          </div>
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
            <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">Pending</p>
            <p className="text-2xl font-black text-rose-600 mt-1">GHS {summary.pending}</p>
          </div>
          <div className="col-span-2 md:col-span-1 bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">Active Dues</p>
            <p className="text-2xl font-black text-indigo-600 mt-1">{dues.filter((d) => d.status === "ACTIVE").length}</p>
          </div>
        </div>
      )}

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Create a Due / Contribution</h3>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Monthly Dues — July 2025" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Purpose of this due..." rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1">Amount</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} placeholder="50" min="0" step="0.01" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({...form, currency: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                  <option value="GHS">GHS</option><option value="USD">USD</option><option value="GBP">GBP</option><option value="NGN">NGN</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                  <option value="MONTHLY">Monthly</option><option value="ONE_TIME">One-time</option><option value="WELFARE">Welfare</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Deadline</label>
                <input type="date" value={form.deadline} onChange={(e) => setForm({...form, deadline: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition">{submitting ? "Creating..." : "Create Due"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : dues.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">💰</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No dues created yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create a due to start tracking family contributions</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Create Due</button>
        </div>
      ) : (
        <div className="space-y-4">
          {dues.map((due) => (
            <div key={due.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800">{due.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[due.type] || "bg-gray-100 text-gray-500"}`}>{due.type}</span>
                  </div>
                  {due.description && <p className="text-sm text-gray-500">{due.description}</p>}
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xl font-black text-gray-800">{due.currency} {due.amount}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Due {new Date(due.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-gray-400">Collection progress</p>
                  <p className="text-xs font-semibold text-gray-600">{due._count.payments}/{due.totalMembers} members paid</p>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${due.totalMembers > 0 ? (due._count.payments / due.totalMembers) * 100 : 0}%` }} />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                <span className={`text-sm font-bold px-3 py-1 rounded-xl ${statusStyle[due.myStatus] || "bg-gray-100 text-gray-500"}`}>
                  My status: {due.myStatus}
                </span>
                <div className="flex items-center gap-2">
                  {due.myStatus !== "PAID" && (
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">Pay Now</button>
                  )}
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">View All Payments</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
