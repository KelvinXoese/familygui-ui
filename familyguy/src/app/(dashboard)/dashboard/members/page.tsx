export default function MembersPage() {
  const members = [
    { name: "Kelvin Amenumey Agbemor", role: "Family Head", status: "Active", initials: "KA", dob: "12 Mar 1995", phone: "+233 24 123 4567", location: "Accra, Ghana" },
    { name: "Agbesi Amenumey", role: "Elder", status: "Active", initials: "AA", dob: "4 Jul 1960", phone: "+233 20 987 6543", location: "Ho, Ghana" },
    { name: "Derrick Kulego", role: "Member", status: "Active", initials: "DK", dob: "22 Nov 1990", phone: "+233 55 456 7890", location: "Kumasi, Ghana" },
    { name: "Martha Dapaah", role: "Member", status: "Active", initials: "MD", dob: "8 Jan 1988", phone: "+233 27 321 0987", location: "Takoradi, Ghana" },
    { name: "Kofi Amenumey", role: "Elder", status: "Active", initials: "KA", dob: "15 Aug 1955", phone: "+233 24 111 2222", location: "Accra, Ghana" },
    { name: "Ama Kulego", role: "Treasurer", status: "Active", initials: "AK", dob: "30 May 1985", phone: "+233 20 333 4444", location: "Accra, Ghana" },
    { name: "Yaw Dapaah", role: "Secretary", status: "Inactive", initials: "YD", dob: "19 Feb 1992", phone: "+233 55 555 6666", location: "London, UK" },
    { name: "Abena Mensah", role: "Member", status: "Active", initials: "AM", dob: "3 Oct 1998", phone: "+233 27 777 8888", location: "Accra, Ghana" },
  ];

  const colors = [
    "bg-indigo-500", "bg-purple-500", "bg-rose-500", "bg-amber-500",
    "bg-green-500", "bg-teal-500", "bg-pink-500", "bg-orange-500"
  ];

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Members</h2>
          <p className="text-gray-500 text-sm mt-1">24 members in the Amenumey Family</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Invite Member
        </button>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Search members..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 outline-none focus:border-indigo-500 transition">
          <option>All roles</option>
          <option>Family Head</option>
          <option>Elder</option>
          <option>Treasurer</option>
          <option>Secretary</option>
          <option>Member</option>
        </select>
        <select className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-600 outline-none focus:border-indigo-500 transition">
          <option>All status</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>
      </div>

      {/* MEMBERS GRID */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {members.map((member, index) => (
          <div key={member.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition cursor-pointer">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className={`w-12 h-12 rounded-full ${colors[index % colors.length]} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                {member.initials}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-bold text-gray-800 truncate">{member.name}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg flex-shrink-0 ${member.status === "Active" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {member.status}
                  </span>
                </div>
                <span className="inline-block text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg mt-1">
                  {member.role}
                </span>
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-gray-400">🎂 {member.dob}</p>
                  <p className="text-xs text-gray-400">📍 {member.location}</p>
                  <p className="text-xs text-gray-400">📞 {member.phone}</p>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
              <button className="flex-1 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition">
                View Profile
              </button>
              <button className="flex-1 py-2 text-xs font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-xl transition">
                Message
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}