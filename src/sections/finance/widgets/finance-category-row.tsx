"use client";

import type { FinanceBucket, FinanceBucketOperation } from "src/types/finance";

import { useMemo } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { varAlpha } from "src/theme/styles";
import Collapse from "@mui/material/Collapse";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { FAMILY_BUCKET } from "src/sections/finance/const";
import { useGetFinanceOperations } from "src/actions/finance";
import { Amount } from "src/sections/finance/finance-privacy";
import { bucketIcon } from "src/sections/finance/category-icons";
import { FinanceMerchantRow } from "src/sections/finance/widgets/finance-merchant-row";

interface Props {
  bucket: FinanceBucket;
  maxTotal: number;
  from: string | null;
  to: string | null;
  expanded: boolean;
  onToggle: () => void;
}

export function FinanceCategoryRow({
  bucket,
  maxTotal,
  from,
  to,
  expanded,
  onToggle,
}: Props) {
  const isFamily = bucket.bucket === FAMILY_BUCKET;
  const { icon, color } = bucketIcon(bucket.bucket);
  const share =
    maxTotal > 0 ? Math.max(2, Math.round((bucket.total / maxTotal) * 100)) : 0;

  const { operations, operationsLoading } = useGetFinanceOperations(
    expanded ? bucket.bucket : null,
    { from: from ?? undefined, to: to ?? undefined },
  );

  // Сводка группирует получателей по имени в нижнем регистре — раскладываем
  // операции тем же ключом, иначе строка получателя останется пустой.
  const operationsByMerchant = useMemo(() => {
    const grouped = new Map<string, FinanceBucketOperation[]>();
    operations.forEach((operation) => {
      const key = operation.merchant.toLowerCase();
      const list = grouped.get(key);
      if (list) {
        list.push(operation);
      } else {
        grouped.set(key, [operation]);
      }
    });
    return grouped;
  }, [operations]);

  const panelId = `finance-bucket-${bucket.bucket.replace(/[^0-9a-zа-яё]+/gi, "-").toLowerCase()}`;

  return (
    <Box>
      <ButtonBase
        onClick={onToggle}
        aria-expanded={expanded}
        aria-controls={panelId}
        sx={{
          width: 1,
          px: 1,
          py: 0.75,
          display: "block",
          textAlign: "left",
          borderRadius: 1,
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25}>
          <Box
            sx={(theme) => ({
              width: 32,
              height: 32,
              flexShrink: 0,
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: `${color}.main`,
              bgcolor: varAlpha(theme.vars.palette[color].mainChannel, 0.12),
            })}
          >
            <Iconify icon={icon} width={18} />
          </Box>
          <Typography variant="body2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            {bucket.bucket}
          </Typography>
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
            <Amount value={bucket.total} />
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
          sx={{ mt: 0.75, height: 6, borderRadius: 1, bgcolor: "action.hover" }}
        >
          <Box
            sx={{
              height: 1,
              borderRadius: 1,
              width: `${share}%`,
              bgcolor: isFamily ? "grey.500" : `${color}.main`,
            }}
          />
        </Box>
      </ButtonBase>

      <Collapse id={panelId} in={expanded} unmountOnExit>
        <Stack spacing={0.25} sx={{ px: 1, pt: 0.5, pb: 1.5 }}>
          {isFamily ? (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Семейный контур: встречные поступления учтены в «Доходах по
              источникам», нетто близко к нулю.
            </Typography>
          ) : null}
          {bucket.merchants.map((merchant) => (
            <FinanceMerchantRow
              key={merchant.name}
              merchant={merchant}
              loading={operationsLoading}
              operations={
                operationsByMerchant.get(merchant.name.toLowerCase()) ?? []
              }
            />
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
