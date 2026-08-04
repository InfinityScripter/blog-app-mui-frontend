"use client";

import type { FinanceBucket } from "src/types/finance";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import { FinanceCategoryRow } from "src/sections/finance/widgets/finance-category-row";

interface Props {
  buckets: FinanceBucket[];
  from: string | null;
  to: string | null;
}

export function FinanceCategoryList({ buckets, from, to }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxTotal = buckets.reduce(
    (acc, bucket) => Math.max(acc, bucket.total),
    0,
  );

  return (
    <Card>
      <CardHeader
        title="Куда уходят деньги"
        subheader="Категория раскрывает всех получателей, получатель — каждую операцию с датой"
      />
      <Stack spacing={0.5} sx={{ p: 3, pt: 2 }}>
        {buckets.map((bucket) => (
          <FinanceCategoryRow
            key={bucket.bucket}
            bucket={bucket}
            from={from}
            to={to}
            maxTotal={maxTotal}
            expanded={expanded === bucket.bucket}
            onToggle={() =>
              setExpanded(expanded === bucket.bucket ? null : bucket.bucket)
            }
          />
        ))}
      </Stack>
    </Card>
  );
}
