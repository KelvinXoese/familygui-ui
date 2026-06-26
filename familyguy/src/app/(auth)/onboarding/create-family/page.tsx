"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFamilyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", description: "", motto: "", origin: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("Submitting...", form);
    try {
      const res = await fetch("/api/families/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);
      if (!res.ok) { setError(data.error || "Something went wrong"); return; }
      localStorage.setItem("active_family_id", data.data.family.id);
      router.push("/dashboard");
    } catch (err) {
      console.error("Catch error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-3xl font-black text-indigo-600 mb-2">FamilyGuy</h1>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Create your family 🏠</h2>
        {error && <div className="bg-rose-50 border border-rose-200 text-rose-600 text-sm px-4 py-3 rounded-xl mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Family name *</label>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="e.g. Amenumey Family" required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description *</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} placeholder="Tell us about your family..." required className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition resize-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Family motto <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={form.motto} onChange={(e) => setForm({...form, motto: e.target.value})} placeholder="e.g. United we stand" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Family origin <span className="text-gray-400 font-normal">(optional)</span></label>
            <input value={form.origin} onChange={(e) => setForm({...form, origin: e.target.value})} placeholder="e.g. Volta Region, Ghana" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-xl transition text-sm">
            {loading ? "Creating family..." : "Create Family"}
          </button>
        </form>
      </div>
    </div>
  );
}