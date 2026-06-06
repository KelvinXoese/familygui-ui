export default function ArchivePage() {
  const archives = [
    {
      year: "2025",
      items: [
        { title: "May 2025 Meeting Minutes", type: "Minutes", date: "10 May 2025", size: "245 KB", icon: "📄" },
        { title: "Building Fund Report Q1", type: "Report", date: "1 Apr 2025", size: "512 KB", icon: "📊" },
        { title: "Easter Gathering 2025 Photos", type: "Gallery", date: "20 Apr 2025", size: "48 MB", icon: "🖼️" },
        { title: "Annual Dues Statement 2025", type: "Financial", date: "1 Jan 2025", size: "128 KB", icon: "💰" },
      ],
    },
    {
      year: "2024",
      items: [
        { title: "Family Reunion 2024 Video", type: "Video", date: "3 Aug 2024", size: "1.2 GB", icon: "🎥" },
        { title: "December Meeting Minutes", type: "Minutes", date: "14 Dec 2024", size: "198 KB", icon: "📄" },
        { title: "Annual Financial Report 2024", type: "Financial", date: "31 Dec 2024", size: "340 KB", icon: "💰" },
        { title: "Family History Document", type: "Document", date: "15 Jun 2024", size: "2.1 MB", icon: "📚" },
      ],
    },
  ];

  const typeStyle: Record<string, string> = {
    Minutes: "bg-indigo-50 text-indigo-600",
    Report: "bg-blue-50 text-blue-600",
    Gallery: "bg-amber-50 text-amber-600",
    Financial: "bg-green-50 text-green-600",
    Video: "bg-rose-50 text-rose-600",
    Document: "bg-purple-50 text-purple-600",
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Archive 🗂️</h2>
          <p className="text-gray-500 text-sm mt-1">Family history, documents and memories</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Upload Document
        </button>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search documents and files..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      {/* FILTER TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", "Minutes", "Financial", "Gallery", "Video", "Document"].map((tab) => (
          <button key={tab} className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition flex-shrink-0 ${tab === "All" ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-300"}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* STORAGE SUMMARY */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Storage used</p>
          <p className="text-sm font-bold text-indigo-600">1.4 GB / 5 GB</p>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full" style={{ width: "28%" }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">3.6 GB remaining</p>
      </div>

      {/* ARCHIVES BY YEAR */}
      <div className="space-y-8">
        {archives.map((group) => (
          <div key={group.year}>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-lg font-black text-indigo-600">{group.year}</span>
              <div className="flex-1 h-px bg-gray-100" />
              <span className="text-xs text-gray-400">{group.items.length} items</span>
            </div>
            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-2xl flex-shrink-0">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[item.type]}`}>
                          {item.type}
                        </span>
                        <span className="text-xs text-gray-400">{item.date}</span>
                        <span className="text-xs text-gray-400">{item.size}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm flex items-center justify-center transition">
                        👁️
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-sm flex items-center justify-center transition">
                        ⬇️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}