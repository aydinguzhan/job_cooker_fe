import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import PostCard from "../../components/posts/PostCard";

import type { Post } from "../../types/post.types";

import {
  getDashboardFeed,
  postCreate,
} from "../../services/posts.service";

export default function DashBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    try {
      const data = await getDashboardFeed();
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchPosts();
  }, []);

  const createNewPost = async () => {
    try {
      if (!title.trim() || !content.trim()) return;

      await postCreate({
        title: title.trim(),
        content: content.trim(),
      });

      setTitle("");
      setContent("");

      await fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const isDisabled = !title.trim() || !content.trim();

  return (
    <section className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="
              w-full rounded-2xl border border-slate-100
              bg-slate-50/60 px-4 py-3
              text-sm font-medium text-slate-800
              outline-none transition
              placeholder:text-slate-400
              focus:border-slate-200 focus:bg-white
            "
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What do you want to share?"
            rows={4}
            className="
              w-full resize-none rounded-2xl
              border border-slate-100
              bg-slate-50/60 px-4 py-3
              text-sm text-slate-700
              outline-none transition
              placeholder:text-slate-400
              focus:border-slate-200 focus:bg-white
            "
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {content.length}/500
          </span>

          <button
            type="button"
            onClick={createNewPost}
            disabled={isDisabled}
            className="
              inline-flex items-center gap-2
              rounded-full bg-slate-900
              px-5 py-2.5
              text-sm font-medium text-white
              transition
              hover:bg-slate-800
              disabled:cursor-not-allowed
              disabled:bg-slate-200
              disabled:text-slate-400
            "
          >
            <Send size={16} />
            Share
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Your Feed
          </h2>

          <p className="text-sm text-slate-500">
            Kendi paylaşımların ve takip ettiğin kişilerin akışı
          </p>
        </div>

        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <div
            className="
              rounded-3xl border border-dashed
              border-slate-200 bg-white p-10
              text-center
            "
          >
            <h3 className="text-sm font-medium text-slate-600">
              No posts yet
            </h3>

            <p className="mt-1 text-sm text-slate-400">
              Be the first one to share something.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
