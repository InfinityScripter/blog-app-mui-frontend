import type { Post } from "src/types/domain";
import type { LabelColor } from "src/components/label";

import { NEWS_CATEGORIES, TAG_TO_CATEGORY, SOURCE_TO_CATEGORY } from "./const";

import type { NewsItem, NewsCategory } from "./types";

// ----------------------------------------------------------------------

/** The default рубрика («Главное»): selected on load, shows every post. */
export const DEFAULT_NEWS_CATEGORY: NewsCategory = NEWS_CATEGORIES[0];

/** Maps a рубрика to a theme semantic color for its Label (never a hex). */
export function categoryColor(category: NewsCategory): LabelColor {
  switch (category) {
    case "Технологии":
      return "warning";
    case "Наука":
      return "success";
    case "Политика":
      return "info";
    case "Культура":
      return "secondary";
    case "Главное":
    default:
      return "info";
  }
}

/**
 * Parses the source feed name from the post body. The bot appends a line like
 * "Источник: Meduza" (optionally as a markdown link), so we read the text after
 * the last "Источник:". Returns null when absent.
 */
function deriveSource(post: Post): string | null {
  const content = post.content ?? "";
  const match = content.match(/Источник:\s*\[?([^\]\n(]+?)\]?\s*(?:\(|$|\n)/i);
  const raw = match?.[1]?.trim();
  return raw || null;
}

/**
 * Derives the рубрика for a post: an explicit рубрика tag wins, else the source
 * feed mapping, else «Главное».
 */
function deriveCategory(post: Post): NewsCategory {
  const tagged = (post.tags ?? [])
    .map((t) => TAG_TO_CATEGORY[t.toLowerCase()])
    .find(Boolean);
  if (tagged) return tagged;

  const source = deriveSource(post);
  if (source && SOURCE_TO_CATEGORY[source]) return SOURCE_TO_CATEGORY[source];

  return "Главное";
}

/** Builds a NewsItem (post + derived category + source) from a post. */
export function toNewsItem(post: Post): NewsItem {
  return {
    post,
    category: deriveCategory(post),
    source: deriveSource(post),
  };
}

/**
 * Filters posts to a рубрика. «Главное» (the default) keeps everything; any
 * other рубрика keeps posts whose derived category matches — the same mapping
 * that drives each card's Label, so the feed stays consistent with what's shown.
 */
export function filterPostsByCategory(
  posts: Post[],
  category: NewsCategory,
): Post[] {
  if (category === DEFAULT_NEWS_CATEGORY) return posts;
  return posts.filter((post) => deriveCategory(post) === category);
}

/**
 * The рубрики to actually show in the section bar: «Главное» (always — it's the
 * "all" tab) plus only those рубрики that have at least one matching post.
 * Empty рубрики aren't hardcoded into the bar — they simply don't appear.
 * Order follows NEWS_CATEGORIES.
 */
export function availableCategories(posts: Post[]): NewsCategory[] {
  const present = new Set(posts.map((post) => deriveCategory(post)));
  return NEWS_CATEGORIES.filter(
    (category) => category === DEFAULT_NEWS_CATEGORY || present.has(category),
  );
}
