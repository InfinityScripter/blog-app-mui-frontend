"use client";

import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { monoLabelSx } from "src/theme/styles";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

import { ReleaseCard } from "../release-card";

import type { ChangelogListViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /changelog landing view: a reverse-chronological list of AI model
 * releases. Releases arrive already fetched by the ISR page; this view only
 * orders (newest first by releasedAt) and presents them.
 */
export function ChangelogListView({ releases }: ChangelogListViewProps) {
  const t = useTranslations("changelog");

  const ordered = useMemo(
    () =>
      [...releases].sort((a, b) => {
        const aTime = a.releasedAt ? new Date(a.releasedAt).getTime() : 0;
        const bTime = b.releasedAt ? new Date(b.releasedAt).getTime() : 0;
        return bTime - aTime;
      }),
    [releases],
  );

  return (
    <Container sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 3, md: 5 } }}>
        <Typography component="p" sx={monoLabelSx}>
          {t("eyebrow")}
        </Typography>
        <Typography variant="h2" component="h1">
          {t("title")}
        </Typography>
      </Stack>

      {ordered.length > 0 ? (
        ordered.map((release) => (
          <ReleaseCard key={release.id} release={release} />
        ))
      ) : (
        <Typography
          variant="body2"
          sx={{ py: 6, textAlign: "center", color: "text.disabled" }}
        >
          {t("empty")}
        </Typography>
      )}
    </Container>
  );
}
