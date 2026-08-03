"use client";

import type { FinanceRange } from "src/actions/finance";

import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { useState, useCallback } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { fRubShort } from "src/sections/finance/utils";
import { useGetFinanceSummary } from "src/actions/finance";
import { FinanceKpiRow } from "src/sections/finance/widgets/finance-kpi-row";
import { useFinanceImport } from "src/sections/finance/hooks/use-finance-import";
import { FinanceImportCard } from "src/sections/finance/widgets/finance-import-card";
import { FinanceExportCard } from "src/sections/finance/widgets/finance-export-card";
import { FinanceIncomeCard } from "src/sections/finance/widgets/finance-income-card";
import { FinanceRangeSelect } from "src/sections/finance/widgets/finance-range-select";
import { FinanceCategoryList } from "src/sections/finance/widgets/finance-category-list";
import { FinanceMonthlyChart } from "src/sections/finance/widgets/finance-monthly-chart";
import { FinanceSubscriptionsCard } from "src/sections/finance/widgets/finance-subscriptions-card";

export function FinanceView() {
  const [range, setRange] = useState<FinanceRange>({});
  const { summary, summaryLoading, summaryError, summaryMutate } =
    useGetFinanceSummary(range);
  const refresh = useCallback(() => {
    summaryMutate();
  }, [summaryMutate]);
  const { importing, outcomes, importFiles } = useFinanceImport(refresh);

  const months = summary?.months ?? [];
  const hasData = months.length > 0;
  const effectiveFrom = range.from ?? summary?.range.from ?? null;
  const effectiveTo = range.to ?? summary?.range.to ?? null;

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 1 }}>
        Финансы
      </Typography>
      <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
        Личный учёт по выпискам Т-Банка: доходы, расходы по категориям,
        регулярные платежи. Страница видна только администратору.
      </Typography>
      {summaryError ? (
        <Typography sx={{ color: "error.main", mb: 3 }}>
          Не удалось загрузить данные.
        </Typography>
      ) : null}
      {summaryLoading && !summary ? <Typography>Загрузка…</Typography> : null}
      {summary ? (
        <Stack spacing={3}>
          {hasData ? (
            <Stack
              spacing={2}
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ sm: "center" }}
              justifyContent="space-between"
            >
              <FinanceRangeSelect
                months={months.map((month) => month.ym)}
                from={effectiveFrom ?? ""}
                to={effectiveTo ?? ""}
                onChange={(from, to) => setRange({ from, to })}
              />
              <Typography variant="caption" sx={{ color: "text.disabled" }}>
                Внутренних переливов за период:{" "}
                {fRubShort(summary.internalVolume + summary.washVolume)} — они
                не считаются ни доходом, ни расходом
              </Typography>
            </Stack>
          ) : null}
          {hasData ? <FinanceKpiRow summary={summary} /> : null}
          {hasData ? <FinanceMonthlyChart months={months} /> : null}
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 7 }}>
              {hasData ? (
                <FinanceCategoryList buckets={summary.buckets} />
              ) : (
                <Typography sx={{ color: "text.secondary" }}>
                  Пока пусто. Загрузи первую CSV-выписку из Т-Банка — и здесь
                  появятся графики, категории и регулярные платежи.
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <Stack spacing={3}>
                <FinanceImportCard
                  coverage={summary.coverage}
                  importing={importing}
                  outcomes={outcomes}
                  onDrop={importFiles}
                />
                {hasData ? (
                  <FinanceIncomeCard sources={summary.incomeBySource} />
                ) : null}
                {hasData ? (
                  <FinanceSubscriptionsCard
                    subscriptions={summary.subscriptions}
                  />
                ) : null}
                {hasData ? (
                  <FinanceExportCard from={effectiveFrom} to={effectiveTo} />
                ) : null}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      ) : null}
    </Container>
  );
}
