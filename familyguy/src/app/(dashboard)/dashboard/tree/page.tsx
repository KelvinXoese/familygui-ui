"use client";
import { useState } from "react";

type Member = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  deceased?: boolean;
  isMe?: boolean;
  children?: Member[];
};

const familyData: Member = {
  id: "1",
  name: "Papavi Amenumey",
  role: "Patriarch",
  initials: "PA",
  color: "bg-gray-600",
  deceased: true,
  children: [
    {
      id: "2",
      name: "Agbesi Amenumey",
      role: "Elder",
      initials: "AA",
      color: "bg-purple-500",
      children: [
        {
          id: "5",
          name: "Kelvin Amenumey",
          role: "Family Head",
          initials: "KA",
          color: "bg-indigo-600",
          isMe: true,
          children: [
            { id: "9", name: "Ama Amenumey", role: "Child", initials: "AA", color: "bg-pink-400", children: [] },
            { id: "10", name: "Kojo Amenumey", role: "Child", initials: "KA", color: "bg-sky-400", children: [] },
          ],
        },
        {
          id: "6",
          name: "Martha Dapaah",
          role: "Member",
          initials: "MD",
          color: "bg-amber-500",
          children: [],
        },
      ],
    },
    {
      id: "3",
      name: "Kofi Amenumey",
      role: "Elder",
      initials: "KA",
      color: "bg-indigo-500",
      children: [
        { id: "7", name: "Derrick Kulego", role: "Member", initials: "DK", color: "bg-teal-500", children: [] },
        { id: "8", name: "Abena Mensah", role: "Member", initials: "AM", color: "bg-rose-400", children: [] },
      ],
    },
    {
      id: "4",
      name: "Efua Lartey",
      role: "Member",
      initials: "EL",
      color: "bg-rose-400",
      children: [],
    },
  ],
};

function TreeNode({ member, depth = 0 }: { member: Member; depth?: number }) {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = member.children && member.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <div onClick={() => hasChildren && setExpanded(!expanded)} className="flex flex-col items-center cursor-pointer group">
          <div className={`w-14 h-14 rounded-full ${member.color} flex items-center justify-center text-white text-sm font-bold mb-1 ring-4 ${member.isMe ? "ring-indigo-300" : "ring-white"} ${member.deceased ? "opacity-50" : ""} group-hover:ring-indigo-200 transition shadow-md`}>
            {member.initials}
          </div>
          <p className={`text-xs font-bold text-center leading-tight max-w-20 ${member.deceased ? "text-gray-400" : "text-gray-700"}`}>
            {member.name}
          </p>
          <p className="text-xs text-gray-400 text-center">{member.role}</p>
          {member.isMe && (
            <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-lg mt-1 font-semibold">You</span>
          )}
          {member.deceased && (
            <span className="text-xs bg-gray-200 text-gray-400 px-2 py-0.5 rounded-lg mt-1">Deceased</span>
          )}
          {hasChildren && (
            <button className={`mt-1 text-xs font-bold px-2 py-0.5 rounded-lg transition ${expanded ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-500"}`}>
              {expanded ? "Hide" : `${member.children!.length} children`}
            </button>
          )}
        </div>
      </div>

      {hasChildren && expanded && (
        <div className="flex flex-col items-center mt-1">
          <div className="w-0.5 h-6 bg-indigo-300" />
          {member.children!.length > 1 && (
            <div className="h-0.5 bg-indigo-300" style={{ width: `${(member.children!.length - 1) * 120}px` }} />
          )}
          <div className="flex items-start gap-6 mt-0">
            {member.children!.map((child) => (
              <div key={child.id} className="flex flex-col items-center">
                <div className="w-0.5 h-6 bg-indigo-300" />
                <TreeNode member={child} depth={depth + 1} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FamilyTreePage() {
  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Family Tree 🌳</h2>
          <p className="text-gray-500 text-sm mt-1">Explore the Amenumey family bloodline</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/dashboard/tree/complete" className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl transition">
            Complete Tree Profile
          </a>
          <a href="/dashboard/tree/build-profile" className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">
            Build My Profile
          </a>
        </div>
      </div>

      {/* COMPLETION NUDGE */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-6 mb-8 text-white">
        <div className="flex items-center justify-between mb-2">
          <div>
            <p className="font-bold text-base">Your tree profile is incomplete 🌱</p>
            <p className="text-green-100 text-sm mt-0.5">Add your parent and children to appear correctly on the tree</p>
          </div>
          <span className="text-3xl font-black">20%</span>
        </div>
        <div className="w-full bg-white/20 rounded-full h-2 mb-4">
          <div className="bg-white rounded-full h-2 w-1/5" />
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          {[
            { label: "Profile photo", done: true },
            { label: "Parent linked", done: false },
            { label: "Children added", done: false },
            { label: "Build profile", done: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span>{item.done ? "✅" : "⬜"}</span>
              <span className={item.done ? "text-white" : "text-green-100"}>{item.label}</span>
            </div>
          ))}
        </div>
        <a href="/dashboard/tree/complete" className="inline-block bg-white text-green-600 font-bold text-sm px-5 py-2 rounded-xl hover:bg-green-50 transition">
          Complete tree profile →
        </a>
      </div>

      {/* TREE VISUALIZATION */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-800">Amenumey Family Tree</h3>
            <p className="text-xs text-gray-400 mt-0.5">Tap a node to expand or collapse children</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" /> You
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <span className="w-3 h-3 rounded-full bg-gray-400 opacity-50 inline-block" /> Deceased
            </span>
          </div>
        </div>
        <div className="overflow-x-auto overflow-y-auto pb-6">
          <div className="min-w-max mx-auto pt-4">
            <TreeNode member={familyData} depth={0} />
          </div>
        </div>
      </div>

      {/* UNCLAIMED PROFILES */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Unclaimed Tree Profiles</h3>
          <span className="text-xs text-gray-400">2 profiles waiting</span>
        </div>
        <div className="space-y-3">
          {[
            { name: "Papavi Amenumey", relation: "Patriarch (Deceased)", initials: "PA" },
            { name: "Mama Amenumey", relation: "Matriarch (Deceased)", initials: "MA" },
          ].map((p) => (
            <div key={p.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white text-sm font-bold">
                  {p.initials}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.relation}</p>
                </div>
              </div>
              <button className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 text-xs font-bold rounded-xl transition">
                Claim Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}