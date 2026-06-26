"use client";
import { useState, useEffect } from "react";

type Notif = { id: string; type: string; title: string; body: string; isRead: boolean; createdAt: string };

const notifIcon: Record<string, string> = {
  ANNOUNCEMENT: "📢", MEETING_REMINDER: "📅", DUE_REMINDER: "💰",
  EVENT_REMINDER: "🎉", BIRTHDAY: "🎂", RELATIONSHIP_REQUEST: "🌳", GENERAL: "🔔",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/notifications")
      .then((r) => r.json())
      .then((d) => { if (d.success) setNotifications(d.data.notifications); })
      .finally(() => setLoading(false));
  }, []);

  const markAllRead = () => {
    fetch("/api/auth/notifications/read-all", { method: "POST" }).then(() =>
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    );
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Notifications 🔔</h2>
          <p className="text-gray-500 text-sm mt-1">{unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="px-5 py-2.5 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-50 transition">Mark all read</button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
      ) : notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">🔔</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No notifications yet</h3>
          <p className="text-sm text-gray-400">You will be notified about announcements, meetings, dues, events and birthdays here</p>
          <div className="mt-6 grid grid-cols-2 gap-3 max-w-xs mx-auto text-left">
            {[["📢","New announcements"],["📅","Meeting reminders"],["💰","Due reminders"],["🎂","Birthday alerts"]].map(([icon, label]) => (
              <div key={label} className="flex items-center gap-2 text-sm text-gray-500"><span>{icon}</span>{label}</div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div key={n.id} className={`flex items-start gap-4 p-4 rounded-2xl transition ${n.isRead ? "bg-white border border-gray-100" : "bg-indigo-50 border border-indigo-100"}`}>
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-xl flex-shrink-0 shadow-sm">
                {notifIcon[n.type] || "🔔"}
              </div>
              <div className="flex-1">
                <p className={`text-sm ${n.isRead ? "font-medium text-gray-700" : "font-bold text-gray-800"}`}>{n.title}</p>
                <p className="text-sm text-gray-500 mt-0.5">{n.body}</p>
                <p className="text-xs text-gray-400 mt-1">{timeAgo(n.createdAt)}</p>
              </div>
              {!n.isRead && <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
