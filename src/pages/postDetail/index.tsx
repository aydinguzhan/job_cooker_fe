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
} from "../../services/posts.service";
import type { PostComment, PostDetail } from "../../types/post.types";

export default function PostDetailCard() {
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

  useEffect(() => {
    async function fetchPostDetail() {
      if (!postId) {
        setError("Post id bulunamadi.");
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
        setError("Post detayi yuklenemedi.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPostDetail();
  }, [postId]);

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
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">Post yukleniyor...</p>
      </section>
    );
  }

  if (error || !post) {
    return (
      <section className="mx-auto max-w-3xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <Link
          to="/dashboard"
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Akisa don
        </Link>
        <p className="text-sm text-rose-600">{error || "Post bulunamadi."}</p>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 px-6 py-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-cyan-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Akisa don
        </Link>
      </div>

      <div className="border-b border-slate-100 p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
            <UserRound className="h-6 w-6 text-slate-500" />
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-950">
              {post.full_name || "Kullanici"}
            </h3>
            <p className="text-sm text-slate-500">
              {new Date(post.created_at).toLocaleString("tr-TR")}
            </p>
          </div>
        </div>

        <h1 className="mt-6 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
          {post.title}
        </h1>

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-600 md:text-base">
          {post.content}
        </p>
      </div>

      <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 px-6 py-4 text-sm text-slate-500 md:grid-cols-4">
        <span>{likeCount} likes</span>
        <span>{commentCount} comments</span>
        <span>Status: {post.status}</span>
        <span>{isLiked ? "Liked" : "Not liked"}</span>
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
          Like
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
          Comment
        </button>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Bookmark className="h-4 w-4" />
          Save
        </button>

        <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          <Share2 className="h-4 w-4" />
          Share
        </button>
      </div>

      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-5">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
              <UserRound size={18} />
            </div>

            <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-white px-4 py-2">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Yorum yaz..."
                className="flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
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
              <div className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-slate-500 ring-1 ring-slate-100">
                Henuz yorum yok.
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id ?? `${comment.user_id}-${comment.created_at}`}
                  className="flex gap-2"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
                    <UserRound size={16} />
                  </div>

                  <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-slate-100">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-xs font-semibold text-slate-800">
                        {comment.full_name || comment.user_id}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {formatDateToDayMonthYear(comment.created_at, {
                          includeTime: true,
                        })}
                      </span>
                    </div>

                    <p className="text-sm leading-6 text-slate-600">
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
