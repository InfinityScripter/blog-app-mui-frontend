import type { NewsCategory } from "./types";

// ----------------------------------------------------------------------

/** The tag the Telegram bot stamps on every news post; drives the /news feed. */
export const NEWS_TAG = "новости";

/** Рубрики shown in the section header bar, in display order. */
export const NEWS_CATEGORIES: NewsCategory[] = [
  "Главное",
  "Технологии",
  "Наука",
  "Политика",
  "Культура",
];

/**
 * Maps a known source-feed name (parsed from the post) to a рубрика. Anything
 * unmatched falls back to «Главное». Mirrors the bot's feed list.
 */
export const SOURCE_TO_CATEGORY: Record<string, NewsCategory> = {
  Meduza: "Главное",
  "N+1": "Наука",
  "3DNews": "Технологии",
  OpenNet: "Технологии",
};

/** Tag values (besides NEWS_TAG) that map directly to a рубрика, if present. */
export const TAG_TO_CATEGORY: Record<string, NewsCategory> = {
  технологии: "Технологии",
  tech: "Технологии",
  наука: "Наука",
  science: "Наука",
  политика: "Политика",
  культура: "Культура",
};
