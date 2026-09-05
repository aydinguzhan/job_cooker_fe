import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Search,
  SendHorizonal,
  UserRound,
} from "lucide-react";
import { userInfo } from "../../lib/auth";
import { formatDateToDayMonthYear } from "../../lib/date";
import { useTranslation } from "../../lang/useTranslation";
import { resolveFileUrl } from "../../services/file.service";
import { getFollowings } from "../../services/follows.service";
import {
  createConversation,
  getConversationMessages,
  getConversations,
  markConversationAsRead,
  sendMessage,
} from "../../services/message.service";
import type { FollowUser } from "../../types/follow.types";
import type {
  MessageConversation,
  MessageItem,
} from "../../types/message.types";
import MessageLoading from "./components/MessageLoading";

const MESSAGE_FETCH_COUNT = 200;
const SIDEBAR_PAGE_SIZE = 9;
type SidebarTab = "conversations" | "people";

function buildFullName(user: Pick<FollowUser, "first_name" | "last_name">) {
  return `${user.first_name} ${user.last_name}`.trim();
}

function getConversationDisplayName(
  conversation: MessageConversation,
  t: (key: string) => string,
) {
  const fullName =
    `${conversation.participant_first_name ?? ""} ${conversation.participant_last_name ?? ""}`.trim();

  return fullName || conversation.subject || t("messages.untitledConversation");
}

function formatMessageTimestamp(value: string | null) {
  if (!value) return "";

  const createdAt = new Date(value);
  const now = new Date();
  const isSameDay =
    createdAt.getDate() === now.getDate() &&
    createdAt.getMonth() === now.getMonth() &&
    createdAt.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return createdAt.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return formatDateToDayMonthYear(value);
}

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function MessagesPage() {
  const { t } = useTranslation();
  const currentUser = userInfo();
  const currentUserId = currentUser?.userId ?? "";

  const [conversations, setConversations] = useState<MessageConversation[]>([]);
  const [followings, setFollowings] = useState<FollowUser[]>([]);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [activeTab, setActiveTab] = useState<SidebarTab>("conversations");
  const [searchTerm, setSearchTerm] = useState("");
  const [draft, setDraft] = useState("");
  const [sidebarPage, setSidebarPage] = useState(1);
  const [isBooting, setIsBooting] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isStartingConversation, setIsStartingConversation] = useState<
    string | null
  >(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function bootstrap() {
      try {
        setIsBooting(true);
        setErrorMessage(null);

        const [conversationResults, followingResults] = await Promise.all([
          getConversations(),
          getFollowings(),
        ]);

        setConversations(conversationResults);
        setFollowings(followingResults);
        setActiveConversationId(null);
      } catch (error) {
        console.error("Messages bootstrap error:", error);
        setErrorMessage(t("messages.loadError"));
      } finally {
        setIsBooting(false);
      }
    }

    bootstrap();
  }, [t]);

  useEffect(() => {
    if (!activeConversationId) return;

    async function loadMessages() {
      const conversationId = activeConversationId;

      if (!conversationId) return;

      try {
        setIsLoadingMessages(true);
        setErrorMessage(null);

        const response = await getConversationMessages(
          conversationId,
          MESSAGE_FETCH_COUNT,
          0,
        );

        setMessages(response.items);
        await markConversationAsRead(conversationId);
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === conversationId
              ? { ...conversation, unread_count: 0 }
              : conversation,
          ),
        );
      } catch (error) {
        console.error("Conversation messages error:", error);
        setErrorMessage(t("messages.threadError"));
      } finally {
        setIsLoadingMessages(false);
      }
    }

    loadMessages();
  }, [activeConversationId, t]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId,
  );

  const searchValue = searchTerm.trim().toLowerCase();

  const filteredConversations = useMemo(() => {
    const uniqueConversations = new Map<
      string,
      {
        id: string;
        kind: "conversation";
        title: string;
        subtitle: string;
        imagePath: string | null;
        timestamp: string | null;
        unreadCount: number;
        conversation: MessageConversation;
      }
    >();

    for (const conversation of conversations) {
      const participantKey =
        conversation.participant_id ||
        getConversationDisplayName(conversation, t).trim().toLowerCase();

      const existing = uniqueConversations.get(participantKey);

      if (!existing) {
        uniqueConversations.set(participantKey, {
          id: `conversation-${conversation.id}`,
          kind: "conversation",
          title: getConversationDisplayName(conversation, t),
          subtitle: conversation.last_message || t("messages.noMessagesYet"),
          imagePath: conversation.participant_profile_image_path,
          timestamp: conversation.last_message_at,
          unreadCount: conversation.unread_count,
          conversation,
        });
        continue;
      }

      existing.unreadCount += conversation.unread_count;
    }

    const items = Array.from(uniqueConversations.values());

    if (!searchValue) return items;

    return items.filter((item) => {
      const title = item.title.toLowerCase();
      const subtitle = item.subtitle.toLowerCase();
      return title.includes(searchValue) || subtitle.includes(searchValue);
    });
  }, [conversations, searchValue, t]);

  const filteredPeople = useMemo(() => {
    const items = followings.map((following) => ({
      id: `following-${following.id}`,
      kind: "following" as const,
      title: buildFullName(following),
      subtitle: following.title || following.email,
      imagePath: following.profile_image_path,
      following,
    }));

    if (!searchValue) return items;

    return items.filter((item) => {
      const title = item.title.toLowerCase();
      const subtitle = item.subtitle.toLowerCase();
      return title.includes(searchValue) || subtitle.includes(searchValue);
    });
  }, [followings, searchValue]);

  const filteredSidebarItems =
    activeTab === "conversations" ? filteredConversations : filteredPeople;

  const sidebarTotalPages = Math.max(
    1,
    Math.ceil(filteredSidebarItems.length / SIDEBAR_PAGE_SIZE),
  );

  const visibleSidebarItems = filteredSidebarItems.slice(
    (sidebarPage - 1) * SIDEBAR_PAGE_SIZE,
    sidebarPage * SIDEBAR_PAGE_SIZE,
  );

  const activeFollowing = activeConversation?.participant_id
    ? (followings.find(
        (following) => following.id === activeConversation.participant_id,
      ) ?? null)
    : null;

  async function handleStartConversation(following: FollowUser) {
    const existingConversation = conversations.find(
      (conversation) => conversation.participant_id === following.id,
    );

    if (existingConversation) {
      setActiveConversationId((prev) =>
        prev === existingConversation.id ? null : existingConversation.id,
      );
      return;
    }

    try {
      setIsStartingConversation(following.id);
      setErrorMessage(null);

      const createdConversation = await createConversation({
        subject: buildFullName(following),
        members: [following.id],
      });

      const nextConversation: MessageConversation = {
        id: createdConversation.id,
        subject: createdConversation.subject,
        participant_id: following.id,
        participant_first_name: following.first_name,
        participant_last_name: following.last_name,
        participant_email: following.email,
        participant_title: following.title,
        participant_profile_image_path: following.profile_image_path,
        last_message: null,
        last_message_at: null,
        unread_count: 0,
      };

      setConversations((prev) => [nextConversation, ...prev]);
      setActiveConversationId(createdConversation.id);
      setMessages([]);
    } catch (error) {
      console.error("Create conversation error:", error);
      setErrorMessage(t("messages.createConversationError"));
    } finally {
      setIsStartingConversation(null);
    }
  }

  async function handleSendMessage() {
    const body = draft.trim();

    if (!activeConversationId || !body) return;

    try {
      setIsSending(true);
      setErrorMessage(null);

      const createdMessage = await sendMessage({
        conversation_id: activeConversationId,
        body,
      });

      setMessages((prev) => [...prev, createdMessage]);
      setConversations((prev) => {
        const updated = prev.map((conversation) =>
          conversation.id === activeConversationId
            ? {
                ...conversation,
                last_message: createdMessage.body,
                last_message_at: createdMessage.created_at,
              }
            : conversation,
        );

        updated.sort((left, right) => {
          const leftTime = left.last_message_at
            ? new Date(left.last_message_at).getTime()
            : 0;
          const rightTime = right.last_message_at
            ? new Date(right.last_message_at).getTime()
            : 0;
          return rightTime - leftTime;
        });

        return updated;
      });
      setDraft("");
    } catch (error) {
      console.error("Send message error:", error);
      setErrorMessage(t("messages.sendError"));
    } finally {
      setIsSending(false);
    }
  }

  function handleComposerKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (!activeConversation || isSending || !draft.trim()) {
      return;
    }

    void handleSendMessage();
  }

  if (isBooting) {
    return <MessageLoading />;
  }

  return (
    <main className="h-full overflow-hidden bg-app px-3 py-3 md:px-4">
      <div className="mx-auto h-full max-w-6xl overflow-hidden">
        {errorMessage ? (
          <div className="mb-3 rounded-[1.25rem] border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-surface dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
            {errorMessage}
          </div>
        ) : null}

        <section className="flex h-[calc(100vh-7.75rem)] overflow-hidden rounded-[1.5rem] border border-app bg-surface shadow-surface">
          <aside className="flex h-full w-[320px] shrink-0 flex-col overflow-hidden border-r border-app bg-[linear-gradient(180deg,var(--surface)_0%,var(--surface-muted)_100%)]">
            <div className="border-b border-app bg-[linear-gradient(180deg,var(--surface-elevated)_0%,var(--surface-muted)_100%)] px-4 py-4">
              <h1 className="text-lg font-semibold tracking-tight text-app">
                {t("messages.sidebarTitle")}
              </h1>

              <div className="mt-3 flex items-center gap-3 rounded-xl border border-app bg-surface-elevated px-3 py-2.5">
                <Search className="h-4 w-4 text-soft" />
                <input
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setSidebarPage(1);
                  }}
                  placeholder={t("messages.searchPlaceholder")}
                  className="w-full bg-transparent text-sm text-app outline-none placeholder:text-soft"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 rounded-xl bg-surface-muted p-1">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("conversations");
                    setSidebarPage(1);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === "conversations"
                      ? "bg-surface-elevated text-app shadow-sm"
                      : "text-soft hover:text-app"
                  }`}
                >
                  {t("messages.messagesTab")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("people");
                    setSidebarPage(1);
                  }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    activeTab === "people"
                      ? "bg-surface-elevated text-app shadow-sm"
                      : "text-soft hover:text-app"
                  }`}
                >
                  {t("messages.peopleTab")}
                </button>
              </div>
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-hidden px-3 py-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-soft">
                  {activeTab === "conversations"
                    ? t("messages.messagesTab")
                    : t("messages.peopleTab")}
                </p>
                <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted">
                  {filteredSidebarItems.length}
                </span>
              </div>

              <div className="min-h-0 flex-1 space-y-2 overflow-hidden">
                {visibleSidebarItems.length === 0 ? (
                  <div className="rounded-[1] border border-dashed border-app bg-surface-muted px-3 py-6 text-center text-xs text-soft">
                    {activeTab === "conversations"
                      ? t("messages.emptyChats")
                      : t("messages.emptyFollowing")}
                  </div>
                ) : (
                  visibleSidebarItems.map((item) => {
                    const isConversation = item.kind === "conversation";
                    const isActive =
                      isConversation &&
                      item.conversation.id === activeConversationId;
                    const isPending =
                      item.kind === "following" &&
                      isStartingConversation === item.following.id;
                    const imageSrc = resolveFileUrl(item.imagePath);

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          isConversation
                            ? setActiveConversationId((prev) =>
                                prev === item.conversation.id
                                  ? null
                                  : item.conversation.id,
                              )
                            : handleStartConversation(item.following)
                        }
                        disabled={isPending}
                        className={`relative flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-60 ${
                          isActive
                            ? "border-cyan-200 bg-surface-storng "
                            : "border-app bg-surface-muted hover:border-strong hover:bg-surface-elevated"
                        }`}
                      >
                        {isActive ? (
                          <span className="absolute inset-y-3 left-0 w-1 rounded-r-full bg-cyan-500" />
                        ) : null}

                        {isConversation && item.unreadCount > 0 ? (
                          <span className="absolute left-2 top-2 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-1 text-[10px] font-semibold text-white shadow-sm">
                            {item.unreadCount}
                          </span>
                        ) : null}

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-strong text-xs font-semibold text-soft">
                          {imageSrc ? (
                            <img
                              src={imageSrc}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            getInitials(item.title)
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`truncate text-sm font-semibold ${
                                isActive ? "text-cyan-950" : "text-app"
                              }`}
                            >
                              {item.title}
                            </p>
                            {isConversation ? (
                              <span
                                className={`text-[11px] ${
                                  isActive ? "text-cyan-700" : "text-soft"
                                }`}
                              >
                                {formatMessageTimestamp(item.timestamp)}
                              </span>
                            ) : null}
                          </div>

                          <p
                            className={`mt-1 truncate text-xs ${
                              isConversation
                                ? isActive
                                  ? "font-medium text-cyan-900"
                                  : "text-muted"
                                : isActive
                                  ? "text-cyan-900"
                                  : "text-soft"
                            }`}
                          >
                            {isPending
                              ? t("messages.preparing")
                              : item.subtitle}
                          </p>
                        </div>

                        {isConversation ? null : (
                          <span className="rounded-full bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-white">
                            {isPending
                              ? t("messages.preparing")
                              : t("messages.sendMessage")}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setSidebarPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={sidebarPage === 1}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-app bg-surface px-2.5 py-1.5 text-xs text-muted transition hover:bg-surface-elevated hover:text-app disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  {t("common.previous")}
                </button>

                <span className="text-xs text-soft">
                  {t("messages.pageLabel", {
                    current: sidebarPage,
                    total: sidebarTotalPages,
                  })}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setSidebarPage((prev) =>
                      Math.min(sidebarTotalPages, prev + 1),
                    )
                  }
                  disabled={sidebarPage === sidebarTotalPages}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-app bg-surface px-2.5 py-1.5 text-xs text-muted transition hover:bg-surface-elevated hover:text-app disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {t("common.next")}
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>

          <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b border-app bg-[linear-gradient(180deg,var(--surface-elevated)_0%,var(--surface-muted)_100%)] px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-strong text-sm font-semibold text-soft">
                  {resolveFileUrl(
                    activeFollowing?.profile_image_path ?? null,
                  ) ? (
                    <img
                      src={resolveFileUrl(
                        activeFollowing?.profile_image_path ?? null,
                      )}
                      alt={
                        activeConversation?.subject ||
                        t("messages.selectConversation")
                      }
                      className="h-full w-full object-cover"
                    />
                  ) : activeConversation?.subject ? (
                    getInitials(
                      getConversationDisplayName(activeConversation, t),
                    )
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-semibold tracking-tight text-app">
                    {activeConversation
                      ? getConversationDisplayName(activeConversation, t)
                      : t("messages.selectConversation")}
                  </h2>
                  <p className="mt-0.5 truncate text-xs text-soft">
                    {activeConversation?.participant_title ||
                      activeConversation?.participant_email ||
                      activeFollowing?.title ||
                      activeFollowing?.email ||
                      t("messages.threadEmptyState")}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-surface-muted px-2.5 py-1 text-[11px] font-semibold text-muted">
                {messages.length}
              </span>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto  px-4 py-4">
              {!activeConversation ? (
                <div className="flex h-full min-h-[320] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-app bg-surface px-6 text-center">
                  <MessageCircle className="h-12 w-12 text-soft" />
                  <p className="mt-4 text-lg font-semibold text-app">
                    {t("messages.selectRecipient")}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-soft">
                    {t("messages.selectRecipientDescription")}
                  </p>
                </div>
              ) : isLoadingMessages ? (
                <div className="flex h-full min-h-[320] items-center justify-center text-sm text-soft">
                  {t("messages.loadingThread")}
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-full min-h-[320] flex-col items-center justify-center rounded-[1.75rem] border border-dashed border-app bg-surface px-6 text-center">
                  <MessageCircle className="h-12 w-12 text-soft" />
                  <p className="mt-4 text-lg font-semibold text-app">
                    {t("messages.noMessagesTitle")}
                  </p>
                  <p className="mt-2 max-w-md text-sm leading-6 text-soft">
                    {t("messages.noMessagesDescription")}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((message) => {
                    const isOwn = message.sender_id === currentUserId;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[78%] rounded-[1.4rem] px-4 py-3 shadow-sm ${
                            isOwn
                              ? "bg-slate-900 text-white"
                              : "border border-app bg-white text-app"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-6">
                            {message.body}
                          </p>
                          <p
                            className={`mt-2 text-[11px] ${
                              isOwn ? "text-slate-300" : "text-soft"
                            }`}
                          >
                            {formatMessageTimestamp(message.created_at)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="border-t border-app bg-surface px-4 py-3">
              <div className="rounded-[1.25rem] border border-app bg-surface-elevated p-3 shadow-sm">
                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={handleComposerKeyDown}
                  placeholder={t("messages.composePlaceholder")}
                  disabled={!activeConversation || isSending}
                  rows={2}
                  className="w-full resize-none bg-transparent px-2 py-2 text-sm text-app outline-none placeholder:text-soft disabled:cursor-not-allowed"
                />

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-xs text-soft">
                    {activeConversation
                      ? t("messages.sendMessage")
                      : t("messages.composeDisabled")}
                  </p>

                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!activeConversation || !draft.trim() || isSending}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <SendHorizonal className="h-4 w-4" />
                    {isSending ? t("messages.sending") : t("messages.send")}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
