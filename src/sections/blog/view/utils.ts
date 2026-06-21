import type { Post, PublishStatus } from "src/types/domain";
import type { FeedTag } from "src/sections/home/home-feed/const";

import { orderBy } from "src/utils/helper";

import type { SortablePost } from "./types";

// ----------------------------------------------------------------------

export function isPublishStatus(value: string): value is PublishStatus {
  return value === "draft" || value === "published";
}

// ----------------------------------------------------------------------

export const applyHomeFilter = ({
  inputData,
  sortBy,
  selectedTags,
}: {
  inputData: Post[];
  sortBy: string;
  selectedTags: FeedTag[];
}): Post[] => {
  let publishedPosts: SortablePost[] = inputData
    .filter((post) => post.publish === "published")
    .map((post) => ({ ...post }));

  if (selectedTags.length > 0) {
    publishedPosts = publishedPosts.filter((post) =>
      selectedTags.some((tag) =>
        (post.tags ?? []).some(
          (t) => t.toLowerCase().trim() === tag.toLowerCase().trim(),
        ),
      ),
    );
  }

  if (sortBy === "latest") {
    return orderBy(publishedPosts, ["createdAt"], ["desc"]);
  }
  if (sortBy === "oldest") {
    return orderBy(publishedPosts, ["createdAt"], ["asc"]);
  }
  if (sortBy === "popular") {
    return orderBy(publishedPosts, ["totalViews"], ["desc"]);
  }
  return publishedPosts;
};

// ----------------------------------------------------------------------

export const applyListFilter = ({
  inputData,
  filters,
  sortBy,
}: {
  inputData: Post[];
  filters: { publish: string };
  sortBy: string;
}): Post[] => {
  const { publish } = filters;

  let data: SortablePost[] = inputData.map((post) => ({ ...post }));

  if (sortBy === "latest") {
    data = orderBy(data, ["createdAt"], ["desc"]);
  }

  if (sortBy === "oldest") {
    data = orderBy(data, ["createdAt"], ["asc"]);
  }

  if (sortBy === "popular") {
    data = orderBy(data, ["totalViews"], ["desc"]);
  }

  if (publish !== "all") {
    data = data.filter((post) => post.publish === publish);
  }

  return data;
};
