export type NotificationItem = {
  id: string;
  message: string;
  title?: string;
  actor_full_name?: string;
  post_id?: string;
  entity_id?: string;
  entity_type?: string;
  is_read: boolean;
  created_at: string;
  type: string;
};
