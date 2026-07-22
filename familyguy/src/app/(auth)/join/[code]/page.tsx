"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

type GroupInfo = { id: string; name: string; type: string; description?: string; memberCount: number; inviteCode: string };

const typeConfig = {
  FAMILY: { emoji: "🏠", label: "Family", color: "bg-rose-50 border-rose-100", badge: "bg-rose-100 text-rose-600" },
  GROUP: { emoji: "👥", label: "Group", color: "bg-indigo-50 border-indigo-100", badge: "bg-indigo-100 text-indigo-600" },
  ORGANIZATION: { emoji: "🏢", label: "Organization", color: "bg-amber-50 border-amber-100", badge: "bg-amber-100 text-amber-600" },
};

export default function JoinByLinkPage() {
  const router = useRouter();
  const params = useParams();
  const code = (params.code as string)?.toUpperCase();

  const [phase, setPhase] = useState<"looking" | "confirm" | "joining" | "error">("looking");
  const [group, setGroup] = useState<GroupInfo | null>(null);
  const [error, setError] = useState("");

  // First — just look up the group, don't join yet
  useEffect(() => {
    fetch(`/api/groups/lookup?code=${code}`, { credentials: "include" })
      .then(async (res) => {
        if (res.status === 401) {
          // Not logged in — redirect to login then come back
          router.push(`/login?redirect=/join/${code}`);
          return;
        }
        const data = await res.json();
        if (!res.ok) { setError(data.error || "Invalid invite link"); setPhase("error"); return; }
        setGroup(data.data.group);
        setPhase("confirm");
      })
      .catch(() => { setError("Something went wrong"); setPhase("error"); });
  }, [code]);

  const handleJoin = async () => {
    setPhase("joining");
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Could not join"); setPhase("error"); return; }
      localStorage.setItem("active_group_id", data.data.group.id);
      localStorage.setItem("active_group_type", data.data.group.type);
      router.push("/dashboard");
    } catch { setError("Something went wrong"); setPhase("error"); }
  };

  const tc = group ? (typeConfig[group.type as keyof typeof typeConfig] || typeConfig.GROUP) : null;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        {/* Looking up */}
        {phase === "looking" && (
          <>
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500 font-medium">Looking up invite link...</p>
          </>
        )}

        {/* Confirmation */}
        {phase === "confirm" && group && tc && (
          <>
            <div className={`w-20 h-20 rounded-2xl ${tc.color} border-2 flex items-center justify-center text-4xl mx-auto mb-5`}>
              {tc.emoji}
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-xl ${tc.badge} inline-block mb-3`}>{tc.label}</span>
            <h2 className="text-xl font-black text-gray-800 mb-1">{group.name}</h2>
            {group.description && <p className="text-sm text-gray-500 mb-2">{group.description}</p>}
            <p className="text-xs text-gray-400 mb-8">{group.memberCount} member{group.memberCount !== 1 ? "s" : ""}</p>

            <div className="space-y-3">
              <button
                onClick={handleJoin}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm"
              >
                Yes, join {group.name} →
              </button>
              <button
                onClick={() => router.push("/onboarding")}
                className="w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-500 font-semibold rounded-xl transition text-sm"
              >
                No thanks
              </button>
            </div>
          </>
        )}

        {/* Joining */}
        {phase === "joining" && (
          <>
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500 font-medium">Joining {group?.name}...</p>
          </>
        )}

        {/* Error */}
        {phase === "error" && (
          <>
            <span className="text-4xl block mb-4">😕</span>
            <p className="text-base font-bold text-gray-700 mb-2">Oops!</p>
            <p className="text-sm text-rose-500 mb-6">{error}</p>
            <a href="/onboarding/join" className="text-indigo-600 text-sm font-semibold hover:underline">Try a different code</a>
          </>
        )}

      </div>
    </div>
  );
}
