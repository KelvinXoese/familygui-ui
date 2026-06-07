"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function JoinFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [inviteCode, setInviteCode] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/families/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.setItem("pending_invite_code", inviteCode);
          router.push("/register");
          return;
        }
        setError(data.error || "Something went wrong");
        return;
      }

      localStorage.setItem("active_family_id", data.data.family.id);
      router.push("/complete-profile");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <a href="/onboarding" className="text-gray-400 hover:text-gray-600 transition text-sm">
            ← Back
          </a>
        </div>

        {/* Logo */}
        <div className="mb-2">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Join a family 🤝</h2>
          <p className="text-gray-500 text-sm mt-1">
            Enter an invite code, use a link, or scan a QR code
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {/* OPTION 1: Invite code */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Option 1 — Enter invite code
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="e.g. AME-24831"
              value={inviteCode}
              onChange={(e) => {
                setInviteCode(e.target.value.toUpperCase());
                setError("");
              }}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition tracking-widest font-mono uppercase"
            />
            <button
              type="submit"
              disabled={loading || !inviteCode}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition text-sm"
            >
              {loading ? "Joining..." : "Join with code"}
            </button>
          </form>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* OPTION 2: Invite link */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Option 2 — Use an invite link
          </p>
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-sm text-gray-600 mb-2">
              If someone shared a link with you, it looks like this:
            </p>
            <div className="bg-white border border-indigo-200 rounded-lg px-3 py-2 font-mono text-xs text-indigo-600 break-all">
              https://familyguy.app/join/AME-24831
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Just click the link and you will be taken straight in — no need to type a code.
            </p>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* OPTION 3: QR Code */}
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
            Option 3 — Scan QR code
          </p>
          <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition">
            <span className="text-xl">📷</span>
            Scan QR Code
          </button>
          <p className="text-xs text-gray-400 text-center mt-2">
            Ask a family member to show you their QR code
          </p>
        </div>

      </div>
    </div>
  );
}