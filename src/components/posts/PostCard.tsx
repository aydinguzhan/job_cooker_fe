import { useState } from "react";
import { UserRound } from "lucide-react";
import type { Post } from "../../types/post.types";

type PostCardProps = {
  post: Post;
};

const MAX_LENGTH = 180;

export default function PostCard({ post }: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isLong = post.description.length > MAX_LENGTH;


  return (
    <article className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <header className="flex items-center gap-3 border-b border-slate-100 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
          <UserRound size={22} />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">{post.author}</p>
          <p className="text-xs text-slate-500">Posted recently</p>
        </div>
      </header>

      <div className="p-5">
        <h3 className="mb-3 text-lg font-bold text-slate-900">{post.title}</h3>

        <p
          className={`text-sm leading-6 text-slate-700 transition-all duration-300 ${
            isExpanded ? "" : "line-clamp-3"
          }`}
        >
          {post.description}
        </p>

        {isLong && (
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className="mt-2 text-sm font-medium text-slate-500 hover:text-slate-900"
          >
            {isExpanded ? "Daha az göster" : "Daha fazla"}
          </button>
        )}
      </div>
    </article>
  );
}
