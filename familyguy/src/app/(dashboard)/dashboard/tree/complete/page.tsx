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
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) return;
    fetch(`/api/families/members?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMembers(d.data.members); });
  }, []);

  const addChild = () => setChildren([...children, { name: "" }]);
  const removeChild = (i: number) => setChildren(children.filter((_, idx) => idx !== i));
  const updateChild = (i: number, value: string) => { const u = [...children]; u[i].name = value; setChildren(u); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(""); setSubmitting(true);
    const familyId = localStorage.getItem("active_family_id");
    try {
      const res = await fetch("/api/families/tree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          familyId,
          parentUserId: parentOnApp ? parentUserId || null : null,
          parentName: !parentOnApp ? parentName || null : null,
          parentStatus: !parentOnApp ? parentStatus : null,
          children: hasChildren ? children.filter((c) => c.name) : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      router.push("/dashboard/tree");
    } catch { setError("Something went wrong"); }
    finally { setSubmitting(false); }
  };

  const roleLabel: Record<string, string> = { FAMILY_HEAD: "Family Head", ELDER: "Elder", TREASURER: "Treasurer", SECRETARY: "Secretary", HISTORIAN: "Historian", EVENT_COORDINATOR: "Event Coord", MEMBER: "Member" };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <a href="/dashboard/tree" className="text-sm text-gray-400 hover:text-gray-600 transition">← Back to Family Tree</a>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Complete Tree Profile 🌳</h2>
        <p className="text-gray-500 text-sm mt-1">
          Tell us which parent connects you to this family. This is how the tree builds itself.
        </p>
      </div>

      {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* PARENT */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">1</div>
            <h3 className="text-base font-bold text-gray-800">Your parent in this family</h3>
          </div>
          <p className="text-sm text-gray-500 mb-5 ml-11">
            Which parent links you to this family? This is the person who brought you into this family tree.
          </p>

          <p className="text-sm font-semibold text-gray-700 mb-3">Is your parent already a member on FamilyGuy?</p>
          <div className="flex gap-3 mb-5">
            <button type="button" onClick={() => setParentOnApp(true)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentOnApp===true?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Yes, they are a member</button>
            <button type="button" onClick={() => setParentOnApp(false)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentOnApp===false?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>No, they are not</button>
          </div>

          {parentOnApp === true && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Select your parent</label>
              {members.length > 0 ? (
                <select value={parentUserId} onChange={(e) => setParentUserId(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition text-gray-600">
                  <option value="">Select a family member...</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.user.firstName} {m.user.lastName} ({roleLabel[m.role] || m.role})</option>)}
                </select>
              ) : (
                <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4">No other members yet. Invite your parent to join first, then come back to link them.</p>
              )}
              <p className="text-xs text-gray-400 mt-2">A confirmation request will be sent to them.</p>
            </div>
          )}

          {parentOnApp === false && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Parent's full name <span className="text-rose-500">*</span></label>
                <input value={parentName} onChange={(e) => setParentName(e.target.value)} placeholder="e.g. Kofi Amenumey" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Are they living or deceased?</label>
                <div className="flex gap-3">
                  <button type="button" onClick={() => setParentStatus("LIVING")} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentStatus==="LIVING"?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Living</button>
                  <button type="button" onClick={() => setParentStatus("DECEASED")} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${parentStatus==="DECEASED"?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Deceased 🕊️</button>
                </div>
              </div>
              <p className="text-xs text-gray-400">Their name appears on the tree. If they join later, their profile auto-links.</p>
            </div>
          )}
        </div>

        {/* CHILDREN */}
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">2</div>
            <h3 className="text-base font-bold text-gray-800">Your children <span className="text-gray-400 font-normal text-sm">(optional)</span></h3>
          </div>
          <p className="text-sm text-gray-500 mb-4 ml-11">Add children so they can appear on the family tree even without accounts.</p>

          <div className="flex gap-3 mb-4">
            <button type="button" onClick={() => setHasChildren(true)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${hasChildren===true?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>Yes</button>
            <button type="button" onClick={() => setHasChildren(false)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-bold transition ${hasChildren===false?"border-indigo-500 bg-indigo-50 text-indigo-600":"border-gray-200 text-gray-500"}`}>No</button>
          </div>

          {hasChildren === true && (
            <div className="space-y-3">
              {children.map((child, i) => (
                <div key={i} className="flex items-center gap-3">
                  <input value={child.name} onChange={(e) => updateChild(i, e.target.value)} placeholder={`Child ${i+1} full name`} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
                  {children.length > 1 && <button type="button" onClick={() => removeChild(i)} className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition font-bold text-xl flex items-center justify-center flex-shrink-0">×</button>}
                </div>
              ))}
              <button type="button" onClick={addChild} className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl text-sm font-bold transition">+ Add another child</button>
            </div>
          )}
          {hasChildren === false && <div className="bg-gray-50 rounded-xl p-4 text-center"><p className="text-sm text-gray-400">No children added. You can update this anytime.</p></div>}
        </div>

        <button type="submit" disabled={submitting} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-black rounded-2xl transition text-base">
          {submitting ? "Saving..." : "Save Tree Profile"}
        </button>
        <p className="text-center text-xs text-gray-400 pb-8">You can update your tree profile anytime from the Family Tree page</p>
      </form>
    </div>
  );
}
