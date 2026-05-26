import { CircleChevronLeft, LogOut, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, userInfo } from "../../lib/auth";
import NotificationBell from "./Notification";

type NavbarProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen,
}: NavbarProps) {
  const navigate = useNavigate();
  const currentUser = userInfo();
  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`
    .toUpperCase()
    .trim();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100"
        >
          <CircleChevronLeft
            size={22}
            className={`transition-transform duration-300 ease-in-out ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            {initials || <UserRound size={18} />}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {fullName || "User"}
            </p>
            <p className="truncate text-xs text-slate-500">
              {currentUser?.email || "No email"}
            </p>
          </div>
        </div>
        <NotificationBell />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
}
