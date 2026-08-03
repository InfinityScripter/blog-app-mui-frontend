import type { FinanceSummary } from "src/types/finance";

import Grid from "@mui/material/Grid";
import { fRubShort } from "src/sections/finance/utils";
import { FinanceKpi } from "src/sections/finance/widgets/finance-kpi";

export function FinanceKpiRow({ summary }: { summary: FinanceSummary }) {
  const { from, to } = summary.range;
  const monthsInRange = summary.months.filter(
    (month) =>
      from !== null && to !== null && month.ym >= from && month.ym <= to,
  );
  const monthCount = Math.max(monthsInRange.length, 1);
  const savedShare =
    summary.totals.income > 0
      ? Math.round((summary.totals.saved / summary.totals.income) * 100)
      : 0;
  const operationCount = summary.coverage.reduce(
    (acc, month) => acc + month.count,
    0,
  );

  const cells = [
    {
      label: "Доход в месяц",
      value: fRubShort(summary.totals.income / monthCount),
      hint: `за период ${fRubShort(summary.totals.income)}`,
    },
    {
      label: "Расход в месяц",
      value: fRubShort(summary.totals.expense / monthCount),
      hint: `за период ${fRubShort(summary.totals.expense)}`,
    },
    {
      label: "Отложено",
      value: fRubShort(summary.totals.saved),
      hint: `${savedShare}% дохода`,
    },
    {
      label: "Месяцев в периоде",
      value: String(monthsInRange.length),
      hint: `операций в базе: ${operationCount}`,
    },
  ];

  return (
    <Grid container spacing={3}>
      {cells.map((cell) => (
        <Grid key={cell.label} size={{ xs: 6, md: 3 }}>
          <FinanceKpi label={cell.label} value={cell.value} hint={cell.hint} />
        </Grid>
      ))}
    </Grid>
  );
}
