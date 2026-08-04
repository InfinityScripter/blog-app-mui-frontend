"use client";

import type { FinanceIncomeSource } from "src/types/finance";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import Collapse from "@mui/material/Collapse";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { useGetFinanceOperations } from "src/actions/finance";
import { Amount } from "src/sections/finance/finance-privacy";
import { incomeIcon } from "src/sections/finance/category-icons";
import { groupOperationsByMerchant } from "src/sections/finance/utils";
import { FinanceMerchantRow } from "src/sections/finance/widgets/finance-merchant-row";

interface Props {
  source: FinanceIncomeSource;
  maxTotal: number;
  from: string | null;
  to: string | null;
  expanded: boolean;
  onToggle: () => void;
}

export function FinanceIncomeSourceRow({
  source,
  maxTotal,
  from,
  to,
  expanded,
  onToggle,
}: Props) {
  const { icon, color } = incomeIcon(source.source);
  const share =
    maxTotal > 0 ? Math.max(2, Math.round((source.total / maxTotal) * 100)) : 0;

  const { operations, operationsLoading } = useGetFinanceOperations(
    expanded ? { source: source.source } : null,
    { from: from ?? undefined, to: to ?? undefined },
  );

  const operationsByPayer = useMemo(
    () => groupOperationsByMerchant(operations),
    [operations],
  );

  const panelId = `finance-source-${source.source.replace(/[^0-9a-zа-яё]+/gi, "-").toLowerCase()}`;

  return (
    <Box>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        sx={{
          width: 1,
          px: 1,
          py: 0.5,
          display: "block",
          textAlign: "left",
          borderRadius: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
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
              bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.12),
            })}
          >
            <Iconify icon={icon} width={16} />
          </Box>
          <Typography variant="body2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            {source.source}
          </Typography>
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
            <Amount value={source.total} />
          </Typography>
          <Iconify
            width={16}
            sx={{ color: "text.disabled", flexShrink: 0 }}
            icon={
              expanded
                ? "eva:arrow-ios-upward-fill"
                : "eva:arrow-ios-downward-fill"
            }
          />
        </Stack>
        <Box
          sx={{ mt: 0.5, height: 4, borderRadius: 1, bgcolor: "action.hover" }}
        >
          <Box
            sx={{
              height: 1,
              borderRadius: 1,
              width: `${share}%`,
              bgcolor: `${color}.main`,
            }}
          />
        </Box>
      </ButtonBase>

      <Collapse id={panelId} in={expanded} unmountOnExit>
        <Stack spacing={0.25} sx={{ px: 1, pt: 0.5, pb: 1 }}>
          {source.payers.map((payer) => (
            <FinanceMerchantRow
              key={payer.name}
              flow="income"
              merchant={payer}
              loading={operationsLoading}
              operations={operationsByPayer.get(payer.name.toLowerCase()) ?? []}
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
