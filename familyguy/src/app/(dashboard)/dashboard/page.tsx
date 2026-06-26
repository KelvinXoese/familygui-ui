"use client";
import { useEffect, useState } from "react";

type User = { firstName: string; lastName: string };
type Family = { name: string; memberCount: number };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const familyId = localStorage.getItem("active_family_id");

    Promise.all([
      fetch("/api/auth/me").then((r) => r.json()),
      familyId ? fetch(`/api/families/active?familyId=${familyId}`).then((r) => r.json()) : Promise.resolve(null),
    ]).then(([userData, familyData]) => {
      if (userData?.success) setUser(userData.data.user);
      if (familyData?.success) setFamily(familyData.data.family);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* WELCOME */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName ?? "..."} 👋
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          {family ? `Here's what's happening in the ${family.name}` : "Select or create a family to get started"}
        </p>
      </div>

      {/* PROFILE COMPLETION NUDGE */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-base">Complete your family profile 🌳</p>
            <p className="text-indigo-100 text-sm mt-0.5">Help your family know their roots</p>
          </div>
          <span className="text-3xl font-black">0%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-white rounded-full h-2 w-0" />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Date of Birth", done: false },
            { label: "Profile Photo", done: false },
            { label: "Occupation & Location", done: false },
            { label: "Family Relationships", done: false },
            { label: "Biography", done: false },
            { label: "Message to Family", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span>{item.done ? "✅" : "⬜"}</span>
              <span className={item.done ? "text-white" : "text-indigo-200"}>{item.label}</span>
            </div>
          ))}
        </div>
        <a href="/dashboard/tree/build-profile" className="inline-block bg-white text-indigo-600 font-bold text-sm px-5 py-2 rounded-xl hover:bg-indigo-50 transition">
          Complete profile →
        </a>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        {[
          { label: "Members", value: family?.memberCount?.toString() ?? "—", sub: "in your family", color: "text-indigo-600", bg: "bg-indigo-50", href: "/dashboard/members" },
          { label: "Meetings", value: "—", sub: "upcoming", color: "text-amber-500", bg: "bg-amber-50", href: "/dashboard/meetings" },
          { label: "Dues", value: "—", sub: "active", color: "text-rose-500", bg: "bg-rose-50", href: "/dashboard/dues" },
          { label: "Events", value: "—", sub: "upcoming", color: "text-green-500", bg: "bg-green-50", href: "/dashboard/events" },
        ].map((card) => (
          <a key={card.label} href={card.href} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer block">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </a>
        ))}
      </div>

      {/* INVITE FAMILY MEMBERS CTA */}
      {family && (
        <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Invite family members</h3>
              <p className="text-sm text-gray-500 mt-1">Share the family code so members can join</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="font-mono font-black text-lg text-indigo-600 tracking-widest">{family.name.slice(0,3).toUpperCase()}-XXXXX</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(family.name)}
                  className="text-xs text-indigo-600 font-semibold hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="text-4xl">🤝</div>
          </div>
        </div>
      )}

      {/* QUICK ACCESS GRID */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 mb-8">
        {[
          { label: "Family Tree", emoji: "🌳", href: "/dashboard/tree", desc: "View bloodline" },
          { label: "History", emoji: "📖", href: "/dashboard/history", desc: "Family stories" },
          { label: "Directory", emoji: "🔍", href: "/dashboard/directory", desc: "Find a member" },
          { label: "Archive", emoji: "🗂️", href: "/dashboard/archive", desc: "Documents & files" },
        ].map((item) => (
          <a key={item.label} href={item.href} className="bg-white border border-gray-100 rounded-2xl p-4 hover:border-indigo-300 hover:shadow-md transition block">
            <span className="text-2xl block mb-2">{item.emoji}</span>
            <p className="text-sm font-bold text-gray-800">{item.label}</p>
            <p className="text-xs text-gray-400">{item.desc}</p>
          </a>
        ))}
      </div>

      {/* EMPTY STATE - no data yet */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {[
          { title: "Announcements", href: "/dashboard/announcements", emoji: "📢", cta: "Create first announcement" },
          { title: "Upcoming Meetings", href: "/dashboard/meetings", emoji: "📅", cta: "Schedule a meeting" },
          { title: "Active Dues", href: "/dashboard/dues", emoji: "💰", cta: "Create a due" },
          { title: "Upcoming Events", href: "/dashboard/events", emoji: "🎉", cta: "Create an event" },
        ].map((widget) => (
          <div key={widget.title} className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
              <h3 className="font-bold text-gray-800">{widget.title}</h3>
              <a href={widget.href} className="text-xs text-indigo-600 font-semibold hover:underline">View all</a>
            </div>
            <div className="px-6 py-8 text-center">
              <span className="text-3xl block mb-3">{widget.emoji}</span>
              <p className="text-sm text-gray-400 mb-3">Nothing here yet</p>
              <a href={widget.href} className="text-xs text-indigo-600 font-semibold hover:underline">{widget.cta} →</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
