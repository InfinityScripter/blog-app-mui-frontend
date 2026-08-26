"use client";

import Stack from "@mui/material/Stack";
import { monoLabelSx } from "src/theme/styles";
import { toAppLocale } from "src/i18n/locales";
import { tagLabel } from "src/utils/tag-labels";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useLocale, useTranslations } from "next-intl";

import { PostList } from "../post-list";

import type { TagListViewProps } from "./types";

// ----------------------------------------------------------------------

// Tag archive: every published post carrying the exact tag. The tag is passed
// through activeTags so each card surfaces the matched tag first.
export function TagListView({ tag, posts }: TagListViewProps) {
  const t = useTranslations("blog");
  const locale = toAppLocale(useLocale());

  return (
    <Container>
      <Stack spacing={1} sx={{ my: { xs: 3, md: 5 } }}>
        <Typography component="p" sx={monoLabelSx}>
          {t("tag.overline")}
        </Typography>
        <Typography variant="h2" component="h1">
          {tagLabel(tag, locale)}
        </Typography>
      </Stack>

      {posts.length > 0 ? (
        <PostList posts={posts} activeTags={[tag]} />
      ) : (
        <Typography
          variant="body2"
          sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
        >
          {t("tag.empty")}
        </Typography>
      )}
    </Container>
  );
}
