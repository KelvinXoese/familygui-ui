"use client";
import { useEffect, useState } from "react";

export default function PostsPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Photos & Posts 📸</h2>
          <p className="text-gray-500 text-sm mt-1">Share moments, react and comment</p>
        </div>
      </div>
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
        <span className="text-3xl block mb-3">📸</span>
        <p className="text-sm font-bold text-gray-700 mb-1">Posts & photos live on your dashboard</p>
        <p className="text-sm text-gray-500 mb-4">Go to your dashboard to see and share posts with reactions, comments and replies</p>
        <a href="/dashboard" className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition">Go to Dashboard →</a>
      </div>
    </div>
  );
}
