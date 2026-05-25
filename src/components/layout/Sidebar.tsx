import { NavLink } from "react-router-dom";
import { LayoutDashboard, User, Users } from "lucide-react";

type SidebarProps = {
  isOpen: boolean;
};

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: User,
  },
  {
    label: "Network",
    path: "/network",
    icon: Users,
  },
];

export default function Sidebar({ isOpen }: SidebarProps) {

  return (
    <aside
      className={`h-screen shrink-0 overflow-hidden border-r border-slate-200 bg-white px-4 py-6 transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="mb-8 flex h-8 items-center overflow-hidden px-2">
        <span className="shrink-0 text-xl font-bold text-slate-900">
          <img src="/jobcooker-icon.svg" alt="Logo"  width={40} height={40}/>
        </span>

        <span
          className={`ml-2 whitespace-nowrap text-xl font-bold text-slate-900 transition-all duration-200 ease-in-out ${
            isOpen ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
          }`}
        >
          Job Cooker
        </span>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <Icon size={20} />

              {isOpen && <span>{item.label}</span>}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
