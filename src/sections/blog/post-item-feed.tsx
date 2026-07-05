"use client";

import type { Theme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { paths } from "src/routes/paths";
import { useTranslations } from "next-intl";
import { Image } from "src/components/image";
import { fToNow } from "src/utils/format-time";
import { coverSrc } from "src/utils/cover-src";
import Typography from "@mui/material/Typography";
import { RouterLink } from "src/routes/components";
import { getReadingTime } from "src/utils/reading-time";
import { fShortenNumber } from "src/utils/format-number";
import { maxLine, hairline, monoValueSx } from "src/theme/styles";

import { MAX_TAGS } from "./const";
import { InfoBlock } from "./post-item-feed-info-block";
import { isTagActive, orderTagsByActive } from "./utils";

import type { PostItemFeedProps } from "./types";

// ----------------------------------------------------------------------

// Editorial Ink: строка ленты без карточки — hairline-линейка сверху, mono-мета,
// заголовок с vermilion-hover, маленькая обложка справа (скрыта на xs).
export function PostItemFeed({ post, activeTags = [] }: PostItemFeedProps) {
  const { title, coverUrl, createdAt, totalViews, description, tags, content } =
    post;

  const t = useTranslations("blog");
  const href = paths.post.details(post.id ?? "");
  const readingTime = getReadingTime(content);
  // Show the tag(s) the feed is filtered by first, so a matched post never
  // looks unrelated just because its matching tag fell past MAX_TAGS.
  const visibleTags = orderTagsByActive(tags ?? [], activeTags).slice(
    0,
    MAX_TAGS,
  );
  const cover = coverSrc(coverUrl, String(post._id ?? post.id ?? title));

  return (
    <Box
      sx={{
        py: 3,
        gap: 3,
        display: "flex",
        alignItems: "flex-start",
        borderTop: (theme: Theme) => hairline(theme),
      }}
    >
      <Stack spacing={1} sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box
          gap={1.5}
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          sx={{ ...monoValueSx, color: "text.disabled" }}
        >
          <Box component="span">{fToNow(createdAt)}</Box>
          <InfoBlock
            icon="solar:clock-circle-bold"
            value={t("readingTime", { minutes: readingTime })}
          />
          <InfoBlock icon="solar:eye-bold" value={fShortenNumber(totalViews)} />
        </Box>

        <Link
          component={RouterLink}
          href={href}
          color="inherit"
          underline="none"
          variant="h5"
          sx={{
            ...maxLine({ line: 2 }),
            transition: (theme: Theme) =>
              theme.transitions.create("color", {
                duration: theme.transitions.duration.shorter,
              }),
            "&:hover": { color: "primary.main" },
          }}
        >
          {title}
        </Link>

        <Typography
          variant="body2"
          sx={{ ...maxLine({ line: 2 }), color: "text.secondary" }}
        >
          {description}
        </Typography>

        {visibleTags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: 0.5 }}>
            {visibleTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                clickable
                component={RouterLink}
                href={paths.tag.details(tag)}
                color={isTagActive(tag, activeTags) ? "primary" : "default"}
              />
            ))}
          </Box>
        )}
      </Stack>

      <Box
        sx={{
          width: 168,
          height: 126,
          flexShrink: 0,
          display: { xs: "none", sm: "block" },
        }}
      >
        <Image alt={title} src={cover} sx={{ height: 1, borderRadius: 1.5 }} />
      </Box>
    </Box>
  );
}
