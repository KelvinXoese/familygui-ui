"use client";
import { useState, useEffect } from "react";

type Announcement = { id: string; title: string; body: string; isPinned: boolean; createdAt: string; author: { firstName: string; lastName: string }; _count: { reactions: number; comments: number } };

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);

  const groupId = typeof window !== "undefined" ? localStorage.getItem("active_group_id") : null;

  const fetch_ = () => {
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/announcements?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setAnnouncements(d.data.announcements); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await fetch("/api/groups/announcements", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, groupId }),
    });
    setForm({ title: "", body: "" }); setShowForm(false); fetch_(); setSubmitting(false);
  };

  const timeAgo = (d: string) => { const diff = Date.now() - new Date(d).getTime(); const m = Math.floor(diff/60000); if(m<60) return `${m}m ago`; const h = Math.floor(m/60); if(h<24) return `${h}h ago`; return `${Math.floor(h/24)}d ago`; };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Announcements 📢</h2><p className="text-gray-500 text-sm mt-1">Stay updated with group news</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ New</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Title" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <textarea value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} placeholder="Write your announcement..." rows={4} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition">{submitting ? "Posting..." : "Post"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">📢</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No announcements yet</h3>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition mt-2">+ Create Announcement</button>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <div key={a.id} className={`rounded-2xl p-6 ${a.isPinned ? "bg-indigo-50 border border-indigo-100" : "bg-white border border-gray-100 shadow-sm"}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{a.author.firstName[0]}{a.author.lastName[0]}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-gray-800">{a.author.firstName} {a.author.lastName}</p>
                    <div className="flex items-center gap-2">
                      {a.isPinned && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg font-semibold">📌 Pinned</span>}
                      <p className="text-xs text-gray-400">{timeAgo(a.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="text-base font-bold text-gray-800 mb-2">{a.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{a.body}</p>
              <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">👍 {a._count.reactions}</span>
                <span className="text-xs text-gray-400">💬 {a._count.comments}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
