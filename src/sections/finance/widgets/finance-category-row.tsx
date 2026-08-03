"use client";

import type { FinanceBucket } from "src/types/finance";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { fRub } from "src/sections/finance/utils";
import { FAMILY_BUCKET } from "src/sections/finance/const";

const VISIBLE_MERCHANTS = 8;

interface Props {
  bucket: FinanceBucket;
  maxTotal: number;
  expanded: boolean;
  onToggle: () => void;
}

export function FinanceCategoryRow({
  bucket,
  maxTotal,
  expanded,
  onToggle,
}: Props) {
  const isFamily = bucket.bucket === FAMILY_BUCKET;
  const share =
    maxTotal > 0 ? Math.max(2, Math.round((bucket.total / maxTotal) * 100)) : 0;
  const visible = bucket.merchants.slice(0, VISIBLE_MERCHANTS);
  const rest = bucket.merchants.slice(VISIBLE_MERCHANTS);
  const restTotal = rest.reduce((acc, merchant) => acc + merchant.total, 0);

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
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="body2" noWrap sx={{ flexGrow: 1, minWidth: 0 }}>
            {bucket.bucket}
          </Typography>
          <Typography variant="subtitle2" sx={{ whiteSpace: "nowrap" }}>
            {fRub(bucket.total)}
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
              bgcolor: isFamily ? "grey.500" : "primary.main",
            }}
          />
        </Box>
      </ButtonBase>
      <Collapse id={panelId} in={expanded} unmountOnExit>
        <Stack spacing={0.5} sx={{ px: 1, pt: 0.5, pb: 1.5 }}>
          {isFamily ? (
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Семейный контур: встречные поступления учтены в «Доходах по
              источникам», нетто близко к нулю.
            </Typography>
          ) : null}
          {visible.map((merchant) => (
            <Stack
              key={merchant.name}
              direction="row"
              spacing={2}
              justifyContent="space-between"
            >
              <Typography
                variant="body2"
                noWrap
                sx={{ color: "text.secondary", minWidth: 0 }}
              >
                {merchant.name}
                {merchant.count > 1 ? ` × ${merchant.count}` : ""}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
                {fRub(merchant.total)}
              </Typography>
            </Stack>
          ))}
          {rest.length > 0 ? (
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Typography variant="body2" sx={{ color: "text.disabled" }}>
                ещё {rest.length} мелких
              </Typography>
              <Typography variant="body2" sx={{ color: "text.disabled" }}>
                {fRub(restTotal)}
              </Typography>
            </Stack>
          ) : null}
        </Stack>
      </Collapse>
    </Box>
  );
}
