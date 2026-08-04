"use client";

import type { FinanceIncomeSource } from "src/types/finance";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import { FinanceIncomeSourceRow } from "src/sections/finance/widgets/finance-income-source-row";

interface Props {
  sources: FinanceIncomeSource[];
  from: string | null;
  to: string | null;
}

export function FinanceIncomeCard({ sources, from, to }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxTotal = sources.reduce(
    (acc, source) => Math.max(acc, source.total),
    0,
  );

  return (
    <Card>
      <CardHeader
        title="Доходы по источникам"
        subheader="Источник раскрывает всех плательщиков, плательщик — каждое поступление"
      />
      <Stack spacing={0.5} sx={{ p: 3, pt: 2 }}>
        {sources.map((source) => (
          <FinanceIncomeSourceRow
            key={source.source}
            source={source}
            from={from}
            to={to}
            maxTotal={maxTotal}
            expanded={expanded === source.source}
            onToggle={() =>
              setExpanded(expanded === source.source ? null : source.source)
            }
          />
        ))}
      </Stack>
    </Card>
  );
}
