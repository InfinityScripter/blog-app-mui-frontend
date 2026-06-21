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

/**
 * Maps a topical tag (besides NEWS_TAG) to a рубрика. Keys are lowercase to
 * match the bot's whitelisted tag set: `новости` + 1-3 of технологии, наука,
 * политика, культура, ai, llm, агенты, нейросети, безопасность, разработка,
 * гаджеты, бизнес. Unmatched tags fall through to «Главное» (the catch-all).
 */
export const TAG_TO_CATEGORY: Record<string, NewsCategory> = {
  // → Технологии (tech umbrella: AI/LLM/agents/security/dev/gadgets all live here)
  технологии: "Технологии",
  ai: "Технологии",
  llm: "Технологии",
  агенты: "Технологии",
  нейросети: "Технологии",
  безопасность: "Технологии",
  разработка: "Технологии",
  гаджеты: "Технологии",
  // → Наука
  наука: "Наука",
  // → Политика
  политика: "Политика",
  // → Культура (business reads closer to культура than to a science/tech rubric)
  культура: "Культура",
  бизнес: "Культура",
};
