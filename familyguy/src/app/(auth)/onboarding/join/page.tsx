"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/groups/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ inviteCode: code.trim().toUpperCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid code"); return; }
      localStorage.setItem("active_group_id", data.data.group.id);
      localStorage.setItem("active_group_type", data.data.group.type);
      router.push("/dashboard");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <a href="/onboarding" className="text-gray-400 hover:text-gray-600 transition">←</a>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Join with a code</h1>
            <p className="text-sm text-gray-500 mt-0.5">Enter the invite code shared with you</p>
          </div>
        </div>

        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}

        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Invite code</label>
            <input
              value={code}
              onChange={(e) => { setCode(e.target.value.toUpperCase()); setError(""); }}
              placeholder="e.g. AME-I34F0"
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-mono font-bold text-center text-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition tracking-widest"
            />
            <p className="text-xs text-gray-400 mt-1.5 text-center">Ask your family head, group leader, or admin for the code</p>
          </div>
          <button type="submit" disabled={loading || code.length < 4}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
            {loading ? "Joining..." : "Join →"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Want to create instead?{" "}
          <a href="/onboarding/create" className="text-indigo-600 font-semibold hover:underline">Create new</a>
        </p>
      </div>
    </div>
  );
}
