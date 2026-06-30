"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!dateOfBirth) { setError("Date of birth is required"); return; }
    setLoading(true);

    try {
      const res = await fetch("/api/auth/complete-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ dateOfBirth }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      router.push("/onboarding");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-2">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Almost there! 🎉</h2>
          <p className="text-gray-500 text-sm mt-1">Just one quick thing before we take you in</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition flex-shrink-0">
                <span className="text-2xl">📷</span>
              </div>
              <div>
                <button type="button" className="text-sm font-semibold text-indigo-600 hover:underline">
                  Upload photo
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                <p className="text-xs text-gray-400">Helps family members recognise you</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date of birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => { setDateOfBirth(e.target.value); setError(""); }}
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-gray-600"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              🎂 Your family will be notified on your birthday
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm"
          >
            {loading ? "Saving..." : "Go to my family →"}
          </button>

          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-500 font-semibold rounded-xl transition text-sm"
          >
            Skip for now
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          You can update your full profile anytime from settings
        </p>

      </div>
    </div>
  );
}
