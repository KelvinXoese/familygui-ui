"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Member = { id: string; user: { firstName: string; lastName: string }; role: string };

export default function CompleteTreeProfilePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [parentOnApp, setParentOnApp] = useState<boolean | null>(null);
  const [parentUserId, setParentUserId] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentStatus, setParentStatus] = useState<"LIVING" | "DECEASED">("LIVING");
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [children, setChildren] = useState([{ name: "" }]);

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) return;
    fetch(`/api/groups/members?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.success) setMembers(d.data.members); });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const groupId = localStorage.getItem("active_group_id");
    try {
      const res = await fetch("/api/groups/tree", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          groupId,
          parentUserId: parentOnApp ? parentUserId || null : null,
          parentName: !parentOnApp ? parentName || null : null,
          parentStatus: !parentOnApp ? parentStatus : null,
          children: hasChildren ? children.filter((c) => c.name) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed"); return; }
      router.push("/dashboard/tree");
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <a href="/dashboard/tree" className="text-sm text-gray-400 hover:text-gray-600 transition">← Back</a>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Complete Tree Profile 🌳</h2>
        <p className="text-gray-500 text-sm mt-1">Tell us which parent connects you to this family</p>
      </div>
      {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4">Your parent in this family</h3>
          <div className="flex gap-3 mb-4">
            <button type="button" onClick={() => setParentOnApp(true)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentOnApp===true?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Yes, member</button>
            <button type="button" onClick={() => setParentOnApp(false)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentOnApp===false?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>No</button>
          </div>
          {parentOnApp === true && (
            members.length > 0 ? (
              <select value={parentUserId} onChange={(e) => setParentUserId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="">Select...</option>
                {members.map((m) => <option key={m.id} value={m.id}>{m.user.firstName} {m.user.lastName}</option>)}
              </select>
            ) : <p className="text-sm text-gray-400">No other members yet</p>
          )}
          {parentOnApp === false && (
            <div className="space-y-3">
              <input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="Parent's full name" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              <div className="flex gap-3">
                <button type="button" onClick={() => setParentStatus("LIVING")} className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${parentStatus==="LIVING"?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Living</button>
                <button type="button" onClick={() => setParentStatus("DECEASED")} className={`flex-1 py-2 rounded-xl border-2 text-sm font-bold transition ${parentStatus==="DECEASED"?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Deceased</button>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-gray-800 mb-4">Children (optional)</h3>
          <div className="flex gap-3 mb-4">
            <button type="button" onClick={() => setHasChildren(true)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${hasChildren===true?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Yes</button>
            <button type="button" onClick={() => setHasChildren(false)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${hasChildren===false?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>No</button>
          </div>
          {hasChildren === true && children.map((child, i) => (
            <input key={i} value={child.name} onChange={(e) => { const u = [...children]; u[i].name = e.target.value; setChildren(u); }} placeholder={`Child ${i+1} name`} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition mb-2" />
          ))}
          {hasChildren === true && <button type="button" onClick={() => setChildren([...children, { name: "" }])} className="text-sm text-indigo-600 font-semibold">+ Add another child</button>}
        </div>
        <button type="submit" disabled={submitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black rounded-2xl transition">{submitting ? "Saving..." : "Save Tree Profile"}</button>
      </form>
    </div>
  );
}
