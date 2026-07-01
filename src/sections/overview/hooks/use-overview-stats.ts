import { useMemo } from "react";
import { useGetPosts } from "src/actions/blog";
import { useAuthContext } from "src/auth/hooks/use-auth-context";

import { aggregateUserPostStats } from "../utils";

import type { UserPostStats } from "../types";

// ----------------------------------------------------------------------

interface UseOverviewStatsReturn {
  userName: string;
  stats: UserPostStats;
  statsLoading: boolean;
  hasPosts: boolean;
}

/**
 * Combines the current user with the full post list and reduces it down to
 * the current user's own stats. There is no per-user aggregate endpoint on
 * the backend, so this filters client-side (see `aggregateUserPostStats`).
 */
export function useOverviewStats(): UseOverviewStatsReturn {
  const { user } = useAuthContext();
  const { posts, postsLoading } = useGetPosts();

  const userId = user?.id ?? user?._id;

  const stats = useMemo(
    () => aggregateUserPostStats(posts, userId),
    [posts, userId],
  );

  return useMemo(
    () => ({
      userName: user?.name ?? "",
      stats,
      statsLoading: postsLoading,
      hasPosts: stats.totalPosts > 0,
    }),
    [user?.name, stats, postsLoading],
  );
}
