"use client";
import { useState, useEffect } from "react";

type Meeting = {
  id: string; title: string; date: string; startTime: string; endTime: string;
  type: string; location: string; agenda: string[]; status: string;
  _count?: { attendances: number };
};

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", startTime: "", endTime: "", type: "PHYSICAL", location: "", agenda: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchMeetings = () => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/meetings?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMeetings(d.data.meetings); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMeetings(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const familyId = localStorage.getItem("active_family_id");
    try {
      const agendaArr = form.agenda.split("\n").map((s) => s.trim()).filter(Boolean);
      const res = await fetch("/api/families/meetings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, agenda: agendaArr, familyId }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      setShowForm(false);
      setForm({ title: "", date: "", startTime: "", endTime: "", type: "PHYSICAL", location: "", agenda: "" });
      fetchMeetings();
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const upcoming = meetings.filter((m) => m.status === "UPCOMING");
  const past = meetings.filter((m) => m.status === "COMPLETED" || m.status === "CANCELLED");

  const MeetingCard = ({ m, isPast }: { m: Meeting; isPast?: boolean }) => (
    <div className={`bg-white border border-gray-100 rounded-2xl p-6 shadow-sm ${isPast ? "opacity-75" : ""}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">{m.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(m.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })} · {m.startTime} – {m.endTime}
          </p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-xl flex-shrink-0 ${
          m.status === "COMPLETED" ? "bg-gray-100 text-gray-400" :
          m.status === "CANCELLED" ? "bg-rose-50 text-rose-400" :
          m.type === "VIRTUAL" ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"
        }`}>
          {m.status === "UPCOMING" ? m.type === "VIRTUAL" ? "Virtual" : "Physical" : m.status}
        </span>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <span>📍</span><span>{m.location}</span>
      </div>
      {m.agenda && m.agenda.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Agenda</p>
          <ol className="space-y-1">
            {m.agenda.map((item: string, i: number) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-indigo-400 font-bold text-xs mt-0.5">{i + 1}.</span>{item}
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="flex items-center justify-end gap-2">
        {!isPast && <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">Confirm Attendance</button>}
        {isPast && <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">View Minutes</button>}
        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">View Details</button>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Meetings 📅</h2>
          <p className="text-gray-500 text-sm mt-1">Schedule and track family meetings</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Schedule Meeting
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Schedule a Meeting</h3>
          {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="e.g. Monthly Family Meeting" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Start time</label>
                <input type="time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">End time</label>
                <input type="time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                  <option value="PHYSICAL">Physical</option>
                  <option value="VIRTUAL">Virtual</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Location / Link</label>
                <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder={form.type === "VIRTUAL" ? "e.g. Google Meet link" : "e.g. Uncle Kofi's house"} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Agenda items <span className="text-gray-400 font-normal">(one per line)</span></label>
              <textarea value={form.agenda} onChange={(e) => setForm({...form, agenda: e.target.value})} placeholder={"Opening prayer\nReview minutes\nDues update"} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-bold rounded-xl transition">{submitting ? "Scheduling..." : "Schedule Meeting"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">📅</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No meetings scheduled yet</h3>
          <p className="text-sm text-gray-400 mb-4">Schedule your first family meeting</p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Schedule Meeting</button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (<><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming</p><div className="space-y-4 mb-8">{upcoming.map((m) => <MeetingCard key={m.id} m={m} />)}</div></>)}
          {past.length > 0 && (<><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past Meetings</p><div className="space-y-4">{past.map((m) => <MeetingCard key={m.id} m={m} isPast />)}</div></>)}
        </>
      )}
    </div>
  );
}
