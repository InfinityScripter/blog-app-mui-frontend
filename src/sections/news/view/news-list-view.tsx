"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Container from "@mui/material/Container";
import { EmptyContent } from "src/components/empty-content";

import { NewsList } from "../news-list";
import { NewsSectionBar } from "../news-section-bar";
import {
  availableCategories,
  filterPostsByCategory,
  DEFAULT_NEWS_CATEGORY,
} from "../utils";

import type { NewsCategory } from "../types";
import type { NewsListViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /news landing view: section header bar + editorial feed. Posts arrive
 * already filtered to tag='новости' and published by the backend (?tag=), so the
 * view only presents them and filters by рубрика client-side.
 */
export function NewsListView({ posts }: NewsListViewProps) {
  const t = useTranslations("news");
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(
    DEFAULT_NEWS_CATEGORY,
  );

  // Only рубрики that actually have posts are shown (+«Главное»). If the active
  // one isn't among them (e.g. its last post was removed), fall back to «Главное».
  const categories = useMemo(() => availableCategories(posts), [posts]);

  const safeActive = categories.includes(activeCategory)
    ? activeCategory
    : DEFAULT_NEWS_CATEGORY;

  const filteredPosts = useMemo(
    () => filterPostsByCategory(posts, safeActive),
    [posts, safeActive],
  );

  // Only the per-рубрика empty state lives here; an entirely empty feed is
  // handled inside NewsList («Пока нет новостей»).
  const showCategoryEmptyState = posts.length > 0 && filteredPosts.length === 0;

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <NewsSectionBar
        categories={categories}
        active={safeActive}
        onSelect={setActiveCategory}
      />

      {showCategoryEmptyState ? (
        <EmptyContent title={t("empty.categoryTitle")} sx={{ py: 10 }} />
      ) : (
        <NewsList posts={filteredPosts} />
      )}
    </Container>
  );
}
