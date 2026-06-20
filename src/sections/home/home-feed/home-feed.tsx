"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { useMemo, useState } from "react";
import Button from "@mui/material/Button";
import { useGetPosts } from "src/actions/blog";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { PostItemFeed } from "src/sections/blog/post-item-feed";

import { toggleTag, selectFeedPosts } from "./utils";
import {
  FEED_TAGS,
  FEED_TITLE,
  FEED_SUBTITLE,
  FEED_PAGE_SIZE,
  FEED_SHOW_MORE,
  FEED_EMPTY_TEXT,
  EXCLUDED_NEWS_TAG,
} from "./const";

import type { FeedTag } from "./const";

// ----------------------------------------------------------------------

export function HomeFeed() {
  const { posts, postsLoading } = useGetPosts({
    excludeTag: EXCLUDED_NEWS_TAG,
  });

  const [selectedTags, setSelectedTags] = useState<FeedTag[]>([]);
  const [visibleCount, setVisibleCount] = useState(FEED_PAGE_SIZE);

  const feedPosts = useMemo(
    () => selectFeedPosts(posts, selectedTags),
    [posts, selectedTags],
  );

  const visiblePosts = feedPosts.slice(0, visibleCount);
  const hasMore = feedPosts.length > visibleCount;

  const handleToggleTag = (tag: FeedTag) => {
    setSelectedTags((prev) => toggleTag(prev, tag, FEED_TAGS));
    setVisibleCount(FEED_PAGE_SIZE);
  };

  return (
    <Container component="section" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={1} sx={{ mb: 4, textAlign: "center" }}>
        <Typography variant="h3">{FEED_TITLE}</Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {FEED_SUBTITLE}
        </Typography>
      </Stack>

      <Box
        sx={{
          mb: 4,
          gap: 1,
          display: "flex",
          flexWrap: { xs: "nowrap", sm: "wrap" },
          overflowX: { xs: "auto", sm: "visible" },
          justifyContent: { sm: "center" },
          pb: { xs: 1, sm: 0 },
        }}
      >
        {FEED_TAGS.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() => handleToggleTag(tag)}
              color={active ? "primary" : "default"}
              variant={active ? "filled" : "outlined"}
              sx={{ flexShrink: 0, minHeight: 44 }}
            />
          );
        })}
      </Box>

      {!postsLoading && visiblePosts.length === 0 ? (
        <Typography
          variant="body2"
          sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
        >
          {FEED_EMPTY_TEXT}
        </Typography>
      ) : (
        <Stack spacing={2} sx={{ maxWidth: 720, mx: "auto" }}>
          {visiblePosts.map((post) => (
            <PostItemFeed key={post.id} post={post} />
          ))}
        </Stack>
      )}

      {hasMore && (
        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => setVisibleCount((c) => c + FEED_PAGE_SIZE)}
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          >
            {FEED_SHOW_MORE}
          </Button>
        </Box>
      )}
    </Container>
  );
}
