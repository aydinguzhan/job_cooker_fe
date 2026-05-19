import { useState } from "react";
import {
  Bookmark,
  MessageCircle,
  ThumbsUp,
  UserRound,
  MoreHorizontal,
  Send,
} from "lucide-react";
import type { Post, PostLike } from "../../types/post.types";
import Button from "../ui/Button";
import {
  createComment,
  getAllComments,
  postLike,
} from "../../services/posts.service";

type PostCardProps = {
  post: Post;
};

type MockComment = {
  id: string;
  fullName: string;
  content: string;
  createdAt: string;
};

const MAX_LENGTH = 180;

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(post.islike);
  const [isSaved, setIsSaved] = useState(false);

  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [postCommentCount, setPostCommentCount] = useState(post.comment_count);
  const [comments, setComments] = useState<MockComment[]>([
    {
      id: "1",
      fullName: "Oğuzhan Aydın",
      content: "Güzel bir paylaşım olmuş.",
      createdAt: "Bugün",
    },
    {
      id: "2",
      fullName: "Test User",
      content: "Bu konu hakkında daha fazla detay iyi olurdu.",
      createdAt: "Dün",
    },
  ]);

  async function handleLike(payload: PostLike) {
    const result = await postLike(payload);
    setIsLiked((prev) => !prev);
    return result;
  }
  async function hadleGetComments(post_id: string,callback?:()=>void) {
    const results = await getAllComments(post_id);
    setComments(results.data);
    if(callback) callback()
  }
  async function handleAddComment() {
    if (!commentText.trim()) return;
    const newComment = await createComment({
      post_id: post.id,
      content: commentText,
    });
    hadleGetComments(post.id);

    setComments((prev) => [newComment, ...prev]);
    setPostCommentCount((prev: number) => prev + 1);
    setCommentText("");
  }

  const isLong = post.content.length > MAX_LENGTH;

  const formattedDate = new Date(post.created_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
      <header className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
            <UserRound size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {post.full_name}
            </p>
            <p className="text-xs text-slate-500">{formattedDate}</p>
          </div>
        </div>

        <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="p-5">
        <h3 className="mb-3 text-xl font-bold tracking-tight text-slate-900">
          {post.title}
        </h3>

        <p
          className={`text-sm leading-7 text-slate-600 transition-all duration-300 ${
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
            {isExpanded ? "Daha az göster" : "Daha fazla göster"}
          </button>
        )}
      </div>

      <div className="border-t border-slate-100 px-5 py-3">
        <div
          className="mb-3 flex items-center justify-between text-xs text-slate-500 hover:cursor-pointer"
          onClick={() =>
            hadleGetComments(post.id, () => {
              setShowComments((prev) => !prev);
            })
          }
        >
          <span>{isLiked ? "1 kişi beğendi" : "Henüz beğeni yok"}</span>
          <span>{postCommentCount} yorum</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isLiked ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={() =>
              handleLike({ user_id: post.user_id, post_id: post.id })
            }
          >
            <ThumbsUp size={18} />
            <span>Like</span>
          </Button>

          <Button
            variant={showComments ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={async() => {
              await hadleGetComments(post.id);
              setShowComments((prev) => !prev);
            }}
          >
            <MessageCircle size={18} />
            <span>Comment</span>
          </Button>

          <Button
            variant={isSaved ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={() => setIsSaved((prev) => !prev)}
          >
            <Bookmark size={18} />
            <span>Save</span>
          </Button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-4">
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
              <UserRound size={18} />
            </div>

            <div className="flex flex-1 items-center rounded-full border border-slate-200 bg-white px-4 py-2">
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
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
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-500 ring-1 ring-slate-200">
                  <UserRound size={16} />
                </div>

                <div className="rounded-2xl bg-white px-4 py-2 ring-1 ring-slate-100">
                  <div className="mb-1 flex items-center gap-2">
                    <p className="text-xs font-semibold text-slate-800">
                      {comment.fullName}
                    </p>
                    <span className="text-[11px] text-slate-400">
                      {comment.createdAt}
                    </span>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
