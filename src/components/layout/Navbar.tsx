import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  CircleChevronLeft,
  LogOut,
  Moon,
  QrCodeIcon,
  Sun,
  UserRound,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout, userInfo } from "../../lib/auth";
import { useTranslation } from "../../lang/useTranslation";
import { resolveFileUrl } from "../../services/file.service";
import { getUserProfile } from "../../services/profile.service";
import { useTheme } from "../../theme/useTheme";
import type { Profile } from "../../types/profile.types";
import NotificationBell from "./Notification";
import Button from "../ui/Button";
import SearchInput from "../ui/SearchInput";
import { getUserFilter } from "../../services/global.service";

type NavbarProps = {
  onToggleSidebar: () => void;
  toggleQr: () => void;
  isSidebarOpen: boolean;
};

type IUserFilter = {
  id: string;
  first_name: string;
  last_name: string;
};

export default function Navbar({
  onToggleSidebar,
  isSidebarOpen,
  toggleQr,
}: NavbarProps) {
  const navigate = useNavigate();
  const { language, setLanguage, t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const currentUser = userInfo();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const fullName = [currentUser?.firstName, currentUser?.lastName]
    .filter(Boolean)
    .join(" ")
    .trim();
  const initials =
    `${currentUser?.firstName?.[0] ?? ""}${currentUser?.lastName?.[0] ?? ""}`
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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // const [selectUser, setSelectUser] = useState("");
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchKey(value);

    if (!value.trim()) {
      setSearchResults([]);
    }
  };
  useEffect(() => {
    // Arama kelimesi boşsa veya sadece boşluktan oluşuyorsa API isteği atmıyoruz
    if (!searchKey.trim()) return;

    const timer = setTimeout(async () => {
      try {
        const res = await getUserFilter(searchKey);
        console.log(res);
        setSearchResults(res);
      } catch (error) {
        console.error("Arama servisinde hata oluştu:", error);
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchKey]);
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
      <div className="">
        <SearchInput<IUserFilter>
          placeholder="Search User..."
          value={searchKey}
          onChange={handleSearchChange}
          searchResult={searchResults}
          getItemKey={(job) => job.id}
          onItemSelect={() => {
            // setSelectUser(user.id);
            setSearchKey("");
            setSearchResults([]);
          }}
          renderItem={(user) => (
            <div className="flex flex-col w-full">
              <span className="font-semibold text-app">{user.first_name}</span>
              <span className="text-xs text-muted">{user.last_name}</span>
            </div>
          )}
        />
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

        <NotificationBell />

        <div className="relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen((prev) => !prev)}
            className="flex items-center gap-1.5 rounded-full px-1 py-1 text-left transition hover:bg-surface-strong/70"
          >
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-xs font-semibold text-white">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  alt={fullName || t("common.user")}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials || <UserRound size={15} />
              )}
            </div>

            <ChevronDown
              className={`h-3.5 w-3.5 text-soft transition ${
                isUserMenuOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isUserMenuOpen ? (
            <div className="absolute right-0 top-[calc(100%+0.75rem)] z-20 min-w-72 rounded-[1.5rem] border border-app bg-surface p-3 shadow-surface backdrop-blur-xl">
              <div className="flex items-center gap-3 rounded-2xl bg-surface-muted px-3 py-3">
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-900 text-sm font-semibold text-white">
                  {imageSrc ? (
                    <img
                      src={imageSrc}
                      alt={fullName || t("common.user")}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials || <UserRound size={16} />
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
              <div className="mt-3 border-t border-app pt-3">
                <Button onClick={toggleQr}>
                  <div className="flex gap-4 cursor-pointer">
                    <QrCodeIcon />
                    <div>Login device for qr code</div>
                  </div>
                </Button>
              </div>
              <div className="mt-3 border-t border-app pt-3">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-rose-500 transition hover:bg-rose-500/10"
                >
                  <LogOut size={16} />
                  {t("common.logout")}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
