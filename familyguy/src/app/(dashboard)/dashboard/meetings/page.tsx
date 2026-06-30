"use client";
import { useState, useEffect } from "react";

type Meeting = { id: string; title: string; date: string; startTime: string; endTime: string; type: string; location: string; agenda: string[]; status: string; _count: { attendances: number } };

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", startTime: "", endTime: "", type: "PHYSICAL", location: "", agenda: "" });
  const [submitting, setSubmitting] = useState(false);

  const groupId = typeof window !== "undefined" ? localStorage.getItem("active_group_id") : null;

  const fetch_ = () => {
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/meetings?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setMeetings(d.data.meetings); }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch_(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    const agendaArr = form.agenda.split("\n").map((s) => s.trim()).filter(Boolean);
    await fetch("/api/groups/meetings", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, agenda: agendaArr, groupId }),
    });
    setShowForm(false); setForm({ title: "", date: "", startTime: "", endTime: "", type: "PHYSICAL", location: "", agenda: "" }); fetch_(); setSubmitting(false);
  };

  const upcoming = meetings.filter((m) => m.status === "UPCOMING");
  const past = meetings.filter((m) => m.status !== "UPCOMING");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Meetings 📅</h2><p className="text-gray-500 text-sm mt-1">Schedule and track meetings</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Schedule</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder="Meeting title" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <div className="grid grid-cols-3 gap-3">
              <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <input type="time" value={form.startTime} onChange={(e) => setForm({...form, startTime: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <input type="time" value={form.endTime} onChange={(e) => setForm({...form, endTime: e.target.value})} required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="PHYSICAL">Physical</option><option value="VIRTUAL">Virtual</option>
              </select>
              <input value={form.location} onChange={(e) => setForm({...form, location: e.target.value})} placeholder="Location / Link" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <textarea value={form.agenda} onChange={(e) => setForm({...form, agenda: e.target.value})} placeholder={"Agenda items (one per line)"} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            <div className="flex gap-3">
              <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-60 transition">{submitting ? "Scheduling..." : "Schedule"}</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : meetings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">📅</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No meetings scheduled</h3>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition mt-2">+ Schedule Meeting</button>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming</p>
            <div className="space-y-4 mb-8">
              {upcoming.map((m) => (
                <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{m.title}</h3>
                      <p className="text-sm text-gray-500 mt-0.5">{new Date(m.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })} · {m.startTime}–{m.endTime}</p>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-xl flex-shrink-0 ${m.type === "VIRTUAL" ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"}`}>{m.type}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">📍 {m.location}</p>
                  {Array.isArray(m.agenda) && m.agenda.length > 0 && (
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">Agenda</p>
                      <ol className="space-y-1">{m.agenda.map((item, i) => <li key={i} className="text-sm text-gray-600 flex gap-2"><span className="text-indigo-400 font-bold text-xs">{i+1}.</span>{item}</li>)}</ol>
                    </div>
                  )}
                  <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">Confirm Attendance</button>
                </div>
              ))}
            </div></>
          )}
          {past.length > 0 && (
            <><p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past</p>
            <div className="space-y-3 opacity-75">
              {past.map((m) => (
                <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-gray-700 text-sm">{m.title}</h3>
                      <p className="text-xs text-gray-400">{new Date(m.date).toLocaleDateString("en-GB")}</p>
                    </div>
                    <button className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg hover:bg-gray-200 transition">View Minutes</button>
                  </div>
                </div>
              ))}
            </div></>
          )}
        </>
      )}
    </div>
  );
}
