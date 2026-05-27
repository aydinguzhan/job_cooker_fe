import { useTranslation } from "../../lang/useTranslation";
import type { FollowTab } from "../../types/follow.types";

type Props = {
  activeTab: FollowTab;
  counts: Record<FollowTab, number>;
  onChange: (tab: FollowTab) => void;
};

export default function FollowsTabs({ activeTab, counts, onChange }: Props) {
  const { t } = useTranslation();
  const tabs = [
    {
      id: "suggestions" as const,
      label: t("follows.suggestions"),
      description: t("follows.suggestionsDescription"),
      eyebrow: t("follows.discover"),
    },
    {
      id: "followers" as const,
      label: t("follows.followers"),
      description: t("follows.followersDescription"),
      eyebrow: t("follows.audience"),
    },
    {
      id: "followings" as const,
      label: t("follows.following"),
      description: t("follows.followingDescription"),
      eyebrow: t("follows.connections"),
    },
  ];

  return (
    <div className="grid gap-3 lg:grid-cols-3">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`group relative overflow-hidden rounded-[1.75rem] border px-5 py-5 text-left transition duration-200 ${
              isActive
                ? "border-cyan-200 bg-[linear-gradient(135deg,#ecfeff_0%,#ffffff_55%,#f8fafc_100%)] text-slate-900 shadow-[0_20px_45px_-28px_rgba(8,145,178,0.45)]"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <div
              className={`absolute inset-x-0 top-0 h-1 transition ${
                isActive ? "bg-cyan-500" : "bg-transparent group-hover:bg-slate-200"
              }`}
            />

            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    isActive ? "text-cyan-700" : "text-slate-400"
                  }`}
                >
                  {tab.eyebrow}
                </p>
                <p className="mt-2 text-base font-semibold">{tab.label}</p>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    isActive ? "text-slate-600" : "text-slate-500"
                  }`}
                >
                  {tab.description}
                </p>
              </div>

              <span
                className={`inline-flex min-w-10 items-center justify-center rounded-full px-3 py-1 text-sm font-semibold ${
                  isActive
                    ? "bg-cyan-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {counts[tab.id]}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
