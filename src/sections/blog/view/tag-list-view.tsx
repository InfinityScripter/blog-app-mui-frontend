"use client";

import Stack from "@mui/material/Stack";
import { monoLabelSx } from "src/theme/styles";
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
      <Stack spacing={1} sx={{ my: { xs: 3, md: 5 } }}>
        <Typography component="p" sx={monoLabelSx}>
          Тег
        </Typography>
        <Typography variant="h2" component="h1">
          {tag}
        </Typography>
      </Stack>

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
