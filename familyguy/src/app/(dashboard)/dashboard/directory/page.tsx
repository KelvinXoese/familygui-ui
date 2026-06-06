export default function DirectoryPage() {
  const members = [
    { name: "Kelvin Amenumey Agbemor", role: "Family Head", phone: "+233 24 123 4567", email: "kelvin@email.com", location: "Accra, Ghana", initials: "KA", color: "bg-indigo-600" },
    { name: "Agbesi Amenumey", role: "Elder", phone: "+233 20 987 6543", email: "agbesi@email.com", location: "Ho, Ghana", initials: "AA", color: "bg-purple-500" },
    { name: "Kofi Amenumey", role: "Elder", phone: "+233 24 111 2222", email: "kofi@email.com", location: "Accra, Ghana", initials: "KA", color: "bg-indigo-500" },
    { name: "Ama Kulego", role: "Treasurer", phone: "+233 20 333 4444", email: "ama@email.com", location: "Accra, Ghana", initials: "AK", color: "bg-teal-500" },
    { name: "Yaw Dapaah", role: "Secretary", phone: "+233 55 555 6666", email: "yaw@email.com", location: "London, UK", initials: "YD", color: "bg-rose-500" },
    { name: "Derrick Kulego", role: "Member", phone: "+233 55 456 7890", email: "derrick@email.com", location: "Kumasi, Ghana", initials: "DK", color: "bg-amber-500" },
    { name: "Martha Dapaah", role: "Member", phone: "+233 27 321 0987", email: "martha@email.com", location: "Takoradi, Ghana", initials: "MD", color: "bg-green-500" },
    { name: "Abena Mensah", role: "Member", phone: "+233 27 777 8888", email: "abena@email.com", location: "Accra, Ghana", initials: "AM", color: "bg-pink-500" },
  ];

  const grouped = members.reduce((acc, member) => {
    const letter = member.name[0];
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(member);
    return acc;
  }, {} as Record<string, typeof members>);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Directory 🔍</h2>
          <p className="text-gray-500 text-sm mt-1">Contact information for all family members</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        <input
          type="text"
          placeholder="Search by name, location or role..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
        />
      </div>

      {/* ALPHABET INDEX */}
      <div className="flex flex-wrap gap-2 mb-6">
        {Object.keys(grouped).sort().map((letter) => (
          <button key={letter} className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 text-sm font-bold hover:bg-indigo-100 transition">
            {letter}
          </button>
        ))}
      </div>

      {/* MEMBERS BY LETTER */}
      <div className="space-y-6">
        {Object.keys(grouped).sort().map((letter) => (
          <div key={letter}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-black text-indigo-600">{letter}</span>
              <div className="flex-1 h-px bg-gray-100" />
            </div>
            <div className="space-y-3">
              {grouped[letter].map((member) => (
                <div key={member.name} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full ${member.color} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-800">{member.name}</p>
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg font-semibold flex-shrink-0">
                          {member.role}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-0.5 md:grid-cols-3">
                        <p className="text-xs text-gray-400">📞 {member.phone}</p>
                        <p className="text-xs text-gray-400">✉️ {member.email}</p>
                        <p className="text-xs text-gray-400">📍 {member.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="w-9 h-9 rounded-xl bg-green-50 hover:bg-green-100 text-green-600 text-sm flex items-center justify-center transition">
                        📞
                      </button>
                      <button className="w-9 h-9 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-sm flex items-center justify-center transition">
                        ✉️
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