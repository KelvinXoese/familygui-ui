"use client";
import { useState } from "react";

export default function LeadershipPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", role: "FAMILY_HEAD", startYear: "", endYear: "", notes: "" });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Leadership History 👑</h2>
          <p className="text-gray-500 text-sm mt-1">Track past and present family leadership</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Add Record</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Add Leadership Record</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full name</label>
                <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="e.g. Uncle Kofi Amenumey" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                  <option value="FAMILY_HEAD">Family Head</option>
                  <option value="SECRETARY">Secretary</option>
                  <option value="TREASURER">Treasurer</option>
                  <option value="HISTORIAN">Historian</option>
                  <option value="EVENT_COORDINATOR">Event Coordinator</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year from</label>
                <input value={form.startYear} onChange={(e)=>setForm({...form,startYear:e.target.value})} placeholder="e.g. 2010" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Year to <span className="text-gray-400 font-normal">(blank = present)</span></label>
                <input value={form.endYear} onChange={(e)=>setForm({...form,endYear:e.target.value})} placeholder="e.g. 2020" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
              <textarea value={form.notes} onChange={(e)=>setForm({...form,notes:e.target.value})} placeholder="Any notable achievements or context..." rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">Save Record</button>
              <button onClick={()=>setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <span className="text-4xl block mb-4">👑</span>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No leadership records yet</h3>
        <p className="text-sm text-gray-400 mb-4">Document past and present family leaders so future generations can know their history</p>
        <button onClick={()=>setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Add First Record</button>
      </div>
    </div>
  );
}
