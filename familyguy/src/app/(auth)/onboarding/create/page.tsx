"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const types = [
  {
    value: "FAMILY",
    emoji: "🏠",
    label: "Family",
    desc: "For your extended family or clan organization",
    color: "border-rose-400 bg-rose-50",
    activeColor: "border-rose-500 bg-rose-50 ring-2 ring-rose-300",
    roleLabel: "Family Head",
  },
  {
    value: "GROUP",
    emoji: "👥",
    label: "Group",
    desc: "For choirs, clubs, friendship groups, departments",
    color: "border-indigo-400 bg-indigo-50",
    activeColor: "border-indigo-500 bg-indigo-50 ring-2 ring-indigo-300",
    roleLabel: "Group Leader",
  },
  {
    value: "ORGANIZATION",
    emoji: "🏢",
    label: "Organization",
    desc: "For businesses, companies, NGOs and institutions",
    color: "border-amber-400 bg-amber-50",
    activeColor: "border-amber-500 bg-amber-50 ring-2 ring-amber-300",
    roleLabel: "Admin",
  },
];

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type") || "";

  const [step, setStep] = useState(defaultType ? 2 : 1);
  const [selectedType, setSelectedType] = useState(defaultType);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", motto: "", origin: "" });

  const selectedConfig = types.find((t) => t.value === selectedType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ type: selectedType, ...form }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      localStorage.setItem("active_group_id", data.data.group.id);
      localStorage.setItem("active_group_type", selectedType);
      router.push("/dashboard");
    } catch { setError("Something went wrong. Please try again."); }
    finally { setLoading(false); }
  };

  const namePlaceholder = selectedType === "FAMILY" ? "e.g. Amenumey Family" : selectedType === "GROUP" ? "e.g. The Choir Group" : "e.g. UMB Bank";
  const originLabel = selectedType === "FAMILY" ? "Family origin" : selectedType === "GROUP" ? "Where are you based?" : "Industry / Sector";
  const mottoLabel = selectedType === "FAMILY" ? "Family motto" : selectedType === "ORGANIZATION" ? "Company tagline" : "Group motto";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center gap-3 mb-8">
          <a href="/onboarding" className="text-gray-400 hover:text-gray-600 transition">←</a>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {step === 1 ? "What are you creating?" : `Create your ${selectedConfig?.label}`}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {step === 1 ? "Choose a type to get started" : `You will be the ${selectedConfig?.roleLabel}`}
            </p>
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-3">
            {types.map((t) => (
              <button
                key={t.value}
                onClick={() => { setSelectedType(t.value); setStep(2); }}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left hover:shadow-md transition ${selectedType === t.value ? t.activeColor : "border-gray-200 hover:border-gray-300"}`}
              >
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <p className="font-bold text-gray-800">{t.label}</p>
                  <p className="text-sm text-gray-500">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <>
            {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-3 mb-2">
                {types.map((t) => (
                  <button key={t.value} type="button" onClick={() => setSelectedType(t.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 text-sm font-bold transition ${selectedType === t.value ? t.activeColor : "border-gray-200 text-gray-500"}`}>
                    {t.emoji} {t.label}
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-rose-500">*</span></label>
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={namePlaceholder} required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Description <span className="text-rose-500">*</span></label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} required
                  placeholder={`Tell us about this ${selectedConfig?.label.toLowerCase()}...`}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{mottoLabel} <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={form.motto} onChange={(e) => setForm({ ...form, motto: e.target.value })} placeholder="e.g. United we stand"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">{originLabel} <span className="text-gray-400 font-normal">(optional)</span></label>
                <input value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} placeholder="e.g. Volta Region, Ghana"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
                {loading ? "Creating..." : `Create ${selectedConfig?.label} →`}
              </button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-400 mt-6">
          Have an invite code?{" "}
          <a href="/onboarding/join" className="text-indigo-600 font-semibold hover:underline">Join instead</a>
        </p>
      </div>
    </div>
  );
}

export default function CreatePage() {
  return <Suspense><CreateForm /></Suspense>;
}
