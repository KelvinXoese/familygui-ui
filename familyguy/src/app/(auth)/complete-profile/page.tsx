export default function CompleteProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-sm border border-gray-100 p-8">

        <div className="mb-2">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        {/* Step indicator - completed */}
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Almost there! 🎉</h2>
          <p className="text-gray-500 text-sm mt-1">Just two quick things before we take you in</p>
        </div>

        <form className="space-y-6">

          {/* Profile Photo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Profile photo</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-indigo-50 border-2 border-dashed border-indigo-200 flex items-center justify-center cursor-pointer hover:bg-indigo-100 transition flex-shrink-0">
                <span className="text-2xl">📷</span>
              </div>
              <div>
                <button type="button" className="text-sm font-semibold text-indigo-600 hover:underline">
                  Upload photo
                </button>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                <p className="text-xs text-gray-400">Helps family members recognise you</p>
              </div>
            </div>
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Date of birth <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-gray-600"
            />
            <p className="text-xs text-gray-400 mt-1.5">
              🎂 Your family will be notified on your birthday
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm"
          >
            Go to my family →
          </button>

        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          You can update your full profile anytime from settings
        </p>

      </div>
    </div>
  );
}