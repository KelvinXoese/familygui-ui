export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-sm border border-gray-100 p-8">

        {/* Logo */}
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-black text-indigo-600">FamilyGuy</h1>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-indigo-600" />
          <div className="w-8 h-1.5 rounded-full bg-gray-200" />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome to FamilyGuy 👋</h2>
          <p className="text-gray-500 text-sm mt-2">
            Would you like to create a new family or join an existing one?
          </p>
        </div>

        <div className="space-y-4">

          {/* Create Family */}
          <a href="/onboarding/create-family" className="block">
            <div className="border-2 border-gray-100 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-3xl flex-shrink-0">
                  🏠
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition">
                    Create a Family
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Start a new family group and invite members to join
                  </p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-indigo-500 transition text-xl">→</div>
              </div>
            </div>
          </a>

          {/* Join Family */}
          <a href="/onboarding/join-family" className="block">
            <div className="border-2 border-gray-100 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer transition group">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">
                  🤝
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-800 group-hover:text-indigo-600 transition">
                    Join a Family
                  </h3>
                  <p className="text-sm text-gray-500 mt-0.5">
                    Enter an invite code or scan a QR code to join
                  </p>
                </div>
                <div className="ml-auto text-gray-300 group-hover:text-indigo-500 transition text-xl">→</div>
              </div>
            </div>
          </a>

        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          You can always create or join more families later
        </p>

      </div>
    </div>
  );
}