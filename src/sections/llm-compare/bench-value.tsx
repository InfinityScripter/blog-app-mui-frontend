"use client";

import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import { useTranslations } from "next-intl";

import { formatBench } from "./utils";

import type { BenchmarkScore } from "./types";

// ----------------------------------------------------------------------

interface BenchValueProps {
  score: BenchmarkScore | null | undefined;
}

/**
 * A benchmark value cell. When the score carries its own `sourceUrl` (the
 * measurement lives in a specific publication, e.g. a system-card PDF), the
 * number renders as a dotted-underline link straight to that document — so
 * «where is this figure from?» is answered in one click. Otherwise plain text.
 */
export function BenchValue({ score }: BenchValueProps) {
  const t = useTranslations("llmCompare");
  const text = formatBench(score);
  if (!score?.sourceUrl || text === "—") return text;

  return (
    <Tooltip title={t("labels.benchSourceTooltip")} arrow placement="top">
      <Link
        href={score.sourceUrl}
        target="_blank"
        rel="noopener"
        color="inherit"
        underline="always"
        aria-label={`${text} — ${t("labels.benchSourceTooltip")}`}
        sx={{
          textDecorationStyle: "dotted",
          textDecorationColor: (theme) => theme.palette.text.disabled,
          textUnderlineOffset: "3px",
        }}
      >
        {text}
      </Link>
    </Tooltip>
  );
}
