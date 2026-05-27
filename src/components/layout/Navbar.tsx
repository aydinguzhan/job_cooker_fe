import { useEffect, useState } from "react";
import { CircleChevronLeft, LogOut, Moon, Sun, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, userInfo } from "../../lib/auth";
import { useTranslation } from "../../lang/useTranslation";
import { resolveFileUrl } from "../../services/file.service";
import { getUserProfile } from "../../services/profile.service";
import { useTheme } from "../../theme/useTheme";
import type { Profile } from "../../types/profile.types";
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
  const { language, setLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const currentUser = userInfo();
  const [profile, setProfile] = useState<Profile | null>(null);
  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const initials = `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`
    .toUpperCase()
    .trim();
  const imageSrc = resolveFileUrl(profile?.profile_image_path);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const result = await getUserProfile();
        setProfile(result);
      } catch (error) {
        console.error("Navbar profile fetch error:", error);
      }
    }

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-app bg-surface px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg border border-app bg-surface-elevated p-2 text-muted transition hover:bg-surface-strong hover:text-app"
        >
          <CircleChevronLeft
            size={22}
            className={`transition-transform duration-300 ease-in-out ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <div>
          <h1 className="text-lg font-semibold text-app">
            {t("common.dashboard")}
          </h1>
          <p className="text-xs text-soft">{t("common.welcomeBack")}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-app bg-surface-elevated text-muted transition hover:bg-surface-strong hover:text-app"
        >
          {theme === "light" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>

        <div className="hidden items-center rounded-xl border border-app bg-surface-muted p-1 sm:flex">
          <button
            type="button"
            onClick={() => setLanguage("tr")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              language === "tr"
                ? "bg-surface-elevated text-app shadow-sm"
                : "text-soft hover:text-app"
            }`}
          >
            {t("language.turkish")}
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
              language === "en"
                ? "bg-surface-elevated text-app shadow-sm"
                : "text-soft hover:text-app"
            }`}
          >
            {t("language.english")}
          </button>
        </div>

        <div className="hidden items-center gap-3 rounded-2xl border border-app bg-surface-elevated px-3 py-2 sm:flex">
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-slate-900 text-sm font-semibold text-white">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt={fullName || t("common.user")}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || <UserRound size={18} />
            )}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-app">
              {fullName || t("common.user")}
            </p>
            <p className="truncate text-xs text-soft">
              {currentUser?.email || t("common.noEmail")}
            </p>
          </div>
        </div>
        <NotificationBell />

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-600"
        >
          <LogOut size={16} />
          {t("common.logout")}
        </button>
      </div>
    </header>
  );
}
