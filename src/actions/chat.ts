import { useMemo } from "react";
import useSWR, { mutate } from "swr";

import { keyBy } from "src/utils/helper";
import axios, { fetcher, endpoints } from "src/utils/axios";

// ----------------------------------------------------------------------

const enableServer = false;

const CHART_ENDPOINT = endpoints.chat;

const swrOptions = {
  revalidateIfStale: enableServer,
  revalidateOnFocus: enableServer,
  revalidateOnReconnect: enableServer,
};

// ----------------------------------------------------------------------

interface Contact {
  id: string;
  name: string;
  username: string;
  avatar: string;
  address: string;
  phone: string;
  email: string;
  lastActivity: Date | string;
  status: string;
  role: string;
  [key: string]: unknown;
}

interface ContactsResponse {
  contacts: Contact[];
}

export function useGetContacts() {
  const url = [CHART_ENDPOINT, { params: { endpoint: "contacts" } }];

  const { data, isLoading, error, isValidating } = useSWR<ContactsResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts ?? [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !(data?.contacts?.length ?? 0),
    }),
    [data?.contacts, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface Conversation {
  id: string;
  participants: Contact[];
  type: string;
  unreadCount: number;
  messages: Message[];
  [key: string]: unknown;
}

interface Message {
  id: string;
  body: string;
  contentType: string;
  attachments: string[];
  createdAt: Date | string;
  senderId: string;
  [key: string]: unknown;
}

interface ConversationsResponse {
  conversations: Conversation[];
}

export function useGetConversations() {
  const url = [CHART_ENDPOINT, { params: { endpoint: "conversations" } }];

  const { data, isLoading, error, isValidating } = useSWR<ConversationsResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(() => {
    const byId = data?.conversations?.length
      ? keyBy(data.conversations, "id")
      : {};
    const allIds = Object.keys(byId);

    return {
      conversations: { byId, allIds },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

interface ConversationResponse {
  conversation: Conversation;
}

export function useGetConversation(conversationId: string | null) {
  const url = conversationId
    ? [CHART_ENDPOINT, { params: { conversationId, endpoint: "conversation" } }]
    : null;

  const { data, isLoading, error, isValidating } = useSWR<ConversationResponse>(
    url,
    fetcher,
    swrOptions,
  );

  const memoizedValue = useMemo(
    () => ({
      conversation: data?.conversation,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data?.conversation, error, isLoading, isValidating],
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId: string, messageData: Message): Promise<void> {
  const conversationsUrl = [
    CHART_ENDPOINT,
    { params: { endpoint: "conversations" } },
  ];

  const conversationUrl = [
    CHART_ENDPOINT,
    { params: { conversationId, endpoint: "conversation" } },
  ];

  /**
   * Work on server
   */
  if (enableServer) {
    const data = { conversationId, messageData };
    await axios.put(CHART_ENDPOINT, data);
  }

  /**
   * Work in local
   */
  mutate(
    conversationUrl,
    (currentData: ConversationResponse | undefined) => {
      const currentConversation = currentData?.conversation;
      if (!currentConversation) return currentData;

      const conversation = {
        ...currentConversation,
        messages: [...(currentConversation.messages ?? []), messageData],
      };

      return { ...currentData, conversation } as ConversationResponse;
    },
    false,
  );

  mutate(
    conversationsUrl,
    (currentData: ConversationsResponse | undefined) => {
      const currentConversations = currentData?.conversations ?? [];

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? {
              ...conversation,
              messages: [...(conversation.messages ?? []), messageData],
            }
          : conversation,
      );

      return { ...currentData, conversations } as ConversationsResponse;
    },
    false,
  );
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData: Conversation): Promise<Conversation> {
  const url = [CHART_ENDPOINT, { params: { endpoint: "conversations" } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post<{ conversation: Conversation }>(CHART_ENDPOINT, data);

  /**
   * Work in local
   */
  mutate(
    url,
    (currentData: ConversationsResponse | undefined) => {
      const currentConversations = currentData?.conversations ?? [];

      const conversations = [...currentConversations, conversationData];

      return { ...currentData, conversations } as ConversationsResponse;
    },
    false,
  );

  return res.data.conversation;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId: string): Promise<void> {
  /**
   * Work on server
   */
  if (enableServer) {
    await axios.get(CHART_ENDPOINT, {
      params: { conversationId, endpoint: "mark-as-seen" },
    });
  }

  /**
   * Work in local
   */
  mutate(
    [CHART_ENDPOINT, { params: { endpoint: "conversations" } }],
    (currentData: ConversationsResponse | undefined) => {
      const currentConversations = currentData?.conversations ?? [];

      const conversations = currentConversations.map((conversation) =>
        conversation.id === conversationId
          ? { ...conversation, unreadCount: 0 }
          : conversation,
      );

      return { ...currentData, conversations } as ConversationsResponse;
    },
    false,
  );
}
