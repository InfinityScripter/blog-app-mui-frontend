import type { FinanceIncomeSource } from "src/types/finance";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { fRub } from "src/sections/finance/utils";

export function FinanceIncomeCard({
  sources,
}: {
  sources: FinanceIncomeSource[];
}) {
  const maxTotal = sources.reduce(
    (acc, source) => Math.max(acc, source.total),
    0,
  );

  return (
    <Card>
      <CardHeader title="Доходы по источникам" />
      <Stack spacing={1.25} sx={{ p: 3, pt: 2 }}>
        {sources.map((source) => (
          <Box key={source.source}>
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" noWrap sx={{ minWidth: 0 }}>
                {source.source}
              </Typography>
              <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
                {fRub(source.total)}
              </Typography>
            </Stack>
            <Box
              sx={{
                mt: 0.5,
                height: 4,
                borderRadius: 1,
                bgcolor: "action.hover",
              }}
            >
              <Box
                sx={{
                  height: 1,
                  borderRadius: 1,
                  bgcolor: "success.main",
                  width: `${maxTotal > 0 ? Math.max(2, Math.round((source.total / maxTotal) * 100)) : 0}%`,
                }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}
