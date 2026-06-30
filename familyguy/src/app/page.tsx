import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-black text-sm">FG</span>
          </div>
          <span className="text-xl font-black text-gray-900">FamilyGuy</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition px-4 py-2">Sign in</Link>
          <Link href="/register" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition">Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-2 rounded-full mb-8">
          🌍 For families, groups and organizations
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
          One app for every<br />
          <span className="text-indigo-600">group you belong to.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Whether it's your family, your choir, your company or your crew — FamilyGuy keeps everyone organized, connected and informed.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition text-base shadow-lg shadow-indigo-200">
            Get started free →
          </Link>
          <Link href="/login" className="px-8 py-4 border-2 border-gray-200 hover:border-indigo-400 text-gray-700 font-bold rounded-2xl transition text-base">
            Sign in
          </Link>
        </div>
      </section>

      {/* THREE TYPES */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-12">Who is FamilyGuy for?</p>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            {
              emoji: "🏠",
              label: "Families",
              color: "bg-rose-50 border-rose-100",
              labelColor: "text-rose-600 bg-rose-100",
              desc: "Manage your extended family. Track dues, preserve history, build your family tree, share photos, announce news and keep everyone connected across generations.",
              features: ["Family tree", "Members & roles", "Dues tracking", "History & archive", "Photo sharing"],
            },
            {
              emoji: "👥",
              label: "Groups",
              color: "bg-indigo-50 border-indigo-100",
              labelColor: "text-indigo-600 bg-indigo-100",
              desc: "For choirs, clubs, friendship groups, class groups or any informal community. Stay organized with announcements, events, and a beautiful photo feed.",
              features: ["Photo feed & reactions", "Group structure", "Events", "Announcements", "Dues & contributions"],
            },
            {
              emoji: "🏢",
              label: "Organizations",
              color: "bg-amber-50 border-amber-100",
              labelColor: "text-amber-600 bg-amber-100",
              desc: "For businesses, companies, NGOs and institutions. Assign real company roles, manage meetings, track attendance and visualize your org chart.",
              features: ["Org hierarchy chart", "Company roles", "Meetings & minutes", "Departments", "Announcements"],
            },
          ].map((t) => (
            <div key={t.label} className={`rounded-2xl border p-6 ${t.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{t.emoji}</span>
                <span className={`text-xs font-black px-3 py-1 rounded-xl ${t.labelColor}`}>{t.label}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{t.desc}</p>
              <ul className="space-y-1.5">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>{f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-50 border-y border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Shared across everything</p>
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Everything every group needs</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { emoji: "📢", title: "Announcements", desc: "Pin important news. Never lose it in a chat scroll." },
              { emoji: "📅", title: "Meetings", desc: "Schedule, track attendance, upload minutes." },
              { emoji: "💰", title: "Dues", desc: "Create, track and collect contributions easily." },
              { emoji: "🎉", title: "Events", desc: "Reunions, conferences, parties — all in one place." },
              { emoji: "📸", title: "Photo Feed", desc: "Share moments. React, comment, reply." },
              { emoji: "🔔", title: "Notifications", desc: "Never miss anything important." },
              { emoji: "🗂️", title: "Archive", desc: "Documents, minutes, records — forever." },
              { emoji: "🔍", title: "Directory", desc: "Find any member instantly." },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <span className="text-2xl block mb-2">{f.emoji}</span>
                <p className="text-sm font-bold text-gray-800 mb-1">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <h2 className="text-4xl font-black mb-4">Start organizing your world today.</h2>
        <p className="text-indigo-200 mb-8 text-base">Free to get started. No credit card required.</p>
        <Link href="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition text-base">
          Create your first group →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        <span className="font-black text-indigo-600 mr-2">FamilyGuy</span>
        Families · Groups · Organizations
      </footer>
    </main>
  );
}
