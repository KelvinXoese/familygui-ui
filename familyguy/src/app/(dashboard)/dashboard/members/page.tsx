"use client";
import { useState, useEffect } from "react";

type Member = {
  id: string;
  user: { firstName: string; lastName: string; avatarUrl?: string; dateOfBirth?: string; phone?: string; email: string };
  role: string;
  status: string;
  joinedAt: string;
  memberProfile?: { currentLocation?: string; occupation?: string };
};

const roleLabel: Record<string, string> = {
  FAMILY_HEAD: "Family Head", ELDER: "Elder", TREASURER: "Treasurer",
  SECRETARY: "Secretary", HISTORIAN: "Historian", EVENT_COORDINATOR: "Event Coordinator", MEMBER: "Member",
};

const colors = ["bg-indigo-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-green-500","bg-teal-500","bg-pink-500","bg-orange-500"];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    const familyId = localStorage.getItem("active_family_id");
    if (!familyId) { setLoading(false); return; }

    // Also get invite code
    fetch(`/api/families/active?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setInviteCode(d.data.family.inviteCode); });

    fetch(`/api/families/members?familyId=${familyId}`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setMembers(d.data.members); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = members.filter((m) => {
    const name = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
    const matchSearch = name.includes(search.toLowerCase());
    const matchRole = roleFilter === "all" || m.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-gray-500 text-sm mt-1">{members.length} member{members.length !== 1 ? "s" : ""} in your family</p>
        </div>
        <button
          onClick={() => setShowInvite(!showInvite)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition"
        >
          + Invite Member
        </button>
      </div>

      {/* Invite Panel */}
      {showInvite && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-6 mb-6">
          <h3 className="font-bold text-gray-800 mb-1">Invite members to join</h3>
          <p className="text-sm text-gray-500 mb-4">Share any of these options with family members</p>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Family invite code</p>
              <div className="flex items-center gap-3">
                <span className="font-mono font-black text-xl text-indigo-600 tracking-widest">{inviteCode}</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(inviteCode)}
                  className="text-xs bg-white border border-indigo-200 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition"
                >
                  Copy code
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Invite link</p>
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-indigo-600 break-all">
                  {typeof window !== "undefined" ? window.location.origin : "https://familyguy.app"}/join/{inviteCode}
                </span>
                <button
                  onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/join/${inviteCode}`)}
                  className="text-xs bg-white border border-indigo-200 text-indigo-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition flex-shrink-0"
                >
                  Copy link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 outline-none focus:border-indigo-500 transition"
        >
          <option value="all">All roles</option>
          {Object.entries(roleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">👥</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">
            {search || roleFilter !== "all" ? "No members match your search" : "No members yet"}
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            {search || roleFilter !== "all"
              ? "Try a different search term or filter"
              : "Invite your family members using the button above"
            }
          </p>
          {!search && roleFilter === "all" && (
            <button onClick={() => setShowInvite(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">
              + Invite Members
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {filtered.map((member, index) => {
            const name = `${member.user.firstName} ${member.user.lastName}`;
            const initials = `${member.user.firstName[0]}${member.user.lastName[0]}`.toUpperCase();
            return (
              <div key={member.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-gray-800 truncate">{name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${member.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {member.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mt-1">
                      {roleLabel[member.role] || member.role}
                    </span>
                    <div className="mt-2 space-y-0.5">
                      {member.user.email && <p className="text-xs text-gray-400">✉️ {member.user.email}</p>}
                      {member.memberProfile?.currentLocation && <p className="text-xs text-gray-400">📍 {member.memberProfile.currentLocation}</p>}
                      {member.memberProfile?.occupation && <p className="text-xs text-gray-400">💼 {member.memberProfile.occupation}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                  <button className="flex-1 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
