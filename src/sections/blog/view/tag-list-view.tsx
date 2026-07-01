"use client";

import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { PostList } from "../post-list";

import type { TagListViewProps } from "./types";

// ----------------------------------------------------------------------

// Tag archive: every published post carrying the exact tag. The tag is passed
// through activeTags so each card surfaces the matched tag first.
export function TagListView({ tag, posts }: TagListViewProps) {
  return (
    <Container>
      <Typography variant="h4" sx={{ my: { xs: 3, md: 5 } }}>
        {`Тег: ${tag}`}
      </Typography>

      {posts.length > 0 ? (
        <PostList posts={posts} activeTags={[tag]} />
      ) : (
        <Typography
          variant="body2"
          sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
        >
          По этому тегу пока нет постов.
        </Typography>
      )}
    </Container>
  );
}
