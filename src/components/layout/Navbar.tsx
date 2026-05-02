import { CircleChevronLeft, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../lib/auth";

type NavbarProps = {
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
};

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen,
}: NavbarProps) {
  const navigate = useNavigate();

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
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
}
