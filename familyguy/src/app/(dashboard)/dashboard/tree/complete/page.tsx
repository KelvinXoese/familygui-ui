"use client";
import { useState } from "react";

export default function CompleteTreeProfilePage() {
  const [parentOnApp, setParentOnApp] = useState<boolean | null>(null);
  const [hasChildren, setHasChildren] = useState<boolean | null>(null);
  const [children, setChildren] = useState([{ name: "" }]);

  const addChild = () => setChildren([...children, { name: "" }]);
  const removeChild = (i: number) => setChildren(children.filter((_, idx) => idx !== i));
  const updateChild = (i: number, value: string) => {
    const updated = [...children];
    updated[i].name = value;
    setChildren(updated);
  };

  return (
    <div className="max-w-2xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <a href="/dashboard/tree" className="text-sm text-gray-400 hover:text-gray-600 transition">
          ← Back to Family Tree
        </a>
        <h2 className="text-2xl font-bold text-gray-800 mt-3">Complete Tree Profile 🌳</h2>
        <p className="text-gray-500 text-sm mt-1">
          This helps us build an accurate and real family tree based on blood connections.
        </p>
      </div>

      {/* PROGRESS */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-bold text-gray-700">Tree profile completion</p>
          <span className="text-sm font-black text-indigo-600">20%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div className="bg-indigo-500 h-2 rounded-full w-1/5" />
        </div>
      </div>

      {/* SECTION 1: PARENT */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
            1
          </div>
          <h3 className="text-base font-bold text-gray-800">Your parent in this family</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-11">
          Which parent links you to the Amenumey family? This is the person who brought you into this family tree.
        </p>

        {/* IS PARENT ON APP? */}
        <p className="text-sm font-semibold text-gray-700 mb-3">Is your parent already a member on FamilyGuy?</p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setParentOnApp(true)}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${parentOnApp === true ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            Yes, they are a member
          </button>
          <button
            onClick={() => setParentOnApp(false)}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${parentOnApp === false ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            No, they are not
          </button>
        </div>

        {/* IF YES — SELECT FROM MEMBERS */}
        {parentOnApp === true && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Select your parent
            </label>
            <select className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition text-gray-600">
              <option value="">Select a family member...</option>
              <option>Agbesi Amenumey (Elder)</option>
              <option>Kofi Amenumey (Elder)</option>
              <option>Derrick Kulego (Member)</option>
              <option>Ama Kulego (Treasurer)</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              A connection request will be sent to them to confirm the relationship.
            </p>
          </div>
        )}

        {/* IF NO — TYPE NAME */}
        {parentOnApp === false && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Parent's full name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Benjamin Amenumey"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Are they living or deceased?
              </label>
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-500 hover:border-gray-300 transition">
                  Living
                </button>
                <button className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-bold text-gray-500 hover:border-gray-300 transition">
                  Deceased
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              Their name will appear on the tree. If they join FamilyGuy later, their profile will be automatically linked.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: CHILDREN */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-black">
            2
          </div>
          <h3 className="text-base font-bold text-gray-800">Your children</h3>
        </div>
        <p className="text-sm text-gray-500 mb-6 ml-11">
          Add your children so they can be linked to you on the family tree. Skip if you have none.
        </p>

        <p className="text-sm font-semibold text-gray-700 mb-3">Do you have children?</p>
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setHasChildren(true)}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${hasChildren === true ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            Yes
          </button>
          <button
            onClick={() => setHasChildren(false)}
            className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition ${hasChildren === false ? "border-indigo-500 bg-indigo-50 text-indigo-600" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
          >
            No
          </button>
        </div>

        {hasChildren === true && (
          <div className="space-y-3">
            {children.map((child, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="text"
                    value={child.name}
                    onChange={(e) => updateChild(i, e.target.value)}
                    placeholder={`Child ${i + 1} full name`}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                  />
                </div>
                {children.length > 1 && (
                  <button
                    onClick={() => removeChild(i)}
                    className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 transition font-bold text-lg flex items-center justify-center flex-shrink-0"
                  >
                    x
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addChild}
              className="w-full py-3 border-2 border-dashed border-indigo-200 text-indigo-500 hover:border-indigo-400 hover:bg-indigo-50 rounded-xl text-sm font-bold transition"
            >
              + Add another child
            </button>
            <p className="text-xs text-gray-400">
              If your child is already a member, they will be automatically linked when they confirm the relationship.
            </p>
          </div>
        )}

        {hasChildren === false && (
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-sm text-gray-400">No children added. You can always update this later.</p>
          </div>
        )}
      </div>

      {/* SUBMIT */}
      <button className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl transition text-base">
        Save Tree Profile
      </button>

      <p className="text-center text-xs text-gray-400 mt-4">
        You can update your tree profile anytime from the Family Tree page
      </p>

    </div>
  );
}