"use client";
import { useState } from "react";

export default function HistoryPage() {
  const [showForm, setShowForm] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Family History 📖</h2><p className="text-gray-500 text-sm mt-1">Preserve your family's stories and origins</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Add Story</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <span className="text-4xl block mb-4">📖</span>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No history recorded yet</h3>
        <p className="text-sm text-gray-400">Start preserving your family's origin, important dates, and achievements</p>
      </div>
    </div>
  );
}
