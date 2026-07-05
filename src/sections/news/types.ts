import type { Post } from "src/types/domain";

// ----------------------------------------------------------------------

/**
 * News рубрика (category) — a stable key, NOT a display string. Drives equality,
 * filtering, the colored Label and the derived-category mapping. The localized
 * label is resolved separately via `t("categories.<key>")` (message fragment
 * `messages/_fragments/news.json`), so switching locale never breaks matching.
 */
export type NewsCategory = "main" | "tech" | "science" | "politics" | "culture";

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

export interface NewsItemProps {
  item: NewsItem;
  /** "lead" = large hero card; "list" = compact row. */
  variant?: "lead" | "list";
}

export interface ThumbProps {
  item: NewsItem;
  ratio: "4/3" | "16/9";
  sx?: object;
}

export interface NewsListProps {
  posts: Post[];
}

export interface NewsSectionBarProps {
  /** Category keys to render, in display order — only ones with posts (+`main`). */
  categories: NewsCategory[];
  /** Currently selected category key — gets the filled, primary-colored treatment. */
  active: NewsCategory;
  /** Fired when a рубрика is clicked or activated via keyboard. */
  onSelect: (category: NewsCategory) => void;
}
