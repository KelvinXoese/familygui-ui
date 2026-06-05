export default function CreateFamilyPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Back + Logo */}
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
          <h2 className="text-2xl font-bold text-gray-800">Create your family 🏠</h2>
          <p className="text-gray-500 text-sm mt-1">Fill in the details to get started</p>
        </div>

        <form className="space-y-4">

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Family name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Amenumey Family"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              placeholder="Tell us about your family..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Family motto <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. United we stand"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Family origin <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Volta Region, Ghana"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm"
          >
            Create Family
          </button>

        </form>

      </div>
    </div>
  );
}