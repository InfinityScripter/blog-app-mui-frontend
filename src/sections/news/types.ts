import type { Post } from "src/types/domain";

// ----------------------------------------------------------------------

/** News рубрика (category) — drives the colored Label on each card. */
export type NewsCategory =
  | "Главное"
  | "Технологии"
  | "Наука"
  | "Политика"
  | "Культура";

/**
 * A news item is a published post (tagged 'новости') enriched with a derived
 * рубрика and source. Both are computed in utils.ts from the post's tags /
 * content — the backend stores plain posts, not a separate news model.
 */
export interface NewsItem {
  post: Post;
  category: NewsCategory;
  source: string | null;
}
