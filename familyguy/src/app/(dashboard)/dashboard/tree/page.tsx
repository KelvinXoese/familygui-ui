"use client";
import { useState, useEffect } from "react";

type TreeProfile = { id: string; parentName?: string; parentUserId?: string; parentStatus?: string; isConfirmed: boolean };
type TreeChild = { id: string; childName?: string; isConfirmed: boolean };

export default function TreePage() {
  const [profile, setProfile] = useState<TreeProfile | null>(null);
  const [children, setChildren] = useState<TreeChild[]>([]);
  const [familyName, setFamilyName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }
    fetch(`/api/families/active?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setFamilyName(d.data.family.name); });
    fetch(`/api/families/tree?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) { setProfile(d.data.profile); setChildren(d.data.children || []); } })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Family Tree 🌳</h2>
          <p className="text-gray-500 text-sm mt-1">A living tree that grows as members connect their relationships</p>
        </div>
        <a href="/dashboard/tree/complete" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          {profile ? "Update Profile" : "Set Up My Tree Profile"}
        </a>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-8">
        <h3 className="font-bold text-gray-800 mb-3">How the Family Tree works</h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {[
            { step:"1", title:"Each member adds their parent", desc:"You say who your parent in the family is — a member or a new Tree Person (non-account entity)." },
            { step:"2", title:"Tree builds automatically", desc:"Shared parents make members siblings. Cousins inferred. Deceased relatives preserved." },
            { step:"3", title:"Relationships get verified", desc:"When a parent joins, they confirm the link. Unverified links show as pending." },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">{s.step}</div>
              <div><p className="text-sm font-bold text-gray-800">{s.title}</p><p className="text-xs text-gray-500 mt-0.5">{s.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : !profile ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-5xl block mb-4">🌱</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Your spot in the tree is ready</h3>
          <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
            Complete your tree profile to connect yourself to the {familyName || "family"} tree.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="/dashboard/tree/complete" className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">🌳 Set Up My Tree Profile</a>
            <a href="/dashboard/tree/build-profile" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 text-sm font-bold rounded-xl hover:border-indigo-300 transition">👤 Build Full Profile</a>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">My Tree Profile</h3>
            <div className="space-y-3">
              <div className={`rounded-xl p-4 ${profile.parentName || profile.parentUserId ? "bg-green-50 border border-green-100" : "bg-gray-50 border border-gray-100"}`}>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">👤 Parent in this family</p>
                <p className="text-sm font-bold text-gray-800">{profile.parentName || "Linked via account"}</p>
                {profile.parentStatus === "DECEASED" && <span className="text-xs text-gray-400">🕊️ Deceased</span>}
                <div className="mt-1">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${profile.isConfirmed ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-600"}`}>
                    {profile.isConfirmed ? "✓ Verified" : "⏳ Pending verification"}
                  </span>
                </div>
              </div>
              {children.length > 0 && (
                <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">👶 Children</p>
                  <div className="space-y-1">
                    {children.map((c) => (
                      <div key={c.id} className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-700">{c.childName}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-lg font-semibold ${c.isConfirmed?"bg-green-100 text-green-700":"bg-amber-50 text-amber-600"}`}>{c.isConfirmed?"Verified":"Pending"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <a href="/dashboard/tree/complete" className="inline-block mt-4 text-sm text-indigo-600 font-semibold hover:underline">Edit tree profile →</a>
          </div>
        </div>
      )}
    </div>
  );
}
