export default function DashboardPage() {
  return (
    <div>

      {/* WELCOME */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, Kelvin 👋</h2>
        <p className="text-gray-500 text-sm mt-1">Here's what's happening in the Amenumey Family</p>
      </div>

      {/* PROFILE COMPLETION NUDGE */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-base">Complete your family profile 🌳</p>
            <p className="text-indigo-100 text-sm mt-0.5">Help your family know their roots</p>
          </div>
          <span className="text-3xl font-black">45%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-white rounded-full h-2" style={{ width: "45%" }} />
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            { label: "Basic Info", done: true },
            { label: "Profile Photo", done: true },
            { label: "Date of Birth", done: false },
            { label: "Occupation & Location", done: false },
            { label: "Family Relationships", done: false },
            { label: "Biography", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <span>{item.done ? "✅" : "⬜"}</span>
              <span className={item.done ? "text-white" : "text-indigo-200"}>{item.label}</span>
            </div>
          ))}
        </div>
        <button className="bg-white text-indigo-600 font-bold text-sm px-5 py-2 rounded-xl hover:bg-indigo-50 transition">
          Complete profile →
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-4 mb-8 md:grid-cols-4">
        {[
          { label: "Members", value: "24", sub: "in your family", color: "text-indigo-600", bg: "bg-indigo-50" },
          { label: "Meetings", value: "2", sub: "upcoming", color: "text-amber-500", bg: "bg-amber-50" },
          { label: "Dues", value: "3", sub: "active", color: "text-rose-500", bg: "bg-rose-50" },
          { label: "Events", value: "1", sub: "upcoming", color: "text-green-500", bg: "bg-green-50" },
        ].map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-3`}>
              <span className={`text-xl font-black ${card.color}`}>{card.value}</span>
            </div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{card.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* BOTTOM GRID */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        {/* RECENT ANNOUNCEMENTS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Announcements</h3>
            <a href="/dashboard/announcements" className="text-xs text-indigo-600 font-semibold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { title: "Family reunion scheduled for August", time: "2h ago", author: "Uncle Kofi" },
              { title: "Monthly dues reminder — June", time: "1d ago", author: "Treasurer Ama" },
              { title: "New member joined: Martha Dapaah", time: "3d ago", author: "Secretary" },
            ].map((item) => (
              <div key={item.title} className="px-6 py-4">
                <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">by {item.author} · {item.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING MEETINGS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Upcoming Meetings</h3>
            <a href="/dashboard/meetings" className="text-xs text-indigo-600 font-semibold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { title: "Monthly Family Meeting", date: "Sat, 14 Jun 2025", type: "Physical", location: "Uncle Kofi's house" },
              { title: "Emergency Dues Discussion", date: "Sun, 22 Jun 2025", type: "Virtual", location: "Google Meet" },
            ].map((item) => (
              <div key={item.title} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.date} · {item.location}</p>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${item.type === "Virtual" ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"}`}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE DUES */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Active Dues</h3>
            <a href="/dashboard/dues" className="text-xs text-indigo-600 font-semibold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { title: "Monthly Dues — June", amount: "GHS 50", status: "Pending", deadline: "30 Jun" },
              { title: "Building Fund", amount: "GHS 200", status: "Paid", deadline: "15 Jun" },
              { title: "Funeral Contribution", amount: "GHS 100", status: "Partial", deadline: "10 Jun" },
            ].map((item) => (
              <div key={item.title} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.amount} · Due {item.deadline}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                  item.status === "Paid" ? "bg-green-50 text-green-600" :
                  item.status === "Partial" ? "bg-amber-50 text-amber-600" :
                  "bg-rose-50 text-rose-600"
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* UPCOMING EVENTS */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
            <h3 className="font-bold text-gray-800">Upcoming Events</h3>
            <a href="/dashboard/events" className="text-xs text-indigo-600 font-semibold hover:underline">View all</a>
          </div>
          <div className="divide-y divide-gray-50">
            {[
              { title: "Amenumey Family Reunion", date: "Sat, 2 Aug 2025", type: "Reunion" },
              { title: "Grandma Ama's 80th Birthday", date: "Sun, 20 Jul 2025", type: "Birthday" },
            ].map((item) => (
              <div key={item.title} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{item.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.date}</p>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded-lg bg-purple-50 text-purple-600">
                  {item.type}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}