"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

type User = { id: string; firstName: string; lastName: string; email: string; avatarUrl?: string };
type Group = { id: string; name: string; type: string; myRole: string; inviteCode: string; memberCount: number };

const typeConfig = {
  FAMILY: { emoji: "🏠", color: "text-rose-600", bg: "bg-rose-50", label: "Family" },
  GROUP: { emoji: "👥", color: "text-indigo-600", bg: "bg-indigo-50", label: "Group" },
  ORGANIZATION: { emoji: "🏢", color: "text-amber-600", bg: "bg-amber-50", label: "Organization" },
};

const getNavItems = (type: string) => {
  const base = [
    { label: "Dashboard", emoji: "🏠", href: "/dashboard" },
    { label: "Members", emoji: "👥", href: "/dashboard/members" },
    { label: "Announcements", emoji: "📢", href: "/dashboard/announcements" },
    { label: "Photos", emoji: "📸", href: "/dashboard/posts" },
    { label: "Meetings", emoji: "📅", href: "/dashboard/meetings" },
    { label: "Dues & Contributions", emoji: "💰", href: "/dashboard/dues" },
    { label: "Events", emoji: "🎉", href: "/dashboard/events" },
  ];

  if (type === "FAMILY") {
    return [
      ...base,
      { label: "Family Tree", emoji: "🌳", href: "/dashboard/tree" },
      { label: "Family History", emoji: "📖", href: "/dashboard/history" },
      { label: "Directory", emoji: "🔍", href: "/dashboard/directory" },
      { label: "Leadership", emoji: "👑", href: "/dashboard/leadership" },
      { label: "Archive", emoji: "🗂️", href: "/dashboard/archive" },
      { label: "Notifications", emoji: "🔔", href: "/dashboard/notifications" },
    ];
  }
  if (type === "ORGANIZATION") {
    return [
      ...base,
      { label: "Org Structure", emoji: "🏗️", href: "/dashboard/structure" },
      { label: "Directory", emoji: "🔍", href: "/dashboard/directory" },
      { label: "Archive", emoji: "🗂️", href: "/dashboard/archive" },
      { label: "Notifications", emoji: "🔔", href: "/dashboard/notifications" },
    ];
  }
  // GROUP
  return [
    ...base,
    { label: "Group Structure", emoji: "🏗️", href: "/dashboard/structure" },
    { label: "Directory", emoji: "🔍", href: "/dashboard/directory" },
    { label: "Archive", emoji: "🗂️", href: "/dashboard/archive" },
    { label: "Notifications", emoji: "🔔", href: "/dashboard/notifications" },
  ];
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const groupType = (group?.type || "FAMILY") as keyof typeof typeConfig;
  const tc = typeConfig[groupType];
  const navItems = getNavItems(group?.type || "FAMILY");

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setUser(d.data.user); });

    const groupId = localStorage.getItem("active_group_id");
    if (groupId) {
      fetch(`/api/groups/active?groupId=${groupId}`, { credentials: "include" })
        .then((r) => r.json())
        .then((d) => { if (d.success) setGroup(d.data.group); });
    }
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    localStorage.removeItem("active_group_id");
    localStorage.removeItem("active_group_type");
    router.push("/login");
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase() : "..";
  const isActive = (href: string) => href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const Sidebar = () => (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full">
      {/* Logo + Group */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-black text-xs">FG</span>
          </div>
          <span className="font-black text-gray-900">FamilyGuy</span>
        </div>
        {group ? (
          <div className={`rounded-xl p-3 ${tc.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <span>{tc.emoji}</span>
              <p className="text-sm font-bold text-gray-800 truncate">{group.name}</p>
            </div>
            <p className="text-xs text-gray-400">Code: <span className="font-mono font-bold">{group.inviteCode}</span></p>
          </div>
        ) : (
          <div className="h-14 bg-gray-50 rounded-xl animate-pulse" />
        )}
      </div>

      {/* Switch group */}
      <div className="px-3 pt-3">
        <button onClick={() => router.push("/onboarding")} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition">
          <span>⇄</span> Switch group
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
              isActive(item.href) ? "bg-indigo-600 text-white font-semibold" : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
            }`}>
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
            <p className="text-sm font-semibold text-gray-700 truncate">{user ? `${user.firstName} ${user.lastName}` : "..."}</p>
            <p className="text-xs text-gray-400 truncate">{group?.myRole?.replace(/_/g, " ") || "Member"}</p>
          </div>
          <button onClick={handleLogout} title="Sign out" className="text-gray-300 hover:text-rose-400 transition text-lg">↩</button>
        </div>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <div className="hidden md:flex fixed h-full w-64 flex-col z-20"><Sidebar /></div>
      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 z-40"><Sidebar /></div>
        </div>
      )}
      <div className="flex-1 md:ml-64">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition" onClick={() => setMobileOpen(!mobileOpen)}>☰</button>
            <p className="text-xs text-gray-400 hidden md:block">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard/notifications" className="p-2 text-gray-400 hover:text-gray-600 transition text-lg">🔔</a>
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">{initials}</div>
          </div>
        </header>
        <main className="px-6 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
