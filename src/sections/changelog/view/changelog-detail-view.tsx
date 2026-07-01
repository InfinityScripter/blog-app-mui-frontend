"use client";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";

import { ReleaseHeader } from "../release-header";
import { ReleaseSource } from "../release-source";
import { ReleaseChanges } from "../release-changes";
import { ReleaseVerdict } from "../release-verdict";
import { ReleaseSpecChips } from "../release-spec-chips";

import type { ChangelogDetailViewProps } from "./types";

// ----------------------------------------------------------------------

/**
 * The /changelog/[slug] detail view: header + spec chips + changes list +
 * verdict callout + source link. Each block is its own sub-component to keep
 * this file thin; blocks self-hide when their data is absent.
 */
export function ChangelogDetailView({ release }: ChangelogDetailViewProps) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Stack spacing={4}>
        <ReleaseHeader release={release} />

        <ReleaseSpecChips release={release} />

        <Divider />

        <ReleaseChanges changes={release.changes} />

        <ReleaseVerdict verdict={release.verdict} />

        <ReleaseSource
          sourceUrl={release.sourceUrl}
          sourceName={release.sourceName}
        />
      </Stack>
    </Container>
  );
}
