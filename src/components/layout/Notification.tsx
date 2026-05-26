/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatDateToDayMonthYear } from "../../lib/date";
import {
  getNotificationPostId,
  getNotifications,
  markNotificationAsRead,
  subscribeToNotifications,
} from "../../services/notification.service";
import type { NotificationItem } from "../../services/types";

export default function NotificationBell() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function fetchNotifications() {
    const data = await getNotifications();
    setNotifications(data);
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const source = subscribeToNotifications(
      (notification) => {
        setNotifications((prev) => [notification, ...prev]);
      },
      () => {
        console.log("Notification SSE error");
      }
    );

    if (!source) return;

    return () => {
      source.close();
    };
  }, []);

  const handleReadNotification = async (notification: NotificationItem) => {
    const postId = getNotificationPostId(notification);

    if (!notification.is_read) {
      const result = await markNotificationAsRead(notification.id);

      if (result) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id ? { ...item, is_read: true } : item,
          ),
        );
      }
    }

    setOpen(false);

    if (postId) {
      navigate(`/posts/detail/${postId}`);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`relative rounded-full p-2.5 text-slate-500 transition duration-200 ${
          open
            ? "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-100"
            : "hover:bg-slate-100 hover:text-slate-900"
        }`}
      >
        <Bell size={22} />

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cyan-600 px-1 text-xs font-semibold text-white shadow-sm ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-84 overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_24px_60px_-24px_rgba(15,23,42,0.35)] backdrop-blur">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                Notifications
              </h3>
              <span className="rounded-full bg-cyan-50 px-2.5 py-1 text-[11px] font-semibold text-cyan-700 ring-1 ring-cyan-100">
                {unreadCount} unread
              </span>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto bg-white">
            {notifications.length === 0 ? (
              <div className="px-5 py-10 text-center text-sm text-slate-500">
                Bildirim yok
              </div>
            ) : (
              notifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  className={`group w-full border-b border-slate-100 px-5 py-4 text-left transition duration-200 last:border-b-0 ${
                    notification.is_read
                      ? "bg-white hover:bg-slate-50"
                      : "bg-cyan-50/60 hover:bg-cyan-50"
                  }`}
                  onClick={() => handleReadNotification(notification)}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full transition ${
                        notification.is_read
                          ? "bg-slate-200 group-hover:bg-slate-300"
                          : "bg-cyan-500 shadow-[0_0_0_4px_rgba(6,182,212,0.12)]"
                      }`}
                    />

                    <div className="min-w-0 flex-1">
                      {notification.actor_full_name && (
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cyan-700">
                          {notification.actor_full_name}
                        </p>
                      )}

                      <p
                        className={`text-sm leading-6 transition ${
                          notification.is_read
                            ? "font-medium text-slate-700 group-hover:text-slate-900"
                            : "font-semibold text-slate-900"
                        }`}
                      >
                        {notification.title || notification.message}
                      </p>

                      <span className="mt-1.5 block text-xs text-slate-400">
                        {formatDateToDayMonthYear(notification.created_at)}
                      </span>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
