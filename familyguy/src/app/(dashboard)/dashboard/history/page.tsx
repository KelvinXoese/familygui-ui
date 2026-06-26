"use client";
import { useState } from "react";

export default function HistoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", date: "", type: "STORY" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Family History 📖</h2>
          <p className="text-gray-500 text-sm mt-1">Preserve your family's stories, origins and achievements</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Add Story</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Add to Family History</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
              <div className="flex gap-2 flex-wrap">
                {[{v:"STORY",l:"Story 📖"},{v:"ORIGIN",l:"Origin 🌍"},{v:"DATE",l:"Important Date 📅"},{v:"ACHIEVEMENT",l:"Achievement 🏆"}].map((t) => (
                  <button key={t.v} onClick={() => setForm({...form, type: t.v})} className={`px-4 py-2 rounded-xl text-sm font-bold transition ${form.type===t.v?"bg-indigo-600 text-white":"bg-gray-100 text-gray-600 hover:bg-indigo-50"}`}>{t.l}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
              <input value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} placeholder="e.g. How our family came to Accra" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Date / Year <span className="text-gray-400 font-normal">(optional)</span></label>
              <input value={form.date} onChange={(e)=>setForm({...form,date:e.target.value})} placeholder="e.g. 1965 or 12 March 1982" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Story / Details</label>
              <textarea value={form.body} onChange={(e)=>setForm({...form,body:e.target.value})} placeholder="Write the full story here..." rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">Save Story</button>
              <button onClick={()=>setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        {[{label:"Origin Stories",emoji:"🌍",color:"bg-indigo-50 border-indigo-100"},{label:"Historical Events",emoji:"📅",color:"bg-amber-50 border-amber-100"},{label:"Achievements",emoji:"🏆",color:"bg-green-50 border-green-100"},{label:"Family Stories",emoji:"📖",color:"bg-purple-50 border-purple-100"}].map((c)=>(
          <div key={c.label} className={`rounded-2xl p-5 border ${c.color}`}>
            <span className="text-2xl block mb-2">{c.emoji}</span>
            <p className="text-sm font-bold text-gray-700">{c.label}</p>
            <p className="text-xl font-black text-gray-400 mt-1">0</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <span className="text-4xl block mb-4">📖</span>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No history recorded yet</h3>
        <p className="text-sm text-gray-400 mb-4">Start preserving your family's origin, important dates, and notable achievements before they are forgotten</p>
        <button onClick={()=>setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Add First Story</button>
      </div>
    </div>
  );
}
