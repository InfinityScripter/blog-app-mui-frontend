import type { Post } from "src/types/domain";
import type { ModelRelease } from "src/types/api";

import { paths } from "src/routes/paths";
import { fToNow } from "src/utils/format-time";
import { PUBLISH_STATUS } from "src/types/domain";

import { NEWS_TAG, MAX_NOTIFICATIONS } from "./const";

import type { AppNotification } from "./types";

// ----------------------------------------------------------------------

function postToNotification(post: Post): AppNotification[] {
  const id = post.id ?? post._id;
  if (!id || !post.createdAt) {
    return [];
  }
  const createdAt =
    typeof post.createdAt === "string"
      ? post.createdAt
      : post.createdAt.toISOString();

  return [
    {
      id: `post-${id}`,
      kind: post.tags.includes(NEWS_TAG) ? "news" : "post",
      message: post.title,
      meta: post.author?.name ?? "",
      coverUrl: post.coverUrl ?? null,
      href: paths.post.details(id),
      createdAt,
    },
  ];
}

function releaseToNotification(release: ModelRelease): AppNotification {
  return {
    id: `release-${release.id}`,
    kind: "release",
    message: `${release.vendor} ${release.model} ${release.version}`.trim(),
    meta: release.verdict ?? release.sourceName ?? "",
    coverUrl: null,
    href: paths.changelog.details(release.slug),
    createdAt: release.releasedAt || release.createdAt,
  };
}

/** Merges published posts and model releases into one date-sorted feed. */
export function buildNotificationsFeed(
  posts: Post[],
  releases: ModelRelease[],
): AppNotification[] {
  const fromPosts = posts
    .filter((post) => post.publish === PUBLISH_STATUS.published)
    .flatMap(postToNotification);

  const fromReleases = releases.map(releaseToNotification);

  return [...fromPosts, ...fromReleases]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, MAX_NOTIFICATIONS);
}

/** "5 минут" → "5 минут назад"; empty string when the date is unparsable. */
export function formatTimeAgo(date: string): string {
  const relative = fToNow(date);
  return relative && relative !== "Invalid time value"
    ? `${relative} назад`
    : "";
}
