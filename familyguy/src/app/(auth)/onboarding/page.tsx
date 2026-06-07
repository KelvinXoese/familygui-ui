"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Family = {
  id: string;
  name: string;
  description: string | null;
  memberCount: number;
  myRole: string;
  inviteCode: string;
};

export default function OnboardingPage() {
  const router = useRouter();
  const [families, setFamilies] = useState<Family[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/families/my-families")
      .then((r) => r.json())
      .then((data) => {
        if (data.success) setFamilies(data.data.families);
      })
      .finally(() => setLoading(false));
  }, []);

  const enterFamily = (familyId: string) => {
    localStorage.setItem("active_family_id", familyId);
    router.push("/dashboard");
  };

  const roleLabel: Record<string, string> = {
    FAMILY_HEAD: "Family Head",
    ELDER: "Elder",
    TREASURER: "Treasurer",
    SECRETARY: "Secretary",
    MEMBER: "Member",
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-6 text-center">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-gray-400">Loading your families...</p>
          </div>
        ) : families.length > 0 ? (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-800">Your families</h2>
              <p className="text-gray-500 text-sm mt-1">Select a family to enter or join a new one</p>
            </div>

            <div className="space-y-3 mb-6">
              {families.map((family) => (
                <button
                  key={family.id}
                  onClick={() => enterFamily(family.id)}
                  className="w-full border-2 border-gray-100 hover:border-indigo-500 rounded-2xl p-5 text-left transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black text-lg flex-shrink-0">
                      {family.name.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-gray-800 group-hover:text-indigo-600 transition">{family.name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{family.memberCount} members · {roleLabel[family.myRole]}</p>
                    </div>
                    <span className="text-gray-300 group-hover:text-indigo-500 transition text-xl">→</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-gray-400 text-xs">or</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a href="/onboarding/create-family" className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 hover:border-indigo-400 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 transition">
                + Create family
              </a>
              <a href="/onboarding/join-family" className="flex items-center justify-center gap-2 py-3 border-2 border-gray-200 hover:border-indigo-400 rounded-xl text-sm font-bold text-gray-600 hover:text-indigo-600 transition">
                Join family
              </a>
            </div>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800">Welcome to FamilyGuy 👋</h2>
              <p className="text-gray-500 text-sm mt-2">Would you like to create a new family or join an existing one?</p>
            </div>

            <div className="space-y-4">
              <a href="/onboarding/create-family" className="block">
                <div className="border-2 border-gray-100 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl flex-shrink-0">🏠</div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition">Create a Family</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Start a new family group and invite members</p>
                    </div>
                    <div className="ml-auto text-gray-300 group-hover:text-indigo-500 transition text-xl">→</div>
                  </div>
                </div>
              </a>

              <a href="/onboarding/join-family" className="block">
                <div className="border-2 border-gray-100 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer transition group">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">🤝</div>
                    <div>
                      <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition">Join a Family</h3>
                      <p className="text-sm text-gray-500 mt-0.5">Enter an invite code or scan a QR code</p>
                    </div>
                    <div className="ml-auto text-gray-300 group-hover:text-indigo-500 transition text-xl">→</div>
                  </div>
                </div>
              </a>
            </div>

            <p className="text-center text-xs text-gray-400 mt-8">You can always create or join more families later</p>
          </>
        )}
      </div>
    </div>
  );
}