"use client";

import type { Post } from "src/types/domain";

import Container from "@mui/material/Container";

import { NewsList } from "../news-list";
import { NewsSectionBar } from "../news-section-bar";

// ----------------------------------------------------------------------

interface NewsListViewProps {
  posts: Post[];
}

/**
 * The /news landing view: section header bar + editorial feed. Posts arrive
 * already filtered to tag='новости' and published by the backend (?tag=), so the
 * view only presents them.
 */
export function NewsListView({ posts }: NewsListViewProps) {
  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <NewsSectionBar />
      <NewsList posts={posts} />
    </Container>
  );
}
