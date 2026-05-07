import { useState } from "react";
import {
  Bookmark,
  MessageCircle,
  ThumbsUp,
  UserRound,
  MoreHorizontal,
} from "lucide-react";
import type { Post } from "../../types/post.types";
import Button from "../ui/Button";

type PostCardProps = {
  post: Post;
};

const MAX_LENGTH = 180;

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isLong = post.content.length > MAX_LENGTH;

  const formattedDate = new Date(post.created_at).toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <header className="flex items-center justify-between border-b border-slate-100 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-50 text-cyan-600 ring-1 ring-cyan-100">
            <UserRound size={23} />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-900">
              Job Cooker User
            </p>
            <p className="text-xs text-slate-500">{formattedDate}</p>
          </div>
        </div>

        <button className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
          <MoreHorizontal size={20} />
        </button>
      </header>

      <div className="p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-medium text-cyan-700">
            {post.status}
          </span>
        </div>

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
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>{isLiked ? "1 kişi beğendi" : "Henüz beğeni yok"}</span>
          <span>0 yorum</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Button
            variant={isLiked ? "secondary" : "outline"}
            fullWidth={false}
            className="flex-1 gap-2"
            onClick={() => setIsLiked((prev) => !prev)}
          >
            <ThumbsUp size={18} />
            <span>Like</span>
          </Button>

          <Button variant="outline" fullWidth={false} className="flex-1 gap-2">
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
    </article>
  );
}
