"use client";

import type { FinanceCoverage } from "src/types/finance";
import type { ImportFileOutcome } from "src/sections/finance/hooks/use-finance-import";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { UploadBox } from "src/components/upload";
import { ymLabel } from "src/sections/finance/utils";
import LinearProgress from "@mui/material/LinearProgress";

interface Props {
  coverage: FinanceCoverage[];
  importing: boolean;
  outcomes: ImportFileOutcome[];
  onDrop: (files: File[]) => void;
}

function outcomeLabel(outcome: ImportFileOutcome): string {
  if (outcome.error) {
    return outcome.error;
  }
  const parts = [`+${outcome.inserted} новых`, `дублей ${outcome.duplicates}`];
  if (outcome.badRows > 0) {
    parts.push(`битых строк ${outcome.badRows}`);
  }
  return parts.join(", ");
}

export function FinanceImportCard({
  coverage,
  importing,
  outcomes,
  onDrop,
}: Props) {
  return (
    <Card>
      <CardHeader
        title="Импорт выписок"
        subheader="Т-Банк: Операции → Выгрузить справку → CSV. Кодировка определится сама, дубликаты не задвоятся."
      />
      <Stack spacing={2} sx={{ p: 3 }}>
        <UploadBox
          multiple
          disabled={importing}
          onDrop={onDrop}
          onDropRejected={() =>
            toast.error("Это не CSV — нужна выгрузка операций из Т-Банка")
          }
          accept={{
            "text/csv": [".csv"],
            "application/vnd.ms-excel": [".csv"],
          }}
          sx={{ width: 1, height: 80 }}
          placeholder={
            <Stack
              alignItems="center"
              spacing={0.5}
              sx={{ color: "text.disabled" }}
            >
              <Iconify icon="eva:cloud-upload-fill" width={24} />
              <Typography variant="caption">
                Перетащи CSV-файлы или кликни
              </Typography>
            </Stack>
          }
        />
        {importing ? <LinearProgress /> : null}
        {outcomes.map((outcome) => (
          <Typography
            key={outcome.filename}
            variant="caption"
            sx={{ color: outcome.error ? "error.main" : "text.secondary" }}
          >
            {outcome.filename}: {outcomeLabel(outcome)}
          </Typography>
        ))}
        {coverage.length > 0 ? (
          <Box>
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Загруженные месяцы (операций):
            </Typography>
            <Box sx={{ mt: 0.75, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {coverage.map((month) => (
                <Chip
                  key={month.ym}
                  size="small"
                  label={`${ymLabel(month.ym)} · ${month.count}`}
                />
              ))}
            </Box>
          </Box>
        ) : null}
      </Stack>
    </Card>
  );
}
