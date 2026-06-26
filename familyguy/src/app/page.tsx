import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-100 max-w-6xl mx-auto">
        <span className="text-2xl font-black text-indigo-600">FamilyGuy</span>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-indigo-600 transition px-4 py-2">
            Sign in
          </Link>
          <Link href="/register" className="text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl transition">
            Get started free
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 text-xs font-bold px-4 py-2 rounded-full mb-8">
          🌍 Built for African families
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-gray-900 leading-tight mb-6">
          Your family,{" "}
          <span className="text-indigo-600">organized</span>
          <br />for generations.
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          Replace scattered WhatsApp groups, paper notebooks, and lost records.
          FamilyGuy is one place to manage members, preserve history, track dues, and keep your family legacy alive.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link href="/register" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition text-base shadow-lg shadow-indigo-200">
            Create your family →
          </Link>
          <Link href="/login" className="px-8 py-4 border-2 border-gray-200 hover:border-indigo-400 text-gray-700 font-bold rounded-2xl transition text-base">
            Sign in
          </Link>
        </div>
      </section>

      {/* PROBLEM STRIP */}
      <section className="bg-gray-50 border-y border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-8">The problems FamilyGuy solves</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "💬", problem: "Announcements buried in WhatsApp", fix: "Pinned announcements, always visible" },
              { icon: "💸", problem: "Dues tracked in notebooks", fix: "Real-time payment tracking" },
              { icon: "🌳", problem: "Family history disappearing", fix: "Living family tree, built together" },
              { icon: "📋", problem: "Records lost after leadership change", fix: "Permanent archive, forever" },
            ].map((item) => (
              <div key={item.fix} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <span className="text-2xl mb-3 block">{item.icon}</span>
                <p className="text-xs text-rose-500 font-semibold mb-2 line-through opacity-70">{item.problem}</p>
                <p className="text-sm font-bold text-gray-800">{item.fix}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Everything your family needs</p>
        <h2 className="text-3xl font-black text-gray-900 text-center mb-14">One platform. Every need.</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { emoji: "👥", title: "Member Management", desc: "Every member maintains their own profile. Roles, status, and history tracked automatically." },
            { emoji: "📅", title: "Meetings & Minutes", desc: "Schedule physical and virtual meetings. Track attendance, upload minutes, keep permanent records." },
            { emoji: "💰", title: "Dues & Contributions", desc: "Create dues with deadlines. Members see their status. Treasurers see who has paid and who hasn't." },
            { emoji: "🌳", title: "Family Tree", desc: "A living tree that builds itself as members join and connect their relationships. Deceased members preserved." },
            { emoji: "🎉", title: "Events & Gallery", desc: "Reunions, funerals, birthdays. Each event keeps a photo and document archive forever." },
            { emoji: "📢", title: "Announcements", desc: "Important news stays visible. Role-based posting. Never lose an announcement in a chat scroll." },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-gray-100 p-6 hover:border-indigo-200 hover:shadow-md transition">
              <span className="text-3xl mb-4 block">{f.emoji}</span>
              <h3 className="text-base font-bold text-gray-800 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-indigo-600 py-20 text-center text-white">
        <h2 className="text-4xl font-black mb-4">Start your family legacy today.</h2>
        <p className="text-indigo-200 mb-8 text-base">Free to get started. No credit card required.</p>
        <Link href="/register" className="inline-block px-10 py-4 bg-white text-indigo-600 font-bold rounded-2xl hover:bg-indigo-50 transition text-base">
          Create your family →
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-sm text-gray-400 border-t border-gray-100">
        <span className="font-black text-indigo-600 mr-2">FamilyGuy</span>
        WhatsApp is where families talk. FamilyGuy is where families organize.
      </footer>
    </main>
  );
}
