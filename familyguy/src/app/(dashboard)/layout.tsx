"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string };
type Family = { id: string; name: string; myRole: string; inviteCode: string };

const roleLabel: Record<string, string> = {
  FAMILY_HEAD: "Family Head",
  ELDER: "Elder",
  TREASURER: "Treasurer",
  SECRETARY: "Secretary",
  HISTORIAN: "Historian",
  EVENT_COORDINATOR: "Event Coordinator",
  MEMBER: "Member",
};

const navItems = [
  { label: "Dashboard", emoji: "🏠", href: "/dashboard" },
  { label: "Members", emoji: "👥", href: "/dashboard/members" },
  { label: "Announcements", emoji: "📢", href: "/dashboard/announcements" },
  { label: "Meetings", emoji: "📅", href: "/dashboard/meetings" },
  { label: "Dues & Contributions", emoji: "💰", href: "/dashboard/dues" },
  { label: "Events", emoji: "🎉", href: "/dashboard/events" },
  { label: "Family Tree", emoji: "🌳", href: "/dashboard/tree" },
  { label: "Family History", emoji: "📖", href: "/dashboard/history" },
  { label: "Directory", emoji: "🔍", href: "/dashboard/directory" },
  { label: "Leadership", emoji: "👑", href: "/dashboard/leadership" },
  { label: "Archive", emoji: "🗂️", href: "/dashboard/archive" },
  { label: "Notifications", emoji: "🔔", href: "/dashboard/notifications" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [family, setFamily] = useState<Family | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // Fetch current user
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data.user); })
      .catch(() => {});

    // Fetch active family
    const familyId = localStorage.getItem("active_family_id");
    if (familyId) {
      fetch(`/api/families/active?familyId=${familyId}`)
        .then((r) => r.json())
        .then((d) => { if (d.success) setFamily(d.data.family); })
        .catch(() => {});
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("active_family_id");
    router.push("/login");
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "..";

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo + Family */}
      <div className="px-6 py-5 border-b border-gray-100">
        <h1 className="text-2xl font-black text-indigo-600">FamilyGuy</h1>
        {family ? (
          <div className="mt-1">
            <p className="text-xs font-semibold text-gray-700 truncate">{family.name}</p>
            <p className="text-xs text-gray-400">Code: <span className="font-mono font-bold">{family.inviteCode}</span></p>
          </div>
        ) : (
          <p className="text-xs text-gray-400 mt-0.5">Loading family...</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive(item.href)
                ? "bg-indigo-600 text-white font-semibold"
                : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}
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
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-700 truncate">
              {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {family ? roleLabel[family.myRole] || family.myRole : "Member"}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-gray-300 hover:text-rose-400 transition text-sm"
          >
            ↩
          </button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed h-full w-64 flex-col z-20">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-40">
            <Sidebar />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64">

        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              ☰
            </button>
            <p className="text-xs text-gray-400 hidden md:block">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard/notifications" className="relative p-2 text-gray-400 hover:text-gray-600 transition text-lg">
              🔔
            </a>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {initials}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="px-6 py-8 md:px-8">
          {children}
        </main>

      </div>
    </div>
  );
}
