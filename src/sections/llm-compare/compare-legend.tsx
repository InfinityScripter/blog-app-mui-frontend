"use client";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";

import { BENCHMARK_COLUMNS } from "./const";

// ----------------------------------------------------------------------

/**
 * Methodology legend under the matrix: what each benchmark column measures
 * (with a link to the benchmark's canonical page) and where the numbers come
 * from. Duplicates the header tooltips on purpose — tooltips are hover-only
 * and invisible on touch devices, while provenance must always be readable.
 */
export function CompareLegend() {
  const t = useTranslations("llmCompare");

  return (
    <Box
      sx={{
        mt: 4,
        p: { xs: 2, md: 3 },
        borderRadius: 2,
        bgcolor: "background.neutral",
      }}
    >
      <Typography variant="subtitle2" component="h2" sx={{ mb: 1.5 }}>
        {t("legend.title")}
      </Typography>

      <Stack spacing={1} sx={{ mb: 2 }}>
        {BENCHMARK_COLUMNS.map((col) => (
          <Typography
            key={col.key}
            variant="body2"
            sx={{ color: "text.secondary" }}
          >
            <Box
              component="span"
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              {col.fullLabel}
            </Box>
            {" — "}
            {t(`benchmarks.${col.key}.hint`)}{" "}
            <Link
              href={col.infoUrl}
              target="_blank"
              rel="noopener"
              sx={{ whiteSpace: "nowrap" }}
            >
              {t("legend.aboutLink")}
              <Iconify
                icon="eva:external-link-fill"
                width={12}
                sx={{ ml: 0.25, verticalAlign: "-1px" }}
              />
            </Link>
          </Typography>
        ))}
      </Stack>

      <Typography
        variant="caption"
        sx={{ color: "text.disabled", display: "block" }}
      >
        {t("legend.sources")}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "text.disabled", display: "block" }}
      >
        {t("legend.noData")}
      </Typography>
    </Box>
  );
}
