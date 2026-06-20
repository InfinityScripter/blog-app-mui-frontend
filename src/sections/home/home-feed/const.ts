// Curated filter tags for the landing feed. Posts are matched against these
// by case-insensitive label; tags on a post that aren't in this list simply
// don't get a filter chip (kept intentionally small, Habr/vc.ru style).
export const FEED_TAGS = [
  "AI/LLM",
  "Агенты",
  "Claude Code",
  "Промптинг",
  "Инструменты",
  "Проекты",
] as const;

export type FeedTag = (typeof FEED_TAGS)[number];

// News (bot-published, tag 'новости') lives only in /news — exclude it from the
// landing feed so each post appears in exactly one place.
export const EXCLUDED_NEWS_TAG = "новости";

// How many posts to show before the "Показать ещё" button; each click adds
// this many more. Not infinite scroll by design.
export const FEED_PAGE_SIZE = 10;

// Section copy.
export const FEED_TITLE = "Лента";
export const FEED_SUBTITLE = "Свежие разборы AI-инструментов, агентов и LLM";
export const FEED_EMPTY_TEXT = "Пока нет публикаций по выбранным темам.";
export const FEED_SHOW_MORE = "Показать ещё";
