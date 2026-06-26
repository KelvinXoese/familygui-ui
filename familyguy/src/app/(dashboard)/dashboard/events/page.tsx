"use client";
import { useState, useEffect } from "react";

type Event = {
  id: string; title: string; description?: string; date: string; time: string;
  location: string; type: string; status: string;
  _count: { attendances: number }; createdBy: { firstName: string; lastName: string };
};

const typeStyle: Record<string, string> = {
  REUNION: "bg-indigo-50 text-indigo-600", BIRTHDAY: "bg-rose-50 text-rose-600",
  FUNERAL: "bg-gray-100 text-gray-500", GATHERING: "bg-green-50 text-green-600",
  WEDDING: "bg-pink-50 text-pink-600", NAMING_CEREMONY: "bg-amber-50 text-amber-600", OTHER: "bg-purple-50 text-purple-600",
};
const typeBarColor: Record<string, string> = {
  REUNION: "bg-indigo-500", BIRTHDAY: "bg-rose-500", FUNERAL: "bg-gray-400",
  GATHERING: "bg-green-500", WEDDING: "bg-pink-500", NAMING_CEREMONY: "bg-amber-500", OTHER: "bg-purple-500",
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", date: "", time: "", location: "", type: "GATHERING" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchEvents = () => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/events?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setEvents(d.data.events); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const familyId = localStorage.getItem("active_family_id");
    try {
      const res = await fetch("/api/families/events", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, familyId }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setShowForm(false); setForm({ title: "", description: "", date: "", time: "", location: "", type: "GATHERING" }); fetchEvents();
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const upcoming = events.filter((e) => e.status === "UPCOMING");
  const past = events.filter((e) => e.status === "PAST");

  const EventCard = ({ ev, isPast }: { ev: Event; isPast?: boolean }) => (
    <div className={`bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm ${isPast ? "opacity-70" : ""}`}>
      <div className={`h-1.5 w-full ${typeBarColor[ev.type] || "bg-indigo-500"}`} />
      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-gray-800">{ev.title}</h3>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[ev.type] || "bg-gray-100 text-gray-500"}`}>{ev.type.replace(/_/g, " ")}</span>
            </div>
            <p className="text-sm text-gray-500">{new Date(ev.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {ev.time}</p>
          </div>
          {isPast && <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 text-gray-400 flex-shrink-0">Past</span>}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3"><span>📍</span><span>{ev.location}</span></div>
        {ev.description && <p className="text-sm text-gray-600 leading-relaxed mb-4">{ev.description}</p>}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Organised by {ev.createdBy.firstName} {ev.createdBy.lastName}</p>
          <div className="flex items-center gap-2">
            {!isPast && <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">I am Attending</button>}
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">View Gallery</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Events 🎉</h2>
          <p className="text-gray-500 text-sm mt-1">Weddings, funerals, reunions, gatherings and celebrations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Create Event</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Create an Event</h3>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Event name</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Amenumey Family Reunion 2025" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Details about the event..." rows={2} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Time</label>
                <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
                <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="e.g. Uncle Kofi's house, Accra" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Event type</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                  <option value="GATHERING">Gathering</option><option value="REUNION">Reunion</option>
                  <option value="BIRTHDAY">Birthday</option><option value="FUNERAL">Funeral</option>
                  <option value="WEDDING">Wedding</option><option value="NAMING_CEREMONY">Naming Ceremony</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition">{submitting ? "Creating..." : "Create Event"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">🎉</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No events yet</h3>
          <p className="text-sm text-gray-400 mb-4">Create your first family event — reunions, birthdays, naming ceremonies and more</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Create Event</button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (<><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming Events</p><div className="space-y-4 mb-8">{upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}</div></>)}
          {past.length > 0 && (<><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past Events</p><div className="space-y-4">{past.map((ev) => <EventCard key={ev.id} ev={ev} isPast />)}</div></>)}
        </>
      )}
    </div>
  );
}
