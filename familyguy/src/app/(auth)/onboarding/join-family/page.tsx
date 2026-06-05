export default function JoinFamilyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Back */}
        <div className="flex items-center gap-3 mb-6">
          <a href="/onboarding" className="text-gray-400 hover:text-gray-600 transition text-sm">← Back</a>
        </div>

        <div className="mb-2">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Join a family 🤝</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your invite code or scan a QR code</p>
        </div>

        <form className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Family invite code</label>
            <input
              type="text"
              placeholder="e.g. AME-24831"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition tracking-widest font-mono uppercase"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm"
          >
            Join Family
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-gray-400 text-xs">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* QR Code */}
        <button className="w-full flex items-center justify-center gap-3 py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:border-indigo-400 hover:text-indigo-500 transition">
          <span className="text-xl">📷</span>
          Scan QR Code
        </button>

      </div>
    </div>
  );
}