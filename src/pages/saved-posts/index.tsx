import { useEffect, useState } from "react";
import SavedPostsList from "../../components/posts/SavedPostsList";
import JobCookerLoader from "../../components/ui/Loader";
import { useTranslation } from "../../lang/useTranslation";
import { getSavedPosts } from "../../services/posts.service";
import type { Post } from "../../types/post.types";

export default function SavedPostsPage() {
  const { t } = useTranslation();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSavedPosts() {
      try {
        setIsLoading(true);
        const result = await getSavedPosts();
        setPosts(result);
        setError("");
      } catch (fetchError) {
        console.error("Saved posts fetch error:", fetchError);
        setError(t("savedPosts.error"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSavedPosts();
  }, [t]);

  if (isLoading) return <JobCookerLoader />;

  return (
    <section className="space-y-6">
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
        <div className="bg-[radial-gradient(circle_at_top_right,_rgba(251,191,36,0.22),_transparent_26%),radial-gradient(circle_at_left,_rgba(14,165,233,0.18),_transparent_32%),linear-gradient(135deg,#0f172a_0%,#1e293b_58%,#111827_100%)] px-6 py-8 text-white md:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-200">
            {t("savedPosts.eyebrow")}
          </p>
          <h1 className="mt-3 text-3xl font-bold md:text-4xl">
            {t("savedPosts.title")}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-200">
            {t("savedPosts.description")}
          </p>

          <div className="mt-6 inline-flex items-center rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm text-white/90 backdrop-blur">
            <span className="font-semibold text-white">
              {t("savedPosts.countLabel", { count: posts.length })}
            </span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-[2rem] border border-rose-200 bg-rose-50 px-6 py-5 text-sm text-rose-700">
          {error}
        </div>
      ) : (
        <SavedPostsList posts={posts} />
      )}
    </section>
  );
}
