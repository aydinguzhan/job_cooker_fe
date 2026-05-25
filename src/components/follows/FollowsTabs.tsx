import type { FollowTab } from "../../types/follow.types";

type Props = {
  activeTab: FollowTab;
  onChange: (tab: FollowTab) => void;
};

const tabs: { id: FollowTab; label: string; description: string }[] = [
  {
    id: "suggestions",
    label: "Suggestions",
    description: "Takip edebileceğin yeni kişiler",
  },
  {
    id: "followers",
    label: "Followers",
    description: "Seni takip eden kullanıcılar",
  },
  {
    id: "followings",
    label: "Following",
    description: "Takip ettiğin kullanıcılar",
  },
];

export default function FollowsTabs({ activeTab, onChange }: Props) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={`rounded-[1.75rem] border px-5 py-4 text-left transition ${
              isActive
                ? "border-slate-900 bg-slate-900 text-white shadow-lg"
                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <p className="text-sm font-semibold">{tab.label}</p>
            <p
              className={`mt-1 text-sm ${
                isActive ? "text-slate-300" : "text-slate-500"
              }`}
            >
              {tab.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
