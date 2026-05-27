import { useState } from "react";
import {
  Bookmark,
  MessageCircle,
  ThumbsUp,
  UserRound,
  MoreHorizontal,
  Send,
} from "lucide-react";
import { formatDateToDayMonthYear } from "../../lib/date";
import type { Post, PostComment } from "../../types/post.types";
import Button from "../ui/Button";
import {
  createComment,
  getAllComments,
  postLike,
  savePost,
  unsavePost,
} from "../../services/posts.service";
import { useTranslation } from "../../lang/useTranslation";
import { resolveFileUrl } from "../../services/file.service";

type PostCardProps = {
  post: Post;
  hideSaveAction?: boolean;
  isInitiallySaved?: boolean;
  onUnsaveSuccess?: (postId: string) => void;
};

const MAX_LENGTH = 180;

export default function PostCard({
  post,
  hideSaveAction = false,
  isInitiallySaved = false,
  onUnsaveSuccess,
}: PostCardProps) {
  const { language, t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.islike);
  const [isSaved, setIsSaved] = useState(isInitiallySaved);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postCommentCount, setPostCommentCount] = useState(post.comment_count);
  const [comments, setComments] = useState<PostComment[]>([]);

  async function handleLike(postId: string) {
    const result = await postLike(postId);
    setIsLiked((prev) => !prev);
    return result;
  }
  async function handleSave(postId: string) {
    if (isSaved) {
      await unsavePost(postId);
      setIsSaved(false);
      onUnsaveSuccess?.(postId);
      return;
    }

    await savePost(postId);
    setIsSaved(true);
  }

  async function handleRemoveSavedPost() {
    await unsavePost(post.id);
    setIsSaved(false);
    setIsActionMenuOpen(false);
    onUnsaveSuccess?.(post.id);
  }
  async function hadleGetComments(post_id: string, callback?: () => void) {
    const results = await getAllComments(post_id);
    setComments(results);
    setPostCommentCount(results.length);
    if (callback) callback();
  }
  async function handleAddComment() {
    if (!commentText.trim()) return;
    const newComment = await createComment({
      post_id: post.id,
      content: commentText.trim(),
    });
    setComments((prev) => [newComment, ...prev]);
    setPostCommentCount((prev: number) => prev + 1);
    setCommentText("");
  }

  const isLong = post.content.length > MAX_LENGTH;
  const imageSrc = resolveFileUrl(post.profile_image_path);
  const formattedDate = new Date(post.created_at).toLocaleDateString(
    language === "tr" ? "tr-TR" : "en-US",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <article className="overflow-hidden rounded-3xl border border-app bg-surface shadow-surface">
      <header className="flex items-center justify-between border-b border-app p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={post.full_name}
                className="h-full w-full object-cover"
              />
            ) : (
              <UserRound size={23} />
            )}
          </div>

          <div>
            <p className="text-sm font-semibold text-app">
              {post.full_name}
            </p>
            <p className="text-xs text-soft">{formattedDate}</p>
          </div>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setIsActionMenuOpen((prev) => !prev)}
            className="rounded-full p-2 text-soft transition hover:bg-surface-strong hover:text-app"
          >
            <MoreHorizontal size={20} />
          </button>

          {hideSaveAction && isActionMenuOpen ? (
            <div className="absolute right-0 top-12 z-10 min-w-44 rounded-2xl border border-app bg-surface-elevated p-2 shadow-surface">
              <button
                type="button"
                onClick={handleRemoveSavedPost}
                className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 transition hover:bg-rose-50"
              >
                {t("savedPosts.remove")}
              </button>
            </div>
          ) : null}
        </div>
      </header>

      <div className="p-5">
        <h3 className="mb-3 text-xl font-bold tracking-tight text-app">
          {post.title}
        </h3>

        <p
          className={`text-sm leading-7 text-muted transition-all duration-300 ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {post.content}
        </p>

        {isLong && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-3 text-sm font-semibold text-cyan-600 transition hover:text-cyan-700"
          >
            {isExpanded ? t("postCard.showLess") : t("postCard.showMore")}
          </button>
        )}
      </div>

      <div className="border-t border-app px-5 py-3">
        <div
          className="mb-3 flex items-center justify-between text-xs text-soft hover:cursor-pointer"
          onClick={() =>
            hadleGetComments(post.id, () => {
              setShowComments((prev) => !prev);
            })
          }
        >
          <span>{isLiked ? t("postCard.oneLike") : t("postCard.noLikes")}</span>
          <span>{t("postCard.commentsCount", { count: postCommentCount })}</span>
        </div>

        <div
          className={`grid gap-2 ${
            hideSaveAction ? "grid-cols-2" : "grid-cols-3"
          }`}
        >
          <Button
            variant={isLiked ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={() => handleLike(post.id)}
          >
            <ThumbsUp size={18} />
            <span>{t("common.like")}</span>
          </Button>

          <Button
            variant={showComments ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={async () => {
              await hadleGetComments(post.id);
              setShowComments((prev) => !prev);
            }}
          >
            <MessageCircle size={18} />
            <span>{t("common.comment")}</span>
          </Button>

          {!hideSaveAction ? (
            <Button
              variant={isSaved ? "secondary" : "outline"}
              fullWidth={false}
              className="flex-1 gap-2"
              onClick={() => handleSave(post.id)}
            >
              <Bookmark size={18} />
              <span>{t("common.save")}</span>
            </Button>
          ) : null}
        </div>
      </div>

      {showComments && (
        <div className="border-t border-app bg-surface-muted px-5 py-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-elevated text-soft ring-1 ring-[var(--border-color)]">
              <UserRound size={18} />
            </div>

            <div className="flex flex-1 items-center rounded-full border border-app bg-surface-elevated px-4 py-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
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
              <div className="rounded-2xl bg-white px-4 py-5 text-center text-sm text-slate-500 ring-1 ring-slate-100">
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

                  <div className="rounded-2xl bg-surface-elevated px-4 py-2 ring-1 ring-[var(--border-color)]">
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
