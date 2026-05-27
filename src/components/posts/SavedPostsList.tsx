import { useState } from "react";
import { useTranslation } from "../../lang/useTranslation";
import PostCard from "./PostCard";
import type { Post } from "../../types/post.types";

type Props = {
  posts: Post[];
};

export default function SavedPostsList({ posts }: Props) {
  const { t } = useTranslation();
  const [savedPosts, setSavedPosts] = useState(posts);

  function handleUnsaveSuccess(postId: string) {
    setSavedPosts((current) => current.filter((post) => post.id !== postId));
  }

  if (savedPosts.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-slate-300 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] px-6 py-14 text-center shadow-sm">
        <p className="text-base font-semibold text-slate-800">
          {t("savedPosts.emptyTitle")}
        </p>
        <p className="mt-2 text-sm text-slate-500">
          {t("savedPosts.emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {savedPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          hideSaveAction
          isInitiallySaved
          onUnsaveSuccess={handleUnsaveSuccess}
        />
      ))}
    </div>
  );
}
