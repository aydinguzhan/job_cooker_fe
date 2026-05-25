import { UserPlus, UserRound, UserRoundCheck } from "lucide-react";
import { resolveFileUrl } from "../../services/file.service";
import type { FollowUser } from "../../types/follow.types";

type Props = {
  user: FollowUser;
  actionLabel: string;
  actionVariant: "follow" | "unfollow";
  isPending: boolean;
  onAction: (user: FollowUser) => void;
};

export default function FollowUserCard({
  user,
  actionLabel,
  actionVariant,
  isPending,
  onAction,
}: Props) {
  const imageSrc = resolveFileUrl(user.profile_image_path);

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-[1.5rem] bg-slate-100">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${user.first_name} ${user.last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-400">
                <UserRound className="h-8 w-8" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-slate-950">
              {user.first_name} {user.last_name}
            </h2>
            <p className="truncate text-sm text-slate-500">{user.email}</p>
            <p className="mt-1 text-sm text-slate-600">
              {user.title || "Henüz profil başlığı eklenmemiş"}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={() => onAction(user)}
          className={`inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            actionVariant === "follow"
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
          }`}
        >
          {actionVariant === "follow" ? (
            <UserPlus className="h-4 w-4" />
          ) : (
            <UserRoundCheck className="h-4 w-4" />
          )}
          {actionLabel}
        </button>
      </div>
    </article>
  );
}
