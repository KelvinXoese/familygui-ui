"use client";
export default function LeadershipPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Leadership History 👑</h2><p className="text-gray-500 text-sm mt-1">Track past and present family leadership</p></div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Add Record</button>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
        <span className="text-4xl block mb-4">👑</span>
        <h3 className="text-lg font-bold text-gray-700 mb-2">No leadership records yet</h3>
      </div>
    </div>
  );
}
