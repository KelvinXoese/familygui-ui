"use client";
import { useState } from "react";

const sections = [
  {
    id: 1,
    title: "Work & Education",
    emoji: "💼",
    description: "Tell your family about your career and educational background.",
    fields: [
      { label: "Occupation", placeholder: "e.g. Software Engineer", type: "text" },
      { label: "Employer / Company", placeholder: "e.g. Vodafone Ghana", type: "text" },
      { label: "Highest Education", placeholder: "e.g. BSc Computer Science, KNUST", type: "text" },
      { label: "Field of Study", placeholder: "e.g. Computer Science", type: "text" },
    ],
  },
  {
    id: 2,
    title: "Personal",
    emoji: "🏡",
    description: "Share personal details that help your family know you better.",
    fields: [
      { label: "Hometown", placeholder: "e.g. Ho, Volta Region", type: "text" },
      { label: "Place of Birth", placeholder: "e.g. Accra, Ghana", type: "text" },
      { label: "Current Location", placeholder: "e.g. Accra, Ghana", type: "text" },
      { label: "Hobbies & Interests", placeholder: "e.g. Football, Reading, Cooking", type: "text" },
    ],
  },
  {
    id: 3,
    title: "Achievements",
    emoji: "🏆",
    description: "Celebrate your accomplishments with your family.",
    fields: [
      { label: "Notable Achievement", placeholder: "e.g. First in family to graduate university", type: "text" },
      { label: "Awards or Recognition", placeholder: "e.g. Best Employee Award 2023", type: "text" },
      { label: "Community Involvement", placeholder: "e.g. Youth leader at St. Mary's Church", type: "text" },
    ],
  },
  {
    id: 4,
    title: "Message to Family",
    emoji: "💌",
    description: "Leave a personal note for your family members.",
    fields: [
      { label: "Your message", placeholder: "Write something meaningful to your family...", type: "textarea" },
    ],
  },
];

export default function BuildProfilePage() {
  const [activeSection, setActiveSection] = useState(1);

  return (
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <a href="/dashboard/tree" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← Back to Family Tree
        </a>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Build Your Profile 👤</h2>
        <p className="text-gray-500 text-sm mt-1">
          Answer questions to help your family know your story. Notifications will remind you to complete each section.
        </p>
      </div>

      {/* OVERALL PROGRESS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Profile completion</p>
          <span className="text-sm font-black text-indigo-600">25%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 mb-4">
          <div className="bg-indigo-500 h-2 rounded-full w-1/4" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sections.map((s) => (
            <div key={s.id} className="flex items-center gap-2 text-sm">
              <span>{s.id === 1 ? "✅" : "⬜"}</span>
              <span className={s.id === 1 ? "text-gray-700 font-semibold" : "text-gray-400"}>
                {s.title}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION TABS */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition flex-shrink-0 ${
              activeSection === s.id
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:border-indigo-300"
            }`}
          >
            <span>{s.emoji}</span>
            {s.title}
          </button>
        ))}
      </div>

      {/* ACTIVE SECTION */}
      {sections.filter((s) => s.id === activeSection).map((s) => (
        <div key={s.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{s.emoji}</span>
            <h3 className="text-lg font-bold text-gray-800">{s.title}</h3>
          </div>
          <p className="text-sm text-gray-500 mb-6">{s.description}</p>

          <div className="space-y-4">
            {s.fields.map((field) => (
              <div key={field.label}>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    placeholder={field.placeholder}
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition resize-none"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition text-sm">
              Save Section
            </button>
            {activeSection < sections.length && (
              <button
                onClick={() => setActiveSection(activeSection + 1)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold rounded-xl transition text-sm"
              >
                Next Section →
              </button>
            )}
          </div>
        </div>
      ))}

      <p className="text-center text-xs text-gray-400 mt-4 mb-8">
        You will receive friendly reminders to complete each section. Take your time.
      </p>

    </div>
  );
}