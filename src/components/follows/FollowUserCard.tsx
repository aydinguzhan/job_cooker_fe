import { UserPlus, UserRound, UserRoundCheck } from "lucide-react";
import { useTranslation } from "../../lang/useTranslation";
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
  const { t } = useTranslation();
  const imageSrc = resolveFileUrl(user.profile_image_path);
  const initials = `${user.first_name[0] ?? ""}${user.last_name[0] ?? ""}`
    .toUpperCase()
    .trim();

  return (
    <article className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fcfdff_100%)] p-5 shadow-[0_16px_38px_-30px_rgba(15,23,42,0.28)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_24px_55px_-32px_rgba(15,23,42,0.32)]">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-[1.5rem] bg-slate-100 ring-1 ring-slate-200">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={`${user.first_name} ${user.last_name}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top,_#e0f2fe,_#f8fafc_65%)] text-slate-500">
                {initials ? (
                  <span className="text-lg font-semibold">{initials}</span>
                ) : (
                  <UserRound className="h-8 w-8" />
                )}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-lg font-semibold text-slate-950">
                {user.first_name} {user.last_name}
              </h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-slate-600">
                {actionVariant === "follow"
                  ? t("follows.suggestionBadge")
                  : t("follows.memberBadge")}
              </span>
            </div>
            <p className="mt-1 truncate text-sm text-slate-500">{user.email}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {user.title || t("follows.missingProfileTitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 lg:min-w-[220px] lg:justify-end">
          <div className="hidden text-right lg:block">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
              {t("common.network")}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {actionVariant === "follow"
                ? t("follows.readyForConnection")
                : t("follows.connectionActive")}
            </p>
          </div>

          <button
            type="button"
            disabled={isPending}
            onClick={() => onAction(user)}
            className={`inline-flex min-w-32 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
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
            {isPending ? t("common.pending") : actionLabel}
          </button>
        </div>
      </div>
    </article>
  );
}
