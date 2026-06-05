export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full">

        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <h1 className="text-2xl font-black text-indigo-600">FamilyGuy</h1>
          <p className="text-xs text-gray-400 mt-0.5">Amenumey Family</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {[
            { label: "Dashboard", emoji: "🏠", href: "/dashboard" },
            { label: "Members", emoji: "👥", href: "/dashboard/members" },
            { label: "Announcements", emoji: "📢", href: "/dashboard/announcements" },
            { label: "Meetings", emoji: "📅", href: "/dashboard/meetings" },
            { label: "Dues & Contributions", emoji: "💰", href: "/dashboard/dues" },
            { label: "Events", emoji: "🎉", href: "/dashboard/events" },
            { label: "Family Tree", emoji: "🌳", href: "/dashboard/tree" },
            { label: "Directory", emoji: "🔍", href: "/dashboard/directory" },
            { label: "Archive", emoji: "🗂️", href: "/dashboard/archive" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <span className="text-base">{item.emoji}</span>
              {item.label}
            </a>
          ))}
        </nav>

        {/* User */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              KA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-700 truncate">Kelvin Amenumey</p>
              <p className="text-xs text-gray-400 truncate">Family Head</p>
            </div>
            <a href="/login" className="text-gray-300 hover:text-gray-500 transition text-xs">
              ↩
            </a>
          </div>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64">

        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <p className="text-xs text-gray-400">Friday, 6 June 2025</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 text-gray-400 hover:text-gray-600 transition">
              🔔
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              KA
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="px-8 py-8">
          {children}
        </main>

      </div>
    </div>
  );
}