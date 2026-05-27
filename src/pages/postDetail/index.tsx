import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  Heart,
  MessageCircle,
  Send,
  Share2,
  UserRound,
} from "lucide-react";
import { formatDateToDayMonthYear } from "../../lib/date";
import {
  createComment,
  getAllComments,
  getPostDetail,
  postLike,
  savePost,
  unsavePost,
} from "../../services/posts.service";
import { useTranslation } from "../../lang/useTranslation";
import { resolveFileUrl } from "../../services/file.service";
import type { PostComment, PostDetail } from "../../types/post.types";

export default function PostDetailCard() {
  const { language, t } = useTranslation();
  const { postId } = useParams();
  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<PostComment[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    async function fetchPostDetail() {
      if (!postId) {
        setError(t("postDetail.missingId"));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const result = await getPostDetail(postId);
        setPost(result);
        setIsLiked(Boolean(result.is_liked));
        setCommentCount(result.comment_count ?? 0);
        setLikeCount(result.like_count ?? 0);
        setError("");
      } catch (fetchError) {
        console.error(fetchError);
        setError(t("postDetail.loadError"));
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostDetail();
  }, [postId, t]);

  async function handleLike() {
    if (!post) return;

    await postLike(post.id);
    const nextValue = !isLiked;
    setIsLiked(nextValue);
    setLikeCount((current) => {
      if (nextValue) return current + 1;
      return Math.max(0, current - 1);
    });
  }

  async function handleSave() {
    if (!post) return;

    if (isSaved) {
      await unsavePost(post.id);
      setIsSaved(false);
      return;
    }

    await savePost(post.id);
    setIsSaved(true);
  }

  async function handleGetComments(callback?: () => void) {
    if (!post) return;

    const results = await getAllComments(post.id);
    setComments(results);
    if (callback) callback();
  }

  async function handleAddComment() {
    if (!post || !commentText.trim()) return;

    const newComment = await createComment({
      post_id: post.id,
      content: commentText.trim(),
    });

    setComments((prev) => [newComment, ...prev]);
    setCommentCount((prev) => prev + 1);
    setCommentText("");
    setShowComments(true);
  }

  if (isLoading) {
    return (
      <section className="mx-auto max-w-3xl rounded-[4xl] border border-app bg-surface p-6 shadow-surface">
        <p className="text-sm text-soft">{t("postDetail.loading")}</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="mx-auto max-w-3xl rounded-[4xl] border border-app bg-surface p-6 shadow-surface">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.backToFeed")}
        </Link>
        <p className="text-sm text-rose-600">{error || t("postDetail.notFound")}</p>
      </section>
    );
  }

  const imageSrc = resolveFileUrl(post.profile_image_path);

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-app bg-surface shadow-surface">
      <div className="border-b border-app px-6 py-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("common.backToFeed")}
        </Link>
      </div>

      <div className="border-b border-app p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-100">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={post.full_name || t("common.user")}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound className="h-6 w-6 text-slate-500" />
            )}
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-app">
              {post.full_name || t("common.user")}
            </h3>
            <p className="text-sm text-soft">
              {new Date(post.created_at).toLocaleString(
                language === "tr" ? "tr-TR" : "en-US"
              )}
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-tight text-app md:text-3xl">
          {post.title}
        </h1>

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted md:text-base">
          {post.content}
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-app bg-surface-muted px-6 py-4 text-sm text-soft md:grid-cols-4">
        <span>{t("postDetail.likes", { count: likeCount })}</span>
        <span>{t("postDetail.comments", { count: commentCount })}</span>
        <span>{t("common.status")}: {post.status}</span>
        <span>{isLiked ? t("postDetail.liked") : t("postDetail.notLiked")}</span>
      </div>

      <div className="flex flex-wrap gap-3 p-5">
        <button
          type="button"
          onClick={handleLike}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-semibold transition ${
            isLiked
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? "fill-white" : ""}`} />
          {t("common.like")}
        </button>

        <button
          type="button"
          onClick={async () => {
            if (showComments) {
              setShowComments(false);
              return;
            }

            await handleGetComments(() => {
              setShowComments(true);
            });
          }}
          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
            showComments
              ? "border-cyan-200 bg-cyan-50 text-cyan-700"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <MessageCircle className="h-4 w-4" />
          {t("common.comment")}
        </button>

        <button
          type="button"
          onClick={handleSave}
          className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm font-semibold transition ${
            isSaved
              ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
              : "border-slate-200 text-slate-700 hover:bg-slate-50"
          }`}
        >
          <Bookmark className="h-4 w-4" />
          {t("common.save")}
        </button>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Share2 className="h-4 w-4" />
          {t("common.share")}
        </button>
      </div>

      {showComments && (
        <div className="border-t border-app bg-surface-muted px-6 py-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-soft ring-1 ring-[var(--border-color)]">
              <UserRound size={18} />
            </div>

            <div className="flex flex-1 items-center rounded-full border border-app bg-surface-elevated px-4 py-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={t("postCard.commentPlaceholder")}
                className="flex-1 bg-transparent text-sm text-app outline-none placeholder:text-soft"
              />

              <button
                type="button"
                onClick={handleAddComment}
                disabled={!commentText.trim()}
                className="ml-2 rounded-full p-1.5 text-cyan-600 transition hover:bg-cyan-50 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                <Send size={16} />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="rounded-2xl bg-surface-elevated px-4 py-5 text-center text-sm text-soft ring-1 ring-[var(--border-color)]">
                {t("postCard.noComments")}
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id ?? `${comment.user_id}-${comment.created_at}`}
                  className="flex gap-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-elevated text-soft ring-1 ring-[var(--border-color)]">
                    {resolveFileUrl(comment.profile_image_path) ? (
                      <img
                        src={resolveFileUrl(comment.profile_image_path)}
                        alt={comment.full_name || comment.user_id}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <UserRound size={16} />
                    )}
                  </div>

                  <div className="rounded-2xl bg-surface-elevated px-4 py-3 ring-1 ring-[var(--border-color)]">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-xs font-semibold text-app">
                        {comment.full_name || comment.user_id}
                      </p>
                      <span className="text-[11px] text-soft">
                        {formatDateToDayMonthYear(comment.created_at, {
                          includeTime: true,
                        })}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-muted">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}
