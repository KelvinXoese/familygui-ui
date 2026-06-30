"use client";
import { useState, useEffect } from "react";

type Member = { id: string; role: string; user: { firstName: string; lastName: string; email: string; phone?: string; memberProfile?: { currentLocation?: string; occupation?: string } } };
const colors = ["bg-indigo-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-green-500","bg-teal-500","bg-pink-500"];

export default function DirectoryPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/members?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setMembers(d.data.members); }).finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const name = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
    return name.includes(q) || (m.user.memberProfile?.occupation || "").toLowerCase().includes(q) || (m.user.memberProfile?.currentLocation || "").toLowerCase().includes(q);
  });

  const grouped = filtered.reduce((acc, m, i) => {
    const letter = m.user.firstName[0].toUpperCase();
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push({ ...m, colorIndex: i });
    return acc;
  }, {} as Record<string, (Member & { colorIndex: number })[]>);

  return (
    <div>
      <div className="mb-6"><h2 className="text-2xl font-bold text-gray-800">Directory 🔍</h2><p className="text-gray-500 text-sm mt-1">Find any member instantly</p></div>
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" placeholder="Search by name, occupation or location..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
      </div>
      {loading ? <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm"><span className="text-4xl block mb-4">🔍</span><h3 className="text-lg font-bold text-gray-700">No members yet</h3></div>
      ) : (
        <div className="space-y-6">
          {Object.keys(grouped).sort().map((letter) => (
            <div key={letter}>
              <div className="flex items-center gap-3 mb-3"><span className="text-lg font-black text-indigo-600">{letter}</span><div className="flex-1 h-px bg-gray-100" /></div>
              <div className="space-y-3">
                {grouped[letter].map((m) => {
                  const name = `${m.user.firstName} ${m.user.lastName}`;
                  const initials = `${m.user.firstName[0]}${m.user.lastName[0]}`.toUpperCase();
                  return (
                    <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-full ${colors[m.colorIndex % colors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5"><p className="text-sm font-bold text-gray-800">{name}</p><span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-semibold">{m.role.replace(/_/g, " ")}</span></div>
                        <p className="text-xs text-gray-400">{m.user.email}{m.user.memberProfile?.occupation && ` · ${m.user.memberProfile.occupation}`}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
