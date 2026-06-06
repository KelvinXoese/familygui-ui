export default function DuesPage() {
  const dues = [
    {
      id: 1,
      title: "Monthly Dues — June 2025",
      amount: 50,
      currency: "GHS",
      deadline: "30 Jun 2025",
      description: "Regular monthly contribution for family welfare and operations.",
      myStatus: "Pending",
      paid: 16,
      total: 24,
      type: "Monthly",
    },
    {
      id: 2,
      title: "Building Fund",
      amount: 200,
      currency: "GHS",
      deadline: "15 Jun 2025",
      description: "One-time contribution towards the construction of the family house.",
      myStatus: "Paid",
      paid: 20,
      total: 24,
      type: "One-time",
    },
    {
      id: 3,
      title: "Funeral Contribution — Mr. Asante",
      amount: 100,
      currency: "GHS",
      deadline: "10 Jun 2025",
      description: "Welfare contribution for the funeral of late Mr. Kwame Asante.",
      myStatus: "Partial",
      paid: 10,
      total: 24,
      type: "Welfare",
    },
    {
      id: 4,
      title: "Monthly Dues — May 2025",
      amount: 50,
      currency: "GHS",
      deadline: "31 May 2025",
      description: "Regular monthly contribution for family welfare and operations.",
      myStatus: "Paid",
      paid: 22,
      total: 24,
      type: "Monthly",
    },
  ];

  const statusStyle: Record<string, string> = {
    Paid: "bg-green-50 text-green-600",
    Pending: "bg-rose-50 text-rose-600",
    Partial: "bg-amber-50 text-amber-600",
  };

  const typeStyle: Record<string, string> = {
    Monthly: "bg-indigo-50 text-indigo-600",
    "One-time": "bg-purple-50 text-purple-600",
    Welfare: "bg-rose-50 text-rose-600",
  };

  const activeDues = dues.filter((d) => d.myStatus !== "Paid" || d.deadline > "31 May 2025");
  const summary = {
    total: dues.reduce((s, d) => s + (d.myStatus === "Paid" ? d.amount : 0), 0),
    pending: dues.reduce((s, d) => s + (d.myStatus === "Pending" ? d.amount : 0), 0),
    partial: dues.reduce((s, d) => s + (d.myStatus === "Partial" ? d.amount / 2 : 0), 0),
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dues & Contributions 💰</h2>
          <p className="text-gray-500 text-sm mt-1">Track and manage family contributions</p>
        </div>
        <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
          + Create Due
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Total Paid</p>
          <p className="text-2xl font-black text-green-600 mt-1">GHS {summary.total}</p>
          <p className="text-xs text-green-500 mt-1">This year</p>
        </div>
        <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
          <p className="text-xs font-bold text-rose-600 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-black text-rose-600 mt-1">GHS {summary.pending}</p>
          <p className="text-xs text-rose-400 mt-1">Needs payment</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
          <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">Partial</p>
          <p className="text-2xl font-black text-amber-600 mt-1">GHS {summary.partial}</p>
          <p className="text-xs text-amber-400 mt-1">Balance remaining</p>
        </div>
      </div>

      {/* DUES LIST */}
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">All Dues</p>
      <div className="space-y-4">
        {dues.map((due) => (
          <div key={due.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-800">{due.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${typeStyle[due.type]}`}>
                    {due.type}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{due.description}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xl font-black text-gray-800">{due.currency} {due.amount}</p>
                <p className="text-xs text-gray-400 mt-0.5">Due {due.deadline}</p>
              </div>
            </div>

            {/* COLLECTION PROGRESS */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs text-gray-400">Collection progress</p>
                <p className="text-xs font-semibold text-gray-600">{due.paid}/{due.total} members paid</p>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-indigo-500 h-2 rounded-full"
                  style={{ width: `${(due.paid / due.total) * 100}%` }}
                />
              </div>
            </div>

            {/* STATUS + ACTIONS */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
              <span className={`text-sm font-bold px-3 py-1 rounded-xl ${statusStyle[due.myStatus]}`}>
                My status: {due.myStatus}
              </span>
              <div className="flex items-center gap-2">
                {due.myStatus !== "Paid" && (
                  <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition">
                    Pay Now
                  </button>
                )}
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-bold rounded-xl transition">
                  View All Payments
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}