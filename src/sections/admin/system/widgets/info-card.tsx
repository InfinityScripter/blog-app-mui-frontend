"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import type { MetricDetailRow } from "../types";

interface InfoCardProps {
  title: string;
  rows: MetricDetailRow[];
}

// Информационная карточка «label → value» (система, процесс, БД).
export function InfoCard({ title, rows }: InfoCardProps) {
  return (
    <Card sx={{ p: 3, height: 1 }}>
      <Typography variant="subtitle2" sx={{ color: "text.secondary", mb: 2 }}>
        {title}
      </Typography>
      <Stack spacing={1.25}>
        {rows.map((row) => (
          <Box
            key={row.label}
            sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
          >
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", flexShrink: 0 }}
            >
              {row.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{ textAlign: "right", wordBreak: "break-word" }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
