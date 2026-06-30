"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Group = { id: string; type: string; name: string; description?: string; memberCount: number; myRole: string; inviteCode: string; avatarUrl?: string };

const typeConfig = {
  FAMILY: { emoji: "🏠", color: "bg-rose-50 border-rose-200", badge: "bg-rose-100 text-rose-600", label: "Family" },
  GROUP: { emoji: "👥", color: "bg-indigo-50 border-indigo-200", badge: "bg-indigo-100 text-indigo-600", label: "Group" },
  ORGANIZATION: { emoji: "🏢", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-600", label: "Organization" },
};

export default function OnboardingPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/groups/my-groups", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setGroups(d.data.groups); })
      .finally(() => setLoading(false));
  }, []);

  const enterGroup = (group: Group) => {
    localStorage.setItem("active_group_id", group.id);
    localStorage.setItem("active_group_type", group.type);
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-black text-sm">FG</span>
            </div>
            <span className="text-xl font-black text-gray-900">FamilyGuy</span>
          </div>
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
              router.push("/login");
            }}
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* Create / Join buttons */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/onboarding/create" className="flex flex-col items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-5 transition font-bold text-sm shadow-lg shadow-indigo-200">
            <span className="text-2xl">✨</span>
            Create new
          </Link>
          <Link href="/onboarding/join" className="flex flex-col items-center justify-center gap-2 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-indigo-400 text-gray-700 rounded-2xl p-5 transition font-bold text-sm">
            <span className="text-2xl">🔗</span>
            Join with code
          </Link>
        </div>

        {/* My groups */}
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : groups.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <span className="text-5xl block mb-4">🌱</span>
            <h3 className="text-lg font-bold text-gray-700 mb-2">You're not in any groups yet</h3>
            <p className="text-sm text-gray-400 mb-6">Create your family, a group, or an organization to get started</p>
            <div className="grid grid-cols-3 gap-3">
              {(["FAMILY", "GROUP", "ORGANIZATION"] as const).map((type) => {
                const c = typeConfig[type];
                return (
                  <Link key={type} href={`/onboarding/create?type=${type}`} className={`rounded-xl p-3 border text-center hover:shadow-md transition ${c.color}`}>
                    <span className="text-xl block mb-1">{c.emoji}</span>
                    <p className="text-xs font-bold text-gray-700">{c.label}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Your groups ({groups.length})</p>
            <div className="space-y-3">
              {groups.map((group) => {
                const c = typeConfig[group.type as keyof typeof typeConfig] || typeConfig.GROUP;
                return (
                  <button
                    key={group.id}
                    onClick={() => enterGroup(group)}
                    className="w-full bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${c.color} border`}>
                        {group.avatarUrl ? <img src={group.avatarUrl} className="w-full h-full rounded-2xl object-cover" /> : c.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-bold text-gray-800 truncate">{group.name}</p>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-lg flex-shrink-0 ${c.badge}`}>{c.label}</span>
                        </div>
                        <p className="text-xs text-gray-400">{group.memberCount} member{group.memberCount !== 1 ? "s" : ""} · {group.myRole.replace(/_/g, " ")}</p>
                      </div>
                      <span className="text-gray-300 text-lg">›</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
