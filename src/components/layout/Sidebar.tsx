import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, Users ,LandPlot} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "../../lang/useTranslation";
import { getNavigation } from "../../services/navigation.service";

type SidebarProps = {
  isOpen: boolean;
};
type NavigationItem = {
  id: string;
  label: string;
  icon: keyof typeof iconMap;
  path: string;
};
const iconMap = {
  LayoutDashboard,
  User,
  Users,
  LandPlot
};
export default function Sidebar({ isOpen }: SidebarProps) {
  const { t } = useTranslation();
  const [navigationItems, setNavigationsItems] = useState<NavigationItem[]>([]);

  function translateLabel(label: string) {
    const normalizedLabel = label.trim().toLowerCase();

    if (normalizedLabel.includes("dashboard")) return t("common.dashboard");
    if (normalizedLabel.includes("profile")) return t("common.profile");
    if (normalizedLabel.includes("network")) return t("common.network");
    if (normalizedLabel.includes("save")) return t("savedPosts.eyebrow");

    return label;
  }

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getNavigation();
      setNavigationsItems(data);
    };
    fetchData();
  }, []);

  return (
    <aside
      className={`h-screen shrink-0 overflow-hidden border-r border-app bg-surface px-4 py-6 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="mb-8 flex h-8 items-center overflow-hidden px-2">
        <span className="shrink-0 text-xl font-bold text-app">
          <img src="/jobcooker-icon.svg" alt="Logo" width={40} height={40} />
        </span>

        <span
          className={`ml-2 whitespace-nowrap text-xl font-bold text-app transition-all duration-200 ease-in-out ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Job Cooker
        </span>
      </div>

      <nav className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = iconMap[item.icon] ?? LayoutDashboard;
          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-muted hover:bg-surface-strong hover:text-app"
                }`
              }
            >
              <Icon size={20} />

              {isOpen && <span>{translateLabel(item.label)}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
