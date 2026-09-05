import { useEffect, useState } from "react";
import { Send } from "lucide-react";

import PostCard from "../../components/posts/PostCard";
import DashboardPageSkeleton from "../../components/spinner/DashboardPageSkeleton";

import { useTranslation } from "../../lang/useTranslation";
import type { Post } from "../../types/post.types";

import { getDashboardFeed, postCreate } from "../../services/posts.service";

export default function DashBoard() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const data = await getDashboardFeed();
      setPosts(data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
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

  if (isLoading) {
    return <DashboardPageSkeleton />;
  }

  return (
    <section className="mx-auto max-w-3xl space-y-6 ">
      <div className="bg-surface p-4 rounded-xl">
        <h2 className="text-lg font-semibold text-app">
          {t("dashboardPage.feedTitle")}
        </h2>
      </div>
      <div className="rounded-xl border border-app bg-surface p-5 shadow-surface">
        <div className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("dashboardPage.titlePlaceholder")}
            className="
              w-full rounded-xl border border-app
              bg-surface-muted px-4 py-3
              text-sm font-medium text-app
              outline-none transition
              placeholder:text-soft
              focus:border-strong focus:bg-surface-elevated
            "
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t("dashboardPage.contentPlaceholder")}
            rows={4}
            className="
              w-full resize-none rounded-xl
              border border-app
              bg-surface-muted px-4 py-3
              text-sm text-app
              outline-none transition
              placeholder:text-soft
              focus:border-strong focus:bg-surface-elevated
            "
          />
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-soft">{content.length}/500</span>

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
            {t("dashboardPage.share")}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div
            className="
              rounded-3xl border border-dashed
              border-app bg-surface p-10
              text-center
            "
          >
            <h3 className="text-sm font-medium text-muted">
              {t("dashboardPage.noPostsTitle")}
            </h3>

            <p className="mt-1 text-sm text-soft">
              {t("dashboardPage.noPostsDescription")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
