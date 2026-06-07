"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function JoinViaLinkPage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [familyName, setFamilyName] = useState("");

  useEffect(() => {
    // Look up the family by invite code first
    fetch(`/api/families/lookup?code=${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setFamilyName(data.data.family.name);
        } else {
          setError("This invite link is invalid or has expired.");
        }
      })
      .finally(() => setLoading(false));
  }, [code]);

  const handleJoin = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/families/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteCode: code }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Not logged in — save code and redirect to register
        if (res.status === 401) {
          localStorage.setItem("pending_invite_code", code);
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
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8 text-center">

        <h1 className="text-3xl font-black text-indigo-600 mb-8">FamilyGuy</h1>

        {loading ? (
          <div>
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400 text-sm">Looking up family...</p>
          </div>
        ) : error ? (
          <div>
            <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">❌</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Invalid invite link</h2>
            <p className="text-gray-500 text-sm mb-6">{error}</p>
            <a href="/onboarding" className="block w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-sm">
              Go to my families
            </a>
          </div>
        ) : (
          <div>
            <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 text-4xl font-black text-white">
              {familyName.slice(0, 1)}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">You've been invited!</h2>
            <p className="text-gray-500 text-sm mb-2">Join the</p>
            <p className="text-2xl font-black text-indigo-600 mb-6">{familyName}</p>
            <p className="text-xs text-gray-400 mb-6">Invite code: <span className="font-mono font-bold tracking-widest">{code}</span></p>

            <button
              onClick={handleJoin}
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm mb-3"
            >
              Accept invitation
            </button>
            <a href="/onboarding" className="block text-sm text-gray-400 hover:text-gray-600">
              Maybe later
            </a>
          </div>
        )}
      </div>
    </div>
  );
}