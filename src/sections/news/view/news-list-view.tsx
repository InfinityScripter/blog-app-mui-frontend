"use client";

import type { Post } from "src/types/domain";

import { useMemo, useState } from "react";
import Container from "@mui/material/Container";
import { EmptyContent } from "src/components/empty-content";

import { NewsList } from "../news-list";
import { NewsSectionBar } from "../news-section-bar";
import { filterPostsByCategory, DEFAULT_NEWS_CATEGORY } from "../utils";

import type { NewsCategory } from "../types";

// ----------------------------------------------------------------------

interface NewsListViewProps {
  posts: Post[];
}

/**
 * The /news landing view: section header bar + editorial feed. Posts arrive
 * already filtered to tag='новости' and published by the backend (?tag=), so the
 * view only presents them and filters by рубрика client-side.
 */
export function NewsListView({ posts }: NewsListViewProps) {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(
    DEFAULT_NEWS_CATEGORY,
  );

  const filteredPosts = useMemo(
    () => filterPostsByCategory(posts, activeCategory),
    [posts, activeCategory],
  );

  // Only the per-рубрика empty state lives here; an entirely empty feed is
  // handled inside NewsList («Пока нет новостей»).
  const showCategoryEmptyState = posts.length > 0 && filteredPosts.length === 0;

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <NewsSectionBar active={activeCategory} onSelect={setActiveCategory} />

      {showCategoryEmptyState ? (
        <EmptyContent
          title="В этой рубрике пока нет материалов"
          sx={{ py: 10 }}
        />
      ) : (
        <NewsList posts={filteredPosts} />
      )}
    </Container>
  );
}
