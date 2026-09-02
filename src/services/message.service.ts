import apiClient from "../lib/axios";
import type {
  ConversationMessages,
  CreateConversationPayload,
  MessageConversation,
  MessageItem,
  SendMessagePayload,
} from "../types/message.types";

export async function getConversations(): Promise<MessageConversation[]> {
  const { data } = await apiClient.get("/messages/conversations");
  return data.data ?? [];
}

export async function getConversationMessages(
  conversationId: string,
  count = 50,
  startFrom = 0,
): Promise<ConversationMessages> {
  const { data } = await apiClient.get(
    `/messages/conversations/${conversationId}/messages`,
    {
      params: {
        count,
        startFrom,
      },
    },
  );

  return data.data;
}

export async function createConversation(
  payload: CreateConversationPayload,
): Promise<{ id: string; subject: string | null }> {
  const { data } = await apiClient.post("/messages/conversations", payload);
  return data.data;
}

export async function sendMessage(
  payload: SendMessagePayload,
): Promise<MessageItem> {
  const { data } = await apiClient.post("/messages", payload);
  return data.data;
}

export async function markConversationAsRead(conversationId: string) {
  const { data } = await apiClient.patch(
    `/messages/conversations/${conversationId}/read`,
  );
  return data;
}

export async function getUnreadMessageCount(): Promise<number> {
  const { data } = await apiClient.get("/messages/unread-count");
  return data.data?.count ?? 0;
}
