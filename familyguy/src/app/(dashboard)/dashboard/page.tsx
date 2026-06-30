"use client";
import { useEffect, useState } from "react";

type User = { firstName: string; lastName: string };
type Group = { name: string; type: string; memberCount: number; inviteCode: string; myRole: string };
type Post = {
  id: string; caption?: string; imageUrl?: string; createdAt: string; myReaction: string | null;
  author: { firstName: string; lastName: string; avatarUrl?: string };
  _count: { reactions: number; comments: number };
  comments: { id: string; body: string; author: { firstName: string; lastName: string }; replies: { id: string; body: string; author: { firstName: string; lastName: string } }[] }[];
};

const reactions = ["LIKE", "LOVE", "HAHA", "WOW", "SAD"];
const reactionEmoji: Record<string, string> = { LIKE: "👍", LOVE: "❤️", HAHA: "😂", WOW: "😮", SAD: "😢" };

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState("");
  const [posting, setPosting] = useState(false);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<Record<string, string>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [openReplies, setOpenReplies] = useState<string | null>(null);

  const groupId = typeof window !== "undefined" ? localStorage.getItem("active_group_id") : null;

  const fetchPosts = () => {
    if (!groupId) return;
    fetch(`/api/groups/posts?groupId=${groupId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (d.success) setPosts(d.data.posts); });
  };

  useEffect(() => {
    if (!groupId) { setLoading(false); return; }
    Promise.all([
      fetch("/api/auth/me", { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/groups/active?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()),
      fetch(`/api/groups/posts?groupId=${groupId}`, { credentials: "include" }).then((r) => r.json()),
    ]).then(([userData, groupData, postsData]) => {
      if (userData?.success) setUser(userData.data.user);
      if (groupData?.success) setGroup(groupData.data.group);
      if (postsData?.success) setPosts(postsData.data.posts);
    }).finally(() => setLoading(false));
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || !groupId) return;
    setPosting(true);
    await fetch("/api/groups/posts", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId, caption: newPost }),
    });
    setNewPost("");
    fetchPosts();
    setPosting(false);
  };

  const handleReact = async (postId: string, type: string) => {
    setShowReactions(null);
    await fetch("/api/groups/posts/react", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, type }),
    });
    fetchPosts();
  };

  const handleComment = async (postId: string) => {
    const body = commentText[postId]?.trim();
    if (!body) return;
    await fetch("/api/groups/posts/comment", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body }),
    });
    setCommentText((prev) => ({ ...prev, [postId]: "" }));
    fetchPosts();
  };

  const handleReply = async (postId: string, commentId: string) => {
    const body = replyText[commentId]?.trim();
    if (!body) return;
    await fetch("/api/groups/posts/comment", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ postId, body, parentCommentId: commentId }),
    });
    setReplyText((prev) => ({ ...prev, [commentId]: "" }));
    setOpenReplies(null);
    fetchPosts();
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Welcome */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {user?.firstName ?? "..."} 👋</h2>
        <p className="text-gray-500 text-sm mt-1">{group ? `Here's what's happening in ${group.name}` : "Select a group to get started"}</p>
      </div>

      {/* Stats */}
      {group && (
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Members", value: group.memberCount, href: "/dashboard/members" },
            { label: "Posts", value: posts.length, href: "/dashboard/posts" },
            { label: "Your role", value: group.myRole.replace(/_/g, " "), href: "/dashboard/members" },
          ].map((s) => (
            <a key={s.label} href={s.href} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition text-center">
              <p className="text-lg font-black text-indigo-600">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </a>
          ))}
        </div>
      )}

      {/* Invite banner */}
      {group && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-gray-800">Invite code</p>
            <p className="font-mono font-black text-xl text-indigo-600 tracking-widest">{group.inviteCode}</p>
          </div>
          <button onClick={() => navigator.clipboard?.writeText(group.inviteCode)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">
            Copy
          </button>
        </div>
      )}

      {/* Post composer */}
      {group && (
        <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : ".."}
            </div>
            <div className="flex-1">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder={`Share something with ${group.name}...`}
                rows={2}
                className="w-full text-sm text-gray-700 placeholder-gray-400 outline-none resize-none border-0 p-0"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-indigo-600 transition font-semibold px-3 py-1.5 rounded-lg hover:bg-indigo-50">
                    📷 Photo
                  </button>
                </div>
                <button onClick={handlePost} disabled={!newPost.trim() || posting}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition">
                  {posting ? "Posting..." : "Post"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Posts feed */}
      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
          <span className="text-4xl block mb-4">📸</span>
          <h3 className="text-lg font-bold text-gray-700 mb-2">No posts yet</h3>
          <p className="text-sm text-gray-400">Be the first to share something with the group</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
              {/* Post header */}
              <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {post.author.firstName[0]}{post.author.lastName[0]}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{post.author.firstName} {post.author.lastName}</p>
                  <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                </div>
              </div>

              {/* Caption */}
              {post.caption && <p className="px-5 pb-3 text-sm text-gray-700 leading-relaxed">{post.caption}</p>}

              {/* Image */}
              {post.imageUrl && (
                <div className="px-5 pb-3">
                  <img src={post.imageUrl} alt="Post" className="w-full rounded-2xl object-cover max-h-80" />
                </div>
              )}

              {/* Reaction count */}
              {(post._count.reactions > 0 || post._count.comments > 0) && (
                <div className="flex items-center justify-between px-5 py-2 border-t border-gray-50">
                  <p className="text-xs text-gray-400">{post._count.reactions > 0 ? `${post._count.reactions} reaction${post._count.reactions !== 1 ? "s" : ""}` : ""}</p>
                  <button onClick={() => setOpenComments(openComments === post.id ? null : post.id)} className="text-xs text-gray-400 hover:text-indigo-600 transition">
                    {post._count.comments > 0 ? `${post._count.comments} comment${post._count.comments !== 1 ? "s" : ""}` : ""}
                  </button>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center border-t border-gray-50 relative">
                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowReactions(showReactions === post.id ? null : post.id)}
                    className={`w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold transition hover:bg-gray-50 ${post.myReaction ? "text-indigo-600" : "text-gray-500"}`}
                  >
                    {post.myReaction ? reactionEmoji[post.myReaction] : "👍"} {post.myReaction ? post.myReaction.charAt(0) + post.myReaction.slice(1).toLowerCase() : "Like"}
                  </button>
                  {showReactions === post.id && (
                    <div className="absolute bottom-full left-0 mb-2 flex gap-1 bg-white rounded-2xl shadow-lg border border-gray-100 p-2 z-10">
                      {reactions.map((r) => (
                        <button key={r} onClick={() => handleReact(post.id, r)} className="text-xl hover:scale-125 transition-transform p-1" title={r}>
                          {reactionEmoji[r]}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="w-px h-6 bg-gray-100" />
                <button
                  onClick={() => setOpenComments(openComments === post.id ? null : post.id)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-indigo-600 transition"
                >
                  💬 Comment
                </button>
              </div>

              {/* Comments section */}
              {openComments === post.id && (
                <div className="border-t border-gray-50 px-5 pb-4 pt-3 space-y-3">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="space-y-2">
                      <div className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 flex-shrink-0">
                          {comment.author.firstName[0]}
                        </div>
                        <div className="flex-1 bg-gray-50 rounded-xl px-3 py-2">
                          <p className="text-xs font-bold text-gray-700">{comment.author.firstName} {comment.author.lastName}</p>
                          <p className="text-sm text-gray-600">{comment.body}</p>
                        </div>
                      </div>
                      <div className="ml-9 flex items-center gap-3">
                        <button onClick={() => setOpenReplies(openReplies === comment.id ? null : comment.id)} className="text-xs text-gray-400 hover:text-indigo-600 font-semibold transition">
                          {comment.replies.length > 0 ? `${comment.replies.length} repl${comment.replies.length !== 1 ? "ies" : "y"}` : "Reply"}
                        </button>
                      </div>
                      {openReplies === comment.id && (
                        <div className="ml-9 space-y-2">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="flex items-start gap-2">
                              <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                                {reply.author.firstName[0]}
                              </div>
                              <div className="flex-1 bg-indigo-50 rounded-xl px-3 py-2">
                                <p className="text-xs font-bold text-gray-700">{reply.author.firstName}</p>
                                <p className="text-sm text-gray-600">{reply.body}</p>
                              </div>
                            </div>
                          ))}
                          <div className="flex items-center gap-2 mt-1">
                            <input value={replyText[comment.id] || ""} onChange={(e) => setReplyText((p) => ({ ...p, [comment.id]: e.target.value }))}
                              placeholder="Write a reply..." className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 transition" />
                            <button onClick={() => handleReply(post.id, comment.id)} className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">↑</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="flex items-center gap-2 mt-2">
                    <input value={commentText[post.id] || ""} onChange={(e) => setCommentText((p) => ({ ...p, [post.id]: e.target.value }))}
                      onKeyDown={(e) => e.key === "Enter" && handleComment(post.id)}
                      placeholder="Write a comment..." className="flex-1 text-sm bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 outline-none focus:border-indigo-400 transition" />
                    <button onClick={() => handleComment(post.id)} className="px-3 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">↑</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
