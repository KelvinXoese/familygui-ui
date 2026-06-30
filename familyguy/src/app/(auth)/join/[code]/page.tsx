"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function JoinByCodePage() {
  const router = useRouter();
  const params = useParams();
  const code = params.code as string;
  const [status, setStatus] = useState<"loading" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/groups/join", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inviteCode: code }),
    }).then(async (res) => {
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) { router.push(`/login?redirect=/join/${code}`); return; }
        setError(data.error || "Invalid invite code");
        setStatus("error");
        return;
      }
      localStorage.setItem("active_group_id", data.data.group.id);
      localStorage.setItem("active_group_type", data.data.group.type);
      router.push("/dashboard");
    }).catch(() => { setError("Something went wrong"); setStatus("error"); });
  }, [code]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        {status === "loading" ? (
          <>
            <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-500">Joining with code <span className="font-mono font-bold">{code}</span>...</p>
          </>
        ) : (
          <>
            <span className="text-4xl block mb-4">😕</span>
            <p className="text-sm text-rose-500 font-semibold mb-4">{error}</p>
            <a href="/onboarding/join" className="text-indigo-600 text-sm font-semibold hover:underline">Try a different code</a>
          </>
        )}
      </div>
    </div>
  );
}
