"use client";
import { useState, useEffect } from "react";

type Doc = { id: string; title: string; type: string; fileUrl: string; createdAt: string; uploader: { firstName: string; lastName: string } };

const typeStyle: Record<string,string> = { MINUTES:"bg-indigo-50 text-indigo-600", REPORT:"bg-blue-50 text-blue-600", FINANCIAL:"bg-green-50 text-green-600", CONSTITUTION:"bg-purple-50 text-purple-600", PHOTO:"bg-amber-50 text-amber-600", OTHER:"bg-gray-100 text-gray-500" };
const typeIcon: Record<string,string> = { MINUTES:"📄", REPORT:"📊", FINANCIAL:"💰", CONSTITUTION:"📜", PHOTO:"🖼️", OTHER:"📁" };

export default function ArchivePage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");

  useEffect(() => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/archive?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setDocs(d.data.documents); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "ALL" ? docs : docs.filter((d) => d.type === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Archive 🗂️</h2>
          <p className="text-gray-500 text-sm mt-1">Permanent storage for family documents, minutes and records</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Upload Document</button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["ALL","MINUTES","FINANCIAL","CONSTITUTION","REPORT","PHOTO","OTHER"].map((t) => (
          <button key={t} onClick={() => setFilter(t)} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition flex-shrink-0 ${filter===t?"bg-indigo-600 text-white":"bg-white border border-gray-200 text-gray-500 hover:border-indigo-300"}`}>
            {t === "ALL" ? "All" : t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">🗂️</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No documents yet</h3>
          <p className="text-sm text-gray-400 mb-4">Upload meeting minutes, constitutions, financial reports, and family photos here. They will be preserved permanently.</p>
          <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Upload First Document</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((doc) => (
            <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">{typeIcon[doc.type] || "📁"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-800 truncate">{doc.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[doc.type] || "bg-gray-100 text-gray-500"}`}>{doc.type}</span>
                    <span className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString("en-GB")}</span>
                    <span className="text-xs text-gray-400">by {doc.uploader.firstName} {doc.uploader.lastName}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={doc.fileUrl} target="_blank" className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm flex items-center justify-center transition">👁️</a>
                  <a href={doc.fileUrl} download className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm flex items-center justify-center transition">⬇️</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
