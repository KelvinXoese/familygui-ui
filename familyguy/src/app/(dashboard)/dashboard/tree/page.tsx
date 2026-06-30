"use client";
import { useState, useEffect } from "react";

type TreeProfile = { id: string; parentName?: string; parentUserId?: string; parentStatus?: string; isConfirmed: boolean };
type TreeChild = { id: string; childName?: string; isConfirmed: boolean };

export default function TreePage() {
  const [profile, setProfile] = useState<TreeProfile | null>(null);
  const [children, setChildren] = useState<TreeChild[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/active?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.success) setGroupName(d.data.group.name); });
    fetch(`/api/groups/tree?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()).then((d) => { if (d.success) { setProfile(d.data.profile); setChildren(d.data.children || []); } }).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">Family Tree 🌳</h2><p className="text-gray-500 text-sm mt-1">A living tree that grows as members connect</p></div>
        <a href="/dashboard/tree/complete" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">{profile ? "Update Profile" : "Set Up My Profile"}</a>
      </div>
      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : !profile ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-5xl block mb-4">🌱</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">Your spot in the tree is ready</h3>
          <p className="text-sm text-gray-400 mb-6">Complete your tree profile to connect to the {groupName || "family"} tree</p>
          <a href="/dashboard/tree/complete" className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">🌳 Set Up My Tree Profile</a>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">My Tree Profile</h3>
          <div className={`rounded-xl p-4 ${profile.parentName || profile.parentUserId ? "bg-green-50 border border-green-100" : "bg-gray-50"}`}>
            <p className="text-xs font-bold text-gray-500 uppercase mb-1">👤 Parent</p>
            <p className="text-sm font-bold text-gray-800">{profile.parentName || "Linked via account"}</p>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg mt-1 inline-block ${profile.isConfirmed ? "bg-green-100 text-green-700" : "bg-amber-50 text-amber-600"}`}>{profile.isConfirmed ? "✓ Verified" : "⏳ Pending"}</span>
          </div>
          {children.length > 0 && (
            <div className="bg-indigo-50 rounded-xl p-4 mt-3">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">👶 Children</p>
              {children.map((c) => <p key={c.id} className="text-sm font-semibold text-gray-700">{c.childName}</p>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
