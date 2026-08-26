"use client";

import type { ListPostsResponse } from "src/types/api";

import { useState } from "react";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { toAppLocale } from "src/i18n/locales";
import { monoLabelSx } from "src/theme/styles";
import { tagLabel } from "src/utils/tag-labels";
import Container from "@mui/material/Container";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import { useLocale, useTranslations } from "next-intl";
import { PostItemFeed } from "src/sections/blog/post-item-feed";
import { PostItemFeedFeatured } from "src/sections/blog/post-item-feed-featured";

import { toggleTag } from "./utils";
import { FEED_SENTINEL_PRELOAD } from "./const";
import { useFeedTags } from "./hooks/use-feed-tags";
import { useFeedPosts } from "./hooks/use-feed-posts";
import { useFeedInfiniteScroll } from "./hooks/use-feed-infinite-scroll";

// ----------------------------------------------------------------------

interface HomeFeedProps {
  /** Server-rendered first page of posts; seeds SWR so the feed is crawlable. */
  initialPosts?: ListPostsResponse;
  /**
   * Tag vocabulary ranked server-side over the whole corpus. The feed itself
   * only holds the pages it has loaded, so the chips can't be derived from it.
   */
  feedTags?: string[];
}

export function HomeFeed({ initialPosts, feedTags }: HomeFeedProps) {
  const t = useTranslations("home");
  const locale = toAppLocale(useLocale());

  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Лента — общая: показывает ВСЕ опубликованные посты (и новости, и блог) от
  // новых к старым. Разделение по типу живёт на /news и /post, не здесь.
  const { posts, loading, hasMore, loadMore, resetPaging } = useFeedPosts({
    selectedTags,
    initialPage: initialPosts,
  });

  const visibleTags = useFeedTags(posts, {
    pinned: selectedTags,
    ranked: feedTags,
  });

  // Featured-слот — только в неотфильтрованной ленте: при активном фильтре
  // список должен читаться однородно.
  const showFeatured = selectedTags.length === 0 && posts.length > 0;
  const featured = showFeatured ? posts[0] : undefined;
  const restPosts = showFeatured ? posts.slice(1) : posts;

  const { sentinelRef } = useFeedInfiniteScroll({
    hasMore,
    onLoadMore: loadMore,
    // Кол-во загруженных постов: меняется, когда порция приехала, — этим
    // observer переподписывается и заново эмитит текущее пересечение.
    resetKey: posts.length,
  });

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => toggleTag(prev, tag));
    resetPaging();
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

      {visibleTags.length > 0 && (
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
          {visibleTags.map((tag) => {
            const active = selectedTags.includes(tag);
            return (
              <Chip
                key={tag}
                label={tagLabel(tag, locale)}
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

      {!loading && posts.length === 0 ? (
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
