export default function MeetingsPage() {
  const meetings = [
    {
      id: 1,
      title: "Monthly Family Meeting",
      date: "Saturday, 14 June 2025",
      time: "10:00 AM - 12:00 PM",
      type: "Physical",
      location: "Uncle Kofi's Residence, Accra",
      agenda: ["Opening prayer", "Review of last meeting minutes", "Dues update", "Family reunion planning", "Any other business"],
      attendees: 18,
      total: 24,
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Emergency Dues Discussion",
      date: "Sunday, 22 June 2025",
      time: "6:00 PM - 7:30 PM",
      type: "Virtual",
      location: "Google Meet",
      agenda: ["Outstanding dues review", "New contribution targets", "Penalty discussion"],
      attendees: 0,
      total: 24,
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Monthly Family Meeting — May 2025",
      date: "Saturday, 10 May 2025",
      time: "10:00 AM - 12:30 PM",
      type: "Physical",
      location: "Auntie Ama's Residence, Kumasi",
      agenda: ["Opening prayer", "Financial report", "Welfare update", "Any other business"],
      attendees: 20,
      total: 24,
      status: "Completed",
    },
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Meetings 📅</h2>
          <p className="text-gray-500 text-sm mt-1">Schedule and track family meetings</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Schedule Meeting
        </button>
      </div>

      {/* UPCOMING */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming</p>
      <div className="space-y-4 mb-8">
        {meetings.filter((m) => m.status === "Upcoming").map((m) => (
          <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h3 className="text-base font-bold text-gray-800">{m.title}</h3>
                <p className="text-sm text-gray-500 mt-1">{m.date} · {m.time}</p>
              </div>
              <span className={`text-xs font-bold px-3 py-1 rounded-xl flex-shrink-0 ${m.type === "Virtual" ? "bg-indigo-50 text-indigo-600" : "bg-green-50 text-green-600"}`}>
                {m.type === "Virtual" ? "Virtual" : "Physical"}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
              <span>📍</span>
              <span>{m.location}</span>
            </div>

            {/* AGENDA */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Agenda</p>
              <ol className="space-y-1">
                {m.agenda.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-indigo-400 font-bold text-xs mt-0.5">{i + 1}.</span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>

            {/* ATTENDANCE */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 mb-1">Expected attendance</p>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full"
                      style={{ width: `${(m.attendees / m.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500">{m.attendees}/{m.total}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
                  Confirm Attendance
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAST MEETINGS */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past Meetings</p>
      <div className="space-y-4">
        {meetings.filter((m) => m.status === "Completed").map((m) => (
          <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm opacity-75">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="text-base font-bold text-gray-700">{m.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{m.date} · {m.time}</p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 text-gray-400">
                Completed
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
              <span>📍</span>
              <span>{m.location}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-green-400 h-1.5 rounded-full"
                    style={{ width: `${(m.attendees / m.total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400">{m.attendees}/{m.total} attended</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                  View Minutes
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                  View Attendance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}