'use client';

import useSWR from 'swr';
import { useRef, useMemo, useEffect } from 'react';
import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// ----------------------------------------------------------------------

export function useGetChannels() {
  const { data, isLoading, error, mutate } = useSWR(
    endpoints.chat.channels,
    fetcher,
    swrOptions
  );
  return useMemo(
    () => ({
      channels: (data as any)?.channels ?? [],
      channelsLoading: isLoading,
      channelsError: error,
      channelsMutate: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

export function useGetMessages(channelId: string | null) {
  const key = channelId ? endpoints.chat.messages(channelId) : null;
  const { data, isLoading, error, mutate } = useSWR(key, fetcher, swrOptions);
  return useMemo(
    () => ({
      messages: (data as any)?.messages ?? [],
      messagesLoading: isLoading,
      messagesError: error,
      messagesMutate: mutate,
    }),
    [data, isLoading, error, mutate]
  );
}

export function useChatStream(
  channelId: string | null,
  token: string | undefined,
  onMessage: (msgs: any[]) => void
) {
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    if (!channelId || !token) return undefined;
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/chat/${channelId}/stream?token=${token}`;
    const es = new EventSource(url);
    es.onmessage = (e) => {
      const { messages } = JSON.parse(e.data);
      if (messages?.length) onMessageRef.current(messages);
    };
    return () => {
      es.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelId, token]);
}

export async function sendMessage(channelId: string, body: string) {
  await axiosInstance.post(endpoints.chat.messages(channelId), { body });
}

export async function createChannel(
  type: 'direct' | 'group',
  memberIds: string[],
  name?: string
) {
  const res = await axiosInstance.post(endpoints.chat.channels, { type, memberIds, name });
  return (res.data as any).channel;
}
