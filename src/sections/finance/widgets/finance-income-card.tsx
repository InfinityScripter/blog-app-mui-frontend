import type { FinanceIncomeSource } from "src/types/finance";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import CardHeader from "@mui/material/CardHeader";
import { Amount } from "src/sections/finance/finance-privacy";
import { incomeIcon } from "src/sections/finance/category-icons";

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
        {sources.map((source) => {
          const { icon, color } = incomeIcon(source.source);

          return (
            <Box key={source.source}>
              <Stack direction="row" spacing={1.25} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: `${color}.main`,
                    bgcolor: varAlpha(
                      theme.vars.palette[color].mainChannel,
                      0.12,
                    ),
                  })}
                >
                  <Iconify icon={icon} width={16} />
                </Box>
                <Typography
                  variant="body2"
                  noWrap
                  sx={{ flexGrow: 1, minWidth: 0 }}
                >
                  {source.source}
                </Typography>
                <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
                  <Amount value={source.total} />
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
          );
        })}
      </Stack>
    </Card>
  );
}
