"use client";
import { useState, useEffect } from "react";

type Announcement = {
  id: string; title: string; body: string; isPinned: boolean;
  createdAt: string; author: { firstName: string; lastName: string };
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchAnnouncements = () => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/announcements?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setAnnouncements(d.data.announcements); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAnnouncements(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    const familyId = localStorage.getItem("active_family_id");
    try {
      const res = await fetch("/api/families/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, familyId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to post"); return; }
      setForm({ title: "", body: "" });
      setShowForm(false);
      fetchAnnouncements();
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const pinned = announcements.filter((a) => a.isPinned);
  const rest = announcements.filter((a) => !a.isPinned);

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const AnnouncementCard = ({ a, highlight }: { a: Announcement; highlight?: boolean }) => (
    <div className={`rounded-2xl p-6 ${highlight ? "bg-indigo-50 border border-indigo-100" : "bg-white border border-gray-100 shadow-sm"}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
          {a.author.firstName[0]}{a.author.lastName[0]}
        </div>
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
      <div className={`flex items-center gap-4 mt-4 pt-4 border-t ${highlight ? "border-indigo-100" : "border-gray-50"}`}>
        <button className="text-xs font-semibold text-indigo-600 hover:underline">👍 Like</button>
        <button className="text-xs font-semibold text-gray-500 hover:underline">💬 Comment</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Announcements 📢</h2>
          <p className="text-gray-500 text-sm mt-1">Stay updated with family news</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition"
        >
          + New Announcement
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">New Announcement</h3>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Announcement title"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Message</label>
              <textarea
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="Write your announcement..."
                rows={4}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition">
                {submitting ? "Posting..." : "Post Announcement"}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">📢</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No announcements yet</h3>
          <p className="text-sm text-gray-400 mb-4">Be the first to share news with your family</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">
            + Create Announcement
          </button>
        </div>
      ) : (
        <>
          {pinned.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">📌 Pinned</p>
              <div className="space-y-4 mb-6">
                {pinned.map((a) => <AnnouncementCard key={a.id} a={a} highlight />)}
              </div>
            </>
          )}
          {rest.length > 0 && (
            <>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">All Announcements</p>
              <div className="space-y-4">
                {rest.map((a) => <AnnouncementCard key={a.id} a={a} />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
