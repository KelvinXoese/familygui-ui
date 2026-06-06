export default function EventsPage() {
  const events = [
    {
      id: 1,
      title: "Amenumey Family Reunion 2025",
      date: "Saturday, 2 August 2025",
      time: "10:00 AM",
      location: "Uncle Kofi's Residence, Accra",
      type: "Reunion",
      description: "Our annual family reunion. All members and their immediate families are invited. Food, games, and lots of family bonding.",
      organizer: "Uncle Kofi",
      attending: 18,
      total: 24,
      status: "Upcoming",
      color: "bg-indigo-500",
    },
    {
      id: 2,
      title: "Grandma Ama's 80th Birthday",
      date: "Sunday, 20 July 2025",
      time: "2:00 PM",
      location: "Kumasi Cultural Centre",
      type: "Birthday",
      description: "A special celebration for Grandma Ama's 80th birthday. Let us shower her with love and blessings.",
      organizer: "Ama Kulego",
      attending: 22,
      total: 24,
      status: "Upcoming",
      color: "bg-rose-500",
    },
    {
      id: 3,
      title: "Funeral of late Mr. Asante",
      date: "Friday, 13 June 2025",
      time: "8:00 AM",
      location: "Tesano, Accra",
      type: "Funeral",
      description: "The final funeral rites of late Mr. Kwame Asante. All members are encouraged to attend to support Abena Mensah and family.",
      organizer: "Secretary",
      attending: 20,
      total: 24,
      status: "Upcoming",
      color: "bg-gray-500",
    },
    {
      id: 4,
      title: "Easter Family Gathering 2025",
      date: "Sunday, 20 April 2025",
      time: "12:00 PM",
      location: "Derrick Kulego's Residence, Kumasi",
      type: "Gathering",
      description: "Easter family gathering with food, prayer and fellowship.",
      organizer: "Derrick Kulego",
      attending: 19,
      total: 24,
      status: "Past",
      color: "bg-green-500",
    },
  ];

  const typeStyle: Record<string, string> = {
    Reunion: "bg-indigo-50 text-indigo-600",
    Birthday: "bg-rose-50 text-rose-600",
    Funeral: "bg-gray-100 text-gray-500",
    Gathering: "bg-green-50 text-green-600",
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Events 🎉</h2>
          <p className="text-gray-500 text-sm mt-1">Family events, gatherings and celebrations</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Create Event
        </button>
      </div>

      {/* UPCOMING EVENTS */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Upcoming Events</p>
      <div className="space-y-4 mb-8">
        {events.filter((e) => e.status === "Upcoming").map((e) => (
          <div key={e.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            {/* COLOR BAR */}
            <div className={`h-1.5 w-full ${e.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-800">{e.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[e.type]}`}>
                      {e.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{e.date} · {e.time}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <span>📍</span>
                <span>{e.location}</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed mb-4">{e.description}</p>

              {/* ATTENDANCE */}
              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500">Attendance</p>
                  <p className="text-xs font-semibold text-gray-600">{e.attending}/{e.total} going</p>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${e.color}`}
                    style={{ width: `${(e.attending / e.total) * 100}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">Organised by {e.organizer}</p>
                <div className="flex items-center gap-2">
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
                    I am Attending
                  </button>
                  <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                    View Gallery
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAST EVENTS */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Past Events</p>
      <div className="space-y-4">
        {events.filter((e) => e.status === "Past").map((e) => (
          <div key={e.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm opacity-70">
            <div className={`h-1.5 w-full ${e.color}`} />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-gray-700">{e.title}</h3>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[e.type]}`}>
                      {e.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{e.date} · {e.time}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-xl bg-gray-100 text-gray-400 flex-shrink-0">
                  Past
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                <span>📍</span>
                <span>{e.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{e.attending}/{e.total} attended</p>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                  View Gallery
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}