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
import { maxLine, hairline, hoverLiftSx, monoValueSx } from "src/theme/styles";

import { MAX_TAGS } from "./const";
import { InfoBlock } from "./post-item-feed-info-block";

import type { PostItemFeedProps } from "./types";

// ----------------------------------------------------------------------

// Featured-строка ленты: широкая hairline-карточка, обложка слева, текст
// справа. Используется для самого свежего материала на главной.
export function PostItemFeedFeatured({ post }: PostItemFeedProps) {
  const { title, coverUrl, createdAt, totalViews, description, tags, content } =
    post;

  const t = useTranslations("blog");
  const href = paths.post.details(post.id ?? "");
  const readingTime = getReadingTime(content);
  const visibleTags = (tags ?? []).slice(0, MAX_TAGS);
  const cover = coverSrc(coverUrl, String(post._id ?? post.id ?? title));

  return (
    <Box
      sx={(theme: Theme) => ({
        display: "flex",
        overflow: "hidden",
        borderRadius: 2.5,
        bgcolor: "background.paper",
        border: hairline(theme),
        flexDirection: { xs: "column", md: "row" },
        ...hoverLiftSx(theme),
      })}
    >
      <Box sx={{ width: { xs: 1, md: "42%" }, flexShrink: 0 }}>
        <Image alt={title} src={cover} ratio="16/10" sx={{ height: 1 }} />
      </Box>

      <Stack spacing={1.5} sx={{ p: { xs: 3, md: 4 }, minWidth: 0 }}>
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
          variant="h3"
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
          variant="body1"
          sx={{ ...maxLine({ line: 3 }), color: "text.secondary" }}
        >
          {description}
        </Typography>

        {visibleTags.length > 0 && (
          <Box display="flex" flexWrap="wrap" gap={0.5} sx={{ mt: "auto" }}>
            {visibleTags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                variant="outlined"
                clickable
                component={RouterLink}
                href={paths.tag.details(tag)}
              />
            ))}
          </Box>
        )}
      </Stack>
    </Box>
  );
}
