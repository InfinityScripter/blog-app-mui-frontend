"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

import { formatPercent, usageSeverity } from "../utils";

import type { MetricDetailRow } from "../types";

interface UsageGaugeCardProps {
  title: string;
  percent: number | null;
  details: MetricDetailRow[];
}

// Карточка занятости ресурса: крупный процент, полоса с порогами
// (зелёный → оранжевый → красный) и строки деталей под ней.
export function UsageGaugeCard({
  title,
  percent,
  details,
}: UsageGaugeCardProps) {
  const severity = usageSeverity(percent);

  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="baseline"
          justifyContent="space-between"
        >
          <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
            {title}
          </Typography>
          <Typography
            variant="h3"
            sx={{ lineHeight: 1, color: `${severity}.main` }}
          >
            {formatPercent(percent)}
          </Typography>
        </Stack>

        <LinearProgress
          variant="determinate"
          value={Math.min(percent ?? 0, 100)}
          color={severity}
          sx={{ height: 8, borderRadius: 1 }}
        />

        <Stack spacing={1}>
          {details.map((row) => (
            <Box
              key={row.label}
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {row.label}
              </Typography>
              <Typography variant="body2" sx={{ textAlign: "right" }}>
                {row.value}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}
