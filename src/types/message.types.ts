export type MessageConversation = {
  id: string;
  subject: string | null;
  participant_id: string | null;
  participant_first_name: string | null;
  participant_last_name: string | null;
  participant_email: string | null;
  participant_title: string | null;
  participant_profile_image_path: string | null;
  last_message: string | null;
  last_message_at: string | null;
  unread_count: number;
};

export type MessageItem = {
  id: string;
  conversation_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string | null;
};

export type ConversationMessages = {
  items: MessageItem[];
  totalCount: number;
};

export type CreateConversationPayload = {
  subject?: string | null;
  members: string[];
};

export type SendMessagePayload = {
  conversation_id: string;
  body: string;
};
