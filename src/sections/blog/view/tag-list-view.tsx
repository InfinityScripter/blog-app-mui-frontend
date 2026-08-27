"use client";

import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import { tagLabel } from "src/utils/tag-labels";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useAppLocale } from "src/hooks/use-app-locale";

import { PostList } from "../post-list";

import type { TagListViewProps } from "./types";

// ----------------------------------------------------------------------

// Tag archive: every published post carrying the exact tag. The tag is passed
// through activeTags so each card surfaces the matched tag first.
export function TagListView({ tag, posts }: TagListViewProps) {
  const t = useTranslations("blog");
  const locale = useAppLocale();

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
