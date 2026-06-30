"use client";
import { useState, useEffect } from "react";

type Doc = { id: string; title: string; fileType: string; fileUrl: string; createdAt: string; uploadedBy: { firstName: string; lastName: string } };
const typeIcon: Record<string,string> = { MINUTES:"📄", FINANCIAL:"💰", GALLERY:"🖼️", VIDEO:"🎬", DOCUMENT:"📁" };

export default function ArchivePage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/archive?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.success) setDocs(d.data.documents); }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Archive 🗂️</h2><p className="text-gray-500 text-sm mt-1">Documents, minutes and records</p></div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Upload</button>
      </div>
      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : docs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"><span className="text-4xl block mb-4">🗂️</span><h3 className="text-lg font-bold text-gray-700 mb-2">No documents yet</h3></div>
      ) : (
        <div className="space-y-3">{docs.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-50 flex items-center justify-center text-xl flex-shrink-0">{typeIcon[doc.fileType] || "📁"}</div>
            <div className="flex-1"><p className="text-sm font-bold text-gray-800">{doc.title}</p><p className="text-xs text-gray-400">{new Date(doc.createdAt).toLocaleDateString("en-GB")} · {doc.uploadedBy.firstName}</p></div>
          </div>
        ))}</div>
      )}
    </div>
  );
}
