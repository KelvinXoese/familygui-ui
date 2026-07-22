"use client";
import { useState, useEffect } from "react";

type Member = {
  id: string; role: string; status: string; joinedAt: string;
  user: { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string; memberProfile?: { currentLocation?: string; occupation?: string } };
};
type Group = { name: string; type: string; inviteCode: string };

const colors = ["bg-indigo-500","bg-purple-500","bg-rose-500","bg-amber-500","bg-green-500","bg-teal-500","bg-pink-500"];

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [myRole, setMyRole] = useState("");
  const [myUserId, setMyUserId] = useState("");
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState<Member | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const groupId = localStorage.getItem("active_group_id");
    if (!groupId) { setLoading(false); return; }

    Promise.all([
      fetch(`/api/groups/active?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/groups/members?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()),
      fetch("/api/auth/me", { credentials: "include" }).then((r) => r.json()),
    ]).then(([groupData, membersData, userData]) => {
      if (groupData.success) setGroup(groupData.data.group);
      if (membersData.success) { setMembers(membersData.data.members); setMyRole(membersData.data.myRole); }
      if (userData.success) setMyUserId(userData.data.user.id);
    }).finally(() => setLoading(false));
  }, []);

  const handleLeave = async () => {
    setActionLoading(true);
    const groupId = localStorage.getItem("active_group_id");
    await fetch("/api/groups/leave", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId }),
    });
    localStorage.removeItem("active_group_id");
    localStorage.removeItem("active_group_type");
    window.location.href = "/onboarding";
  };

  const handleRemove = async (member: Member) => {
    setActionLoading(true);
    const groupId = localStorage.getItem("active_group_id");
    await fetch("/api/groups/members", {
      method: "DELETE", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, userId: member.user.id }),
    });
    setMembers((prev) => prev.filter((m) => m.user.id !== member.user.id));
    setShowRemoveModal(null);
    setActionLoading(false);
  };

  const leaderRoles = ["FAMILY_HEAD", "LEADER", "ADMIN", "SECRETARY"];
  const isLeader = leaderRoles.includes(myRole);
  const filtered = members.filter((m) => `${m.user.firstName} ${m.user.lastName}`.toLowerCase().includes(search.toLowerCase()));
  const typeLabel = group?.type === "FAMILY" ? "family" : group?.type === "ORGANIZATION" ? "organization" : "group";

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-gray-500 text-sm mt-1">{members.length} member{members.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLeaveModal(true)} className="px-4 py-2.5 border border-rose-200 text-rose-500 text-sm font-semibold rounded-xl hover:bg-rose-50 transition">
            Leave
          </button>
          <button onClick={() => setShowInvite(!showInvite)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
            + Invite
          </button>
        </div>
      </div>

      {/* Invite panel */}
      {showInvite && group && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 mb-5">
          <p className="text-sm font-bold text-gray-800 mb-1">Invite members</p>
          <p className="text-xs text-gray-500 mb-4">Share either of these with anyone you want to invite</p>
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 border border-indigo-100">
              <div>
                <p className="text-xs text-gray-400 font-semibold">Invite code</p>
                <p className="font-mono font-black text-xl text-indigo-600 tracking-widest">{group.inviteCode}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(group.inviteCode)} className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition flex-shrink-0">Copy</button>
            </div>
            <div className="bg-white rounded-xl p-3 flex items-center justify-between gap-3 border border-indigo-100">
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-semibold mb-0.5">Invite link</p>
                <p className="font-mono text-xs text-indigo-600 truncate">{typeof window !== "undefined" ? `${window.location.origin}/join/${group.inviteCode}` : ""}</p>
              </div>
              <button onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/join/${group.inviteCode}`)} className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition flex-shrink-0">Copy</button>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-5">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input type="text" placeholder="Search members..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((member, i) => {
            const name = `${member.user.firstName} ${member.user.lastName}`;
            const initials = `${member.user.firstName[0]}${member.user.lastName[0]}`.toUpperCase();
            const isMe = member.user.id === myUserId;
            return (
              <div key={member.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className={`w-11 h-11 rounded-full ${colors[i % colors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>{initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-gray-800 truncate">{name}{isMe && <span className="text-xs text-gray-400 font-normal"> (you)</span>}</p>
                    </div>
                    <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mt-0.5">{member.role.replace(/_/g, " ")}</span>
                    <p className="text-xs text-gray-400 mt-1">{member.user.email}</p>
                    {member.user.memberProfile?.currentLocation && <p className="text-xs text-gray-400">📍 {member.user.memberProfile.currentLocation}</p>}
                  </div>
                </div>
                {isLeader && !isMe && (
                  <button onClick={() => setShowRemoveModal(member)} className="mt-3 w-full py-2 text-xs font-semibold text-rose-500 hover:bg-rose-50 rounded-xl transition border border-rose-100">
                    Remove from {typeLabel}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center px-4 pb-6 md:pb-0">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center mb-5">
              <span className="text-4xl block mb-3">👋</span>
              <h3 className="text-lg font-bold text-gray-800">Leave {group?.name}?</h3>
              <p className="text-sm text-gray-500 mt-2">
                You'll lose access to all the content in this {typeLabel}. You can rejoin later with an invite code.
              </p>
            </div>
            <div className="space-y-3">
              <button onClick={handleLeave} disabled={actionLoading} className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
                {actionLoading ? "Leaving..." : `Yes, leave ${group?.name}`}
              </button>
              <button onClick={() => setShowLeaveModal(false)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl transition text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REMOVE MEMBER MODAL */}
      {showRemoveModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center px-4 pb-6 md:pb-0">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="text-center mb-5">
              <span className="text-4xl block mb-3">🚪</span>
              <h3 className="text-lg font-bold text-gray-800">Remove {showRemoveModal.user.firstName}?</h3>
              <p className="text-sm text-gray-500 mt-2">
                {showRemoveModal.user.firstName} {showRemoveModal.user.lastName} will be removed from {group?.name}. They can rejoin with an invite code.
              </p>
            </div>
            <div className="space-y-3">
              <button onClick={() => handleRemove(showRemoveModal)} disabled={actionLoading} className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
                {actionLoading ? "Removing..." : `Remove ${showRemoveModal.user.firstName}`}
              </button>
              <button onClick={() => setShowRemoveModal(null)} className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold rounded-xl transition text-sm">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
