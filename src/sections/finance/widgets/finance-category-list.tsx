"use client";

import type { FinanceBucket } from "src/types/finance";

import { useState } from "react";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import CardHeader from "@mui/material/CardHeader";
import { FinanceCategoryRow } from "src/sections/finance/widgets/finance-category-row";

export function FinanceCategoryList({ buckets }: { buckets: FinanceBucket[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const maxTotal = buckets.reduce(
    (acc, bucket) => Math.max(acc, bucket.total),
    0,
  );

  return (
    <Card>
      <CardHeader
        title="Куда уходят деньги"
        subheader="Клик по категории раскрывает магазины и получателей"
      />
      <Stack spacing={0.5} sx={{ p: 3, pt: 2 }}>
        {buckets.map((bucket) => (
          <FinanceCategoryRow
            key={bucket.bucket}
            bucket={bucket}
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
