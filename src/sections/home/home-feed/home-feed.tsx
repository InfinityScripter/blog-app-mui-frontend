"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { useTranslations } from "next-intl";
import { useGetPosts } from "src/actions/blog";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { useMemo, useState, useCallback } from "react";
import { PostItemFeed } from "src/sections/blog/post-item-feed";
import { PostItemFeedFeatured } from "src/sections/blog/post-item-feed-featured";

import { useFeedTags } from "./hooks/use-feed-tags";
import { toggleTag, selectFeedPosts } from "./utils";
import { FEED_PAGE_SIZE, FEED_SENTINEL_PRELOAD } from "./const";
import { useFeedInfiniteScroll } from "./hooks/use-feed-infinite-scroll";

// ----------------------------------------------------------------------

export function HomeFeed() {
  const t = useTranslations("home");

  // Лента — общая: показывает ВСЕ опубликованные посты (и новости, и блог) от
  // новых к старым. Разделение по типу живёт на /news и /post, не здесь.
  const { posts, postsLoading } = useGetPosts();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const feedTags = useFeedTags(posts, { pinned: selectedTags });
  const [visibleCount, setVisibleCount] = useState(FEED_PAGE_SIZE);

  const feedPosts = useMemo(
    () => selectFeedPosts(posts, selectedTags),
    [posts, selectedTags],
  );

  const visiblePosts = feedPosts.slice(0, visibleCount);
  // Featured-слот — только в неотфильтрованной ленте: при активном фильтре
  // список должен читаться однородно.
  const showFeatured = selectedTags.length === 0 && visiblePosts.length > 0;
  const featured = showFeatured ? visiblePosts[0] : undefined;
  const restPosts = showFeatured ? visiblePosts.slice(1) : visiblePosts;
  const hasMore = feedPosts.length > visibleCount;

  // Reveal the next page — same action for the scroll sentinel and the fallback
  // button. Stable identity so the observer effect doesn't re-run each render.
  const loadMore = useCallback(
    () => setVisibleCount((c) => c + FEED_PAGE_SIZE),
    [],
  );
  const { sentinelRef } = useFeedInfiniteScroll({
    hasMore,
    onLoadMore: loadMore,
    resetKey: visibleCount,
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => toggleTag(prev, tag));
    setVisibleCount(FEED_PAGE_SIZE);
  };

  return (
    <Container component="section" id="feed" sx={{ py: { xs: 6, md: 10 } }}>
      <Stack spacing={1} sx={{ mb: 4, alignItems: "flex-start" }}>
        <Typography component="p" sx={monoLabelSx}>
          {t("feed.overline")}
        </Typography>
        <Typography variant="h2" component="h2">
          {t("feed.title")}
        </Typography>
        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {t("feed.subtitle")}
        </Typography>
      </Stack>

      {feedTags.length > 0 && (
        <Box
          sx={{
            mb: 5,
            gap: 1,
            display: "flex",
            flexWrap: { xs: "nowrap", sm: "wrap" },
            overflowX: { xs: "auto", sm: "visible" },
            pb: { xs: 1, sm: 0 },
          }}
        >
          {feedTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Chip
                key={tag}
                label={tag}
                clickable
                onClick={() => handleToggleTag(tag)}
                color={active ? "primary" : "default"}
                variant="outlined"
                sx={{ flexShrink: 0, minHeight: 44 }}
              />
            );
          })}
        </Box>
      )}

      {!postsLoading && visiblePosts.length === 0 ? (
        <Typography variant="body2" sx={{ py: 6, color: "text.disabled" }}>
          {t("feed.empty")}
        </Typography>
      ) : (
        <Stack sx={{ maxWidth: 860 }}>
          {featured && (
            <Box sx={{ mb: 4 }}>
              <PostItemFeedFeatured post={featured} />
            </Box>
          )}
          {restPosts.map((post) => (
            <PostItemFeed key={post.id} post={post} activeTags={selectedTags} />
          ))}
        </Stack>
      )}

      {hasMore && (
        <Box sx={{ mt: 5, position: "relative" }}>
          {/* Кнопка — fallback (клавиатура, screen-reader, браузер без observer).
              Sentinel — невидимый маркер, растянутый вверх на preload-высоту от
              кнопки: как только его верх входит во viewport (+rootMargin), лента
              автоматически раскрывает следующую порцию. position:absolute, чтобы
              он не влиял на поток и его высота задавала зону упреждения. */}
          <Box
            ref={sentinelRef}
            aria-hidden
            sx={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: FEED_SENTINEL_PRELOAD,
              pointerEvents: "none",
            }}
          />
          <Box sx={{ display: "flex" }}>
            <Button
              size="large"
              variant="outlined"
              color="inherit"
              onClick={loadMore}
              endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              {t("feed.showMore")}
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}
