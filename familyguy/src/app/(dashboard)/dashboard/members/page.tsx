"use client";
import { useState, useEffect } from "react";

type Member = {
  id: string; role: string; status: string; joinedAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string; memberProfile?: { currentLocation?: string; occupation?: string } };
};

const colors = ["bg-indigo-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-green-500","bg-teal-500","bg-pink-500"];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState("");

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) { setLoading(false); return; }
    fetch(`/api/groups/active?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json()).then((d) => { if (d.success) setInviteCode(d.data.group.inviteCode); });
    fetch(`/api/groups/members?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) { setMembers(d.data.members); setMyRole(d.data.myRole); } })
      .finally(() => setLoading(false));
  }, []);

  const handleRemove = async (userId: string) => {
    const groupId = localStorage.getItem("active_group_id");
    if (!confirm("Remove this member?")) return;
    await fetch("/api/groups/members", {
      method: "DELETE", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, userId }),
    });
    setMembers((prev) => prev.filter((m) => m.user.id !== userId));
  };

  const handleLeave = async () => {
    const groupId = localStorage.getItem("active_group_id");
    if (!confirm("Are you sure you want to leave this group?")) return;
    await fetch("/api/groups/leave", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId }),
    });
    localStorage.removeItem("active_group_id");
    window.location.href = "/onboarding";
  };

  const leaderRoles = ["FAMILY_HEAD", "LEADER", "ADMIN", "SECRETARY"];
  const isLeader = leaderRoles.includes(myRole);

  const filtered = members.filter((m) => {
    const name = `${m.user.firstName} ${m.user.lastName}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-gray-500 text-sm mt-1">{members.length} member{members.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleLeave} className="px-4 py-2.5 border border-rose-200 text-rose-500 text-sm font-semibold rounded-xl hover:bg-rose-50 transition">Leave</button>
          <button onClick={() => setShowInvite(!showInvite)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Invite</button>
        </div>
      </div>

      {showInvite && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6">
          <p className="text-sm font-bold text-gray-800 mb-3">Share invite code</p>
          <div className="flex items-center gap-3">
            <span className="font-mono font-black text-2xl text-indigo-600 tracking-widest">{inviteCode}</span>
            <button onClick={() => navigator.clipboard?.writeText(inviteCode)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">Copy</button>
            <button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/join/${inviteCode}`)} className="px-4 py-2 border border-indigo-300 text-indigo-600 text-xs font-bold rounded-xl hover:bg-white transition">Copy Link</button>
          </div>
        </div>
      )}

      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">👥</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">{search ? "No results" : "No members yet"}</h3>
          <p className="text-sm text-gray-400">{search ? "Try a different search" : "Invite members using the code above"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((member, i) => {
            const name = `${member.user.firstName} ${member.user.lastName}`;
            const initials = `${member.user.firstName[0]}${member.user.lastName[0]}`.toUpperCase();
            return (
              <div key={member.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-gray-800 truncate">{name}</p>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${member.status === "ACTIVE" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                        {member.status}
                      </span>
                    </div>
                    <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mt-1">{member.role.replace(/_/g, " ")}</span>
                    <div className="mt-1.5 space-y-0.5">
                      <p className="text-xs text-gray-400">✉️ {member.user.email}</p>
                      {member.user.memberProfile?.currentLocation && <p className="text-xs text-gray-400">📍 {member.user.memberProfile.currentLocation}</p>}
                      {member.user.memberProfile?.occupation && <p className="text-xs text-gray-400">💼 {member.user.memberProfile.occupation}</p>}
                    </div>
                  </div>
                </div>
                {isLeader && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                    <button onClick={() => handleRemove(member.user.id)} className="px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-lg transition">Remove</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
