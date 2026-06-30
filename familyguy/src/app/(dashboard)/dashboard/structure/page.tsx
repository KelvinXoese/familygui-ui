"use client";
import { useState, useEffect } from "react";

type Node = { id: string; title: string; description?: string; parentId?: string; children?: Node[] };

export default function StructurePage() {
  const [groupType, setGroupType] = useState("GROUP");
  const [nodes, setNodes] = useState<Node[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", parentId: "" });

  useEffect(() => {
    const type = localStorage.getItem("active_group_type") || "GROUP";
    setGroupType(type);
  }, []);

  const title = groupType === "ORGANIZATION" ? "Org Structure 🏗️" : "Group Structure 🏗️";
  const desc = groupType === "ORGANIZATION" ? "Your organization's hierarchy and departments" : "Your group's roles and structure";

  const buildTree = (items: Node[], parentId?: string): Node[] =>
    items.filter((n) => n.parentId === (parentId || undefined)).map((n) => ({ ...n, children: buildTree(items, n.id) }));

  const tree = buildTree(nodes);

  const NodeCard = ({ node, depth = 0 }: { node: Node; depth?: number }) => (
    <div className={`${depth > 0 ? "ml-8 mt-2" : "mt-3"}`}>
      <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${depth === 0 ? "bg-indigo-600" : depth === 1 ? "bg-purple-500" : "bg-gray-400"}`}>
          {depth === 0 ? "▲" : depth === 1 ? "●" : "○"}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800">{node.title}</p>
          {node.description && <p className="text-xs text-gray-500 mt-0.5">{node.description}</p>}
        </div>
      </div>
      {node.children && node.children.map((child) => <NodeCard key={child.id} node={child} depth={depth + 1} />)}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div><h2 className="text-2xl font-bold text-gray-800">{title}</h2><p className="text-gray-500 text-sm mt-1">{desc}</p></div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition">+ Add Node</button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <div className="space-y-4">
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} placeholder={groupType === "ORGANIZATION" ? "e.g. Finance Department" : "e.g. Welfare Committee"} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            <input value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} placeholder="Description (optional)" className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition" />
            {nodes.length > 0 && (
              <select value={form.parentId} onChange={(e) => setForm({...form, parentId: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-indigo-500 transition">
                <option value="">Top level (no parent)</option>
                {nodes.map((n) => <option key={n.id} value={n.id}>{n.title}</option>)}
              </select>
            )}
            <div className="flex gap-3">
              <button onClick={() => {
                if (!form.title) return;
                const newNode: Node = { id: Date.now().toString(), title: form.title, description: form.description, parentId: form.parentId || undefined };
                setNodes([...nodes, newNode]);
                setForm({ title: "", description: "", parentId: "" });
                setShowForm(false);
              }} className="px-6 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">Add</button>
              <button onClick={() => setShowForm(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 text-sm font-semibold rounded-xl hover:bg-gray-200 transition">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {nodes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">🏗️</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No structure defined yet</h3>
          <p className="text-sm text-gray-400 mb-4">
            {groupType === "ORGANIZATION" ? "Build your org chart — add departments, teams and roles" : "Add roles, committees and positions to visualize your group structure"}
          </p>
          <button onClick={() => setShowForm(true)} className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">+ Add First Node</button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          {tree.map((node) => <NodeCard key={node.id} node={node} />)}
        </div>
      )}
    </div>
  );
}
