import type { Post } from "src/types/domain";

import type { UserPostStats } from "./types";

// ----------------------------------------------------------------------

const EMPTY_STATS: UserPostStats = {
  totalPosts: 0,
  totalViews: 0,
  totalComments: 0,
  totalFavorites: 0,
};

/**
 * Pure aggregation over posts owned by `userId`. No backend "my stats"
 * endpoint exists yet, so the dashboard filters/reduces client-side over the
 * full post list returned by `useGetPosts()`.
 */
export function aggregateUserPostStats(
  posts: Post[],
  userId?: string,
): UserPostStats {
  if (!userId) {
    return EMPTY_STATS;
  }

  const ownPosts = posts.filter((post) => post.userId === userId);

  return ownPosts.reduce<UserPostStats>(
    (acc, post) => ({
      totalPosts: acc.totalPosts + 1,
      totalViews: acc.totalViews + (post.totalViews ?? 0),
      totalComments: acc.totalComments + (post.totalComments ?? 0),
      totalFavorites: acc.totalFavorites + (post.totalFavorites ?? 0),
    }),
    EMPTY_STATS,
  );
}
