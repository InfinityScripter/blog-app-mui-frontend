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
  /** Рубрики to render, in display order — only ones that have posts (+«Главное»). */
  categories: NewsCategory[];
  /** Currently selected рубрика — gets the filled, primary-colored treatment. */
  active: NewsCategory;
  /** Fired when a рубрика is clicked or activated via keyboard. */
  onSelect: (category: NewsCategory) => void;
}
