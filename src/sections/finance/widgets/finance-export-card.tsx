"use client";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import { toast } from "src/components/snackbar";
import { Iconify } from "src/components/iconify";
import CardHeader from "@mui/material/CardHeader";
import { fetchFinanceExport } from "src/actions/finance";
import { downloadBlob } from "src/sections/finance/utils";

interface Props {
  from: string | null;
  to: string | null;
}

type ExportKind = "csv" | "json" | "all";

export function FinanceExportCard({ from, to }: Props) {
  const [busy, setBusy] = useState<ExportKind | null>(null);

  const handleExport = async (kind: ExportKind) => {
    const format = kind === "json" ? "json" : "csv";
    const range =
      kind === "all" ? {} : { from: from ?? undefined, to: to ?? undefined };
    setBusy(kind);
    try {
      const blob = await fetchFinanceExport({ ...range, format });
      const name =
        kind === "all"
          ? `finance-all.${format}`
          : `finance-${from ?? "start"}-${to ?? "end"}.${format}`;
      downloadBlob(blob, name);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось выгрузить данные",
      );
    } finally {
      setBusy(null);
    }
  };

  return (
    <Card>
      <CardHeader
        title="Экспорт истории"
        subheader="CSV в формате Т-Банка + колонки категорий; его же можно импортировать обратно"
      />
      <Stack direction="row" spacing={1.5} flexWrap="wrap" sx={{ p: 3, pt: 2 }}>
        <Button
          size="small"
          variant="contained"
          disabled={busy !== null}
          onClick={() => handleExport("csv")}
          startIcon={<Iconify icon="solar:download-minimalistic-bold" />}
        >
          CSV за период
        </Button>
        <Button
          size="small"
          variant="outlined"
          disabled={busy !== null}
          onClick={() => handleExport("json")}
        >
          JSON за период
        </Button>
        <Button
          size="small"
          variant="text"
          disabled={busy !== null}
          onClick={() => handleExport("all")}
        >
          Вся история (CSV)
        </Button>
      </Stack>
    </Card>
  );
}
