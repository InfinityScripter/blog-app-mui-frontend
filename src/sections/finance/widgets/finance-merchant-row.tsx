"use client";

import type {
  FinanceMerchant,
  FinanceBucketOperation,
} from "src/types/finance";

import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import { Iconify } from "src/components/iconify";
import Typography from "@mui/material/Typography";
import ButtonBase from "@mui/material/ButtonBase";
import { fOpDate } from "src/sections/finance/utils";
import { Amount } from "src/sections/finance/finance-privacy";

interface Props {
  merchant: FinanceMerchant;
  operations: FinanceBucketOperation[];
  loading: boolean;
  flow: "expense" | "income";
}

export function FinanceMerchantRow({
  merchant,
  operations,
  loading,
  flow,
}: Props) {
  const [open, setOpen] = useState(false);
  const isExpense = flow === "expense";

  return (
    <Box>
      <ButtonBase
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        sx={{
          width: 1,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          textAlign: "left",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: 1 }}
        >
          <Iconify
            width={14}
            icon={
              open
                ? "eva:arrow-ios-downward-fill"
                : "eva:arrow-ios-forward-fill"
            }
            sx={{ color: "text.disabled", flexShrink: 0 }}
          />
          <Typography
            variant="body2"
            noWrap
            sx={{ color: "text.secondary", flexGrow: 1, minWidth: 0 }}
          >
            {merchant.name}
            {merchant.count > 1 ? ` × ${merchant.count}` : ""}
          </Typography>
          <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>
            <Amount value={merchant.total} />
          </Typography>
        </Stack>
      </ButtonBase>

      <Collapse in={open} unmountOnExit>
        <Stack spacing={0.25} sx={{ pl: 3.5, pr: 1, py: 0.5 }}>
          {loading && operations.length === 0 ? (
            <Typography variant="caption" sx={{ color: "text.disabled" }}>
              Загружаю операции…
            </Typography>
          ) : null}
          {operations.map((operation) => (
            <Stack
              key={operation.id}
              direction="row"
              spacing={2}
              justifyContent="space-between"
            >
              <Typography
                variant="caption"
                noWrap
                sx={{ color: "text.disabled", minWidth: 0 }}
              >
                {fOpDate(operation.opAt)} · {operation.description}
                {operation.card ? ` · ${operation.card}` : ""}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  whiteSpace: "nowrap",
                  // Возврат приходит в той же категории положительной суммой:
                  // в списке трат это минус, и он подсвечен зелёным.
                  color:
                    isExpense && operation.amount > 0
                      ? "success.main"
                      : "text.secondary",
                }}
              >
                <Amount
                  value={isExpense ? -operation.amount : operation.amount}
                />
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Collapse>
    </Box>
  );
}
