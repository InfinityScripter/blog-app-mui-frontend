import type { NewsCategory } from "./types";

// ----------------------------------------------------------------------

/** The tag the Telegram bot stamps on every news post; drives the /news feed. */
export const NEWS_TAG = "новости";

/**
 * Category keys shown in the section header bar, in display order. These are
 * stable internal identifiers; the localized рубрика labels come from
 * `t("categories.<key>")` in the components, never from these values.
 */
export const NEWS_CATEGORIES: NewsCategory[] = [
  "main",
  "tech",
  "science",
  "politics",
  "culture",
];

/**
 * Maps a known source-feed name (parsed from the post) to a category key.
 * Source names (Meduza, N+1, …) are proper nouns — they stay as-is and are the
 * lookup keys; only the mapped category is a key. Unmatched → `main`. Mirrors
 * the bot's feed list.
 */
export const SOURCE_TO_CATEGORY: Record<string, NewsCategory> = {
  Meduza: "main",
  "N+1": "science",
  "3DNews": "tech",
  OpenNet: "tech",
};

/**
 * Maps a topical tag (besides NEWS_TAG) to a category key. Tag keys stay
 * lowercase RU slugs to match the bot's whitelisted tag set: `новости` + 1-3 of
 * технологии, наука, политика, культура, ai, llm, агенты, нейросети,
 * безопасность, разработка, гаджеты, бизнес — these match backend data, so they
 * are NOT translated. Unmatched tags fall through to `main` (the catch-all).
 */
export const TAG_TO_CATEGORY: Record<string, NewsCategory> = {
  // → tech (tech umbrella: AI/LLM/agents/security/dev/gadgets all live here)
  технологии: "tech",
  ai: "tech",
  llm: "tech",
  агенты: "tech",
  нейросети: "tech",
  безопасность: "tech",
  разработка: "tech",
  гаджеты: "tech",
  // → science
  наука: "science",
  // → politics
  политика: "politics",
  // → culture (business reads closer to культура than to a science/tech rubric)
  культура: "culture",
  бизнес: "culture",
};
