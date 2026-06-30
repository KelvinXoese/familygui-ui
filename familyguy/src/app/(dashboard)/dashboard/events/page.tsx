"use client";
import { useState, useEffect } from "react";

type Event = { id: string; title: string; description?: string; date: string; time: string; location: string; type: string; status: string; _count: { attendances: number }; createdBy: { firstName: string; lastName: string } };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", type: "GATHERING" });
  const [submitting, setSubmitting] = useState(false);
  const groupId = typeof window !== "undefined" ? localStorage.getItem("active_group_id") : null;

  const fetch_ = () => {
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/events?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setEvents(d.data.events); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    await fetch("/api/groups/events", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, groupId }) });
    setShowForm(false); setForm({ title: "", description: "", date: "", time: "", location: "", type: "GATHERING" }); fetch_(); setSubmitting(false);
  };

  const upcoming = events.filter((e) => e.status === "UPCOMING");
  const past = events.filter((e) => e.status !== "UPCOMING");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Events 🎉</h2><p className="text-gray-500 text-sm mt-1">Reunions, parties, conferences and more</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Create</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Event name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description (optional)" rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Location" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="GATHERING">Gathering</option><option value="REUNION">Reunion</option><option value="BIRTHDAY">Birthday</option>
                <option value="FUNERAL">Funeral</option><option value="WEDDING">Wedding</option><option value="NAMING_CEREMONY">Naming Ceremony</option>
                <option value="CONFERENCE">Conference</option><option value="PARTY">Party</option><option value="OTHER">Other</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition">{submitting ? "Creating..." : "Create"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">🎉</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No events yet</h3>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition mt-2">+ Create Event</button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && <><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming</p>
          <div className="space-y-4 mb-8">{upcoming.map((ev) => (
            <div key={ev.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-bold text-gray-800">{ev.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{new Date(ev.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · {ev.time}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">{ev.type.replace(/_/g, " ")}</span>
              </div>
              <p className="text-sm text-gray-500 mb-3">📍 {ev.location}</p>
              {ev.description && <p className="text-sm text-gray-600 mb-3">{ev.description}</p>}
              <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">I'm Attending</button>
            </div>
          ))}</div></>}
          {past.length > 0 && <><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past</p>
          <div className="space-y-3 opacity-75">{past.map((ev) => (
            <div key={ev.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center justify-between">
              <div><h3 className="font-bold text-gray-700 text-sm">{ev.title}</h3><p className="text-xs text-gray-400">{new Date(ev.date).toLocaleDateString("en-GB")}</p></div>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition">Gallery</button>
            </div>
          ))}</div></>}
        </>
      )}
    </div>
  );
}
