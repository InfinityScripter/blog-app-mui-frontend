import type { FetcherArgs } from "src/utils/axios";
import type {
  ListPostsResponse,
  ListReleasesResponse,
} from "src/types/api";

import useSWR from "swr";
import { useMemo, useCallback } from "react";
import { fetcher, endpoints } from "src/utils/axios";
import { useLocalStorage } from "src/hooks/use-local-storage";

import { buildNotificationsFeed } from "../utils";
import { POSTS_FEED_LIMIT, NOTIFICATIONS_STORAGE_KEY } from "../const";

import type { AppNotification, NotificationsReadState } from "../types";

// ----------------------------------------------------------------------

const swrOptions = {
  revalidateIfStale: true,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

// The feed must always be the public view: post/list scopes results by the
// JWT role (admin → drafts included, user → own posts only), so the session
// Authorization header is explicitly dropped. Array keys also keep these SWR
// cache entries separate from the authorized `useGetPosts` ones.
const publicRequest = { headers: { Authorization: null } };

const POSTS_KEY: FetcherArgs = [
  `${endpoints.post.list}?limit=${POSTS_FEED_LIMIT}`,
  publicRequest,
];

const RELEASES_KEY: FetcherArgs = [endpoints.changelog.list, publicRequest];

const INITIAL_READ_STATE: NotificationsReadState = {
  readIds: [],
  archivedIds: [],
};

// ----------------------------------------------------------------------

export function useNotifications() {
  const posts = useSWR<ListPostsResponse>(POSTS_KEY, fetcher, swrOptions);
  const releases = useSWR<ListReleasesResponse>(
    RELEASES_KEY,
    fetcher,
    swrOptions,
  );

  const { state, setState } = useLocalStorage<NotificationsReadState>(
    NOTIFICATIONS_STORAGE_KEY,
    INITIAL_READ_STATE,
  );

  const notifications = useMemo(
    () =>
      buildNotificationsFeed(
        posts.data?.posts ?? [],
        releases.data?.releases ?? [],
      ),
    [posts.data?.posts, releases.data?.releases],
  );

  const feedIds = useMemo(
    () => notifications.map((notification) => notification.id),
    [notifications],
  );

  const isRead = useCallback(
    (id: string) => state.readIds.includes(id),
    [state.readIds],
  );

  const isArchived = useCallback(
    (id: string) => state.archivedIds.includes(id),
    [state.archivedIds],
  );

  const markRead = useCallback(
    (id: string) => {
      if (state.readIds.includes(id)) {
        return;
      }
      // Prune ids that left the feed so the stored lists stay bounded.
      setState({
        readIds: [...state.readIds, id].filter((readId) =>
          feedIds.includes(readId),
        ),
      });
    },
    [feedIds, setState, state.readIds],
  );

  const markAllRead = useCallback(() => {
    setState({ readIds: feedIds });
  }, [feedIds, setState]);

  const toggleArchive = useCallback(
    (id: string) => {
      const next = state.archivedIds.includes(id)
        ? state.archivedIds.filter((archivedId) => archivedId !== id)
        : [...state.archivedIds, id];
      setState({
        archivedIds: next.filter((archivedId) => feedIds.includes(archivedId)),
      });
    },
    [feedIds, setState, state.archivedIds],
  );

  const { active, unread, archived } = useMemo(() => {
    const activeItems: AppNotification[] = notifications.filter(
      (notification) => !state.archivedIds.includes(notification.id),
    );
    return {
      active: activeItems,
      unread: activeItems.filter(
        (notification) => !state.readIds.includes(notification.id),
      ),
      archived: notifications.filter((notification) =>
        state.archivedIds.includes(notification.id),
      ),
    };
  }, [notifications, state.archivedIds, state.readIds]);

  const isLoading =
    (posts.isLoading || releases.isLoading) && notifications.length === 0;

  const hasError =
    Boolean(posts.error) &&
    Boolean(releases.error) &&
    notifications.length === 0;

  return {
    active,
    unread,
    archived,
    unreadCount: unread.length,
    isLoading,
    hasError,
    isRead,
    isArchived,
    markRead,
    markAllRead,
    toggleArchive,
  };
}
