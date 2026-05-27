import apiClient from "../lib/axios";
import { getAccessToken } from "../lib/auth";
import type { NotificationItem } from "./types";



export async function getNotifications(): Promise<NotificationItem[]> {
  const response = await apiClient.get("/notification");
  return response.data ?? [];
}

export async function markNotificationAsRead(notificationId: string) {
  return apiClient.get(`/notification/read/${notificationId}`);
}

export function subscribeToNotifications(
  onNotification: (notification: NotificationItem) => void,
  onError?: () => void
) {
  const token = getAccessToken();

  if (!token) return null;

  const apiUrl = import.meta.env.VITE_API_URL;
  const source = new EventSource(`${apiUrl}/notification/events?token=${token}`);

  source.addEventListener("notification.created", (event) => {
    const notification = JSON.parse(event.data) as NotificationItem;
    notification.created_at = new Date(notification.created_at).toISOString();
    onNotification(notification);
  });

  source.onerror = () => {
    if (onError) onError();
  };

  return source;
}

export function getNotificationPostId(notification: NotificationItem) {
  if (notification.post_id) return notification.post_id;
  if (notification.entity_type === "post") return notification.entity_id;
  if (notification.entity_id) return notification.entity_id;
  return undefined;
}
