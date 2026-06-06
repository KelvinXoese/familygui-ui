export default function AnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "Family Reunion scheduled for August 2025",
      body: "Dear family members, we are excited to announce our annual family reunion will be held on Saturday 2nd August 2025 at Uncle Kofi's residence in Accra. All members are encouraged to attend. More details will follow.",
      author: "Uncle Kofi",
      role: "Family Head",
      initials: "KA",
      time: "2 hours ago",
      date: "Fri, 6 Jun 2025",
      pinned: true,
      color: "bg-indigo-500",
    },
    {
      id: 2,
      title: "Monthly dues reminder — June 2025",
      body: "This is a reminder that monthly dues of GHS 50 are due by 30th June 2025. Please ensure you make your payment on time. Members with outstanding dues from previous months are also encouraged to clear them.",
      author: "Ama Kulego",
      role: "Treasurer",
      initials: "AK",
      time: "1 day ago",
      date: "Thu, 5 Jun 2025",
      pinned: false,
      color: "bg-teal-500",
    },
    {
      id: 3,
      title: "New member joined: Martha Dapaah",
      body: "Please join us in welcoming Martha Dapaah who has just joined the Amenumey Family on FamilyGuy. Martha is based in Takoradi. Please make her feel welcome!",
      author: "Secretary",
      role: "Secretary",
      initials: "YD",
      time: "3 days ago",
      date: "Tue, 3 Jun 2025",
      pinned: false,
      color: "bg-rose-500",
    },
    {
      id: 4,
      title: "Funeral contribution for late Mr. Asante",
      body: "We are saddened to announce the passing of Mr. Kwame Asante, father of our member Abena Mensah. A contribution of GHS 100 per member has been set. Please make your contribution by 10th June.",
      author: "Uncle Kofi",
      role: "Family Head",
      initials: "KA",
      time: "5 days ago",
      date: "Sun, 1 Jun 2025",
      pinned: false,
      color: "bg-indigo-500",
    },
  ];

  const userRole = "Family Head";
  const canPost = ["Family Head", "Secretary", "Treasurer", "Elder"].includes(userRole);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Announcements 📢</h2>
          <p className="text-gray-500 text-sm mt-1">Stay updated with family news</p>
        </div>
        {canPost ? (
          <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
            + New Announcement
          </button>
        ) : (
          <div className="px-4 py-2 bg-gray-100 text-gray-400 text-xs font-semibold rounded-xl">
            Read only
          </div>
        )}
      </div>

      {/* PINNED */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">📌 Pinned</p>
      {announcements.filter((a) => a.pinned).map((a) => (
        <div key={a.id} className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-full ${a.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {a.initials}
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">{a.author}</p>
                <p className="text-xs text-gray-400">{a.role} · {a.time}</p>
              </div>
            </div>
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg font-semibold flex-shrink-0">
              📌 Pinned
            </span>
          </div>
          <h3 className="text-base font-bold text-gray-800 mb-2">{a.title}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{a.body}</p>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-indigo-100">
            <button className="text-xs font-semibold text-indigo-600 hover:underline">👍 Like</button>
            <button className="text-xs font-semibold text-gray-500 hover:underline">💬 Comment</button>
            <button className="text-xs font-semibold text-gray-500 hover:underline">📤 Share</button>
          </div>
        </div>
      ))}

      {/* ALL ANNOUNCEMENTS */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">All Announcements</p>
      <div className="space-y-4">
        {announcements.filter((a) => !a.pinned).map((a) => (
          <div key={a.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-9 h-9 rounded-full ${a.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                {a.initials}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-gray-800">{a.author}</p>
                  <p className="text-xs text-gray-400">{a.time}</p>
                </div>
                <p className="text-xs text-gray-400">{a.role} · {a.date}</p>
              </div>
            </div>
            <h3 className="text-base font-bold text-gray-800 mb-2">{a.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{a.body}</p>
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-50">
              <button className="text-xs font-semibold text-indigo-600 hover:underline">👍 Like</button>
              <button className="text-xs font-semibold text-gray-500 hover:underline">💬 Comment</button>
              <button className="text-xs font-semibold text-gray-500 hover:underline">📤 Share</button>
              {canPost && (
                <button className="ml-auto text-xs font-semibold text-gray-400 hover:text-gray-600">
                  📌 Pin
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}