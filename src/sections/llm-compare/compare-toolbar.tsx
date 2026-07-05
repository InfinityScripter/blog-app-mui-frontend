"use client";

import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";
// Shared vendor display helpers live in llm-timeline (the single, documented
// cross-section import — display-only maps that would drift if duplicated).
import {
  vendorIcon,
  vendorColor,
  hasBrandIcon,
} from "src/sections/llm-timeline/utils";

import { MODALITY_OPTIONS } from "./const";

import type { Modality } from "./types";

// ----------------------------------------------------------------------

interface CompareToolbarProps {
  vendors: string[];
  selectedVendors: string[];
  selectedModalities: Modality[];
  openOnly: boolean;
  hasFilter: boolean;
  onToggleVendor: (vendor: string) => void;
  onToggleModality: (modality: Modality) => void;
  onToggleOpenOnly: () => void;
  onReset: () => void;
}

/**
 * Filter bar: vendor chips (multi-select, brand-coloured), modality chips, an
 * open-weights toggle, and a reset. Empty selections are the neutral «all»
 * state, so the matrix is never accidentally empty. Scrolls horizontally on
 * narrow screens rather than wrapping into a wall.
 */
export function CompareToolbar({
  vendors,
  selectedVendors,
  selectedModalities,
  openOnly,
  hasFilter,
  onToggleVendor,
  onToggleModality,
  onToggleOpenOnly,
  onReset,
}: CompareToolbarProps) {
  const t = useTranslations("llmCompare");

  return (
    <Stack spacing={1.5} sx={{ mb: { xs: 2.5, md: 3 } }}>
      <Box
        sx={{
          display: "flex",
          gap: 1,
          pb: 0.5,
          overflowX: "auto",
          flexWrap: { md: "wrap" },
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Chip
          label={t("filters.allVendors")}
          size="small"
          color="primary"
          variant={selectedVendors.length ? "outlined" : "filled"}
          onClick={onReset}
          sx={{ flexShrink: 0 }}
        />
        {vendors.map((vendor) => {
          const active = selectedVendors.includes(vendor);
          const color = vendorColor(vendor);
          return (
            <Chip
              key={vendor}
              size="small"
              clickable
              onClick={() => onToggleVendor(vendor)}
              variant={active ? "filled" : "outlined"}
              color={color === "default" ? undefined : color}
              icon={
                <Iconify
                  width={16}
                  icon={vendorIcon(vendor)}
                  sx={
                    hasBrandIcon(vendor)
                      ? undefined
                      : { color: `${color}.main` }
                  }
                />
              }
              label={vendor}
              sx={{ flexShrink: 0 }}
            />
          );
        })}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {MODALITY_OPTIONS.map((option) => {
          const active = selectedModalities.includes(option.value);
          return (
            <Chip
              key={option.value}
              size="small"
              clickable
              variant={active ? "filled" : "outlined"}
              color={active ? "info" : "default"}
              onClick={() => onToggleModality(option.value)}
              label={t(`modalities.${option.labelKey}`)}
            />
          );
        })}

        <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />

        <Chip
          size="small"
          clickable
          variant={openOnly ? "filled" : "outlined"}
          color={openOnly ? "success" : "default"}
          onClick={onToggleOpenOnly}
          icon={<Iconify width={16} icon="solar:code-bold-duotone" />}
          label={t("filters.openWeights")}
        />

        {hasFilter && (
          <Chip
            size="small"
            clickable
            variant="outlined"
            onClick={onReset}
            icon={<Iconify width={16} icon="solar:restart-bold-duotone" />}
            label={t("filters.reset")}
          />
        )}
      </Box>
    </Stack>
  );
}
