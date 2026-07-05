import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import { useTranslations } from "next-intl";
import { Iconify } from "src/components/iconify";

import { vendorIcon, vendorColor, hasBrandIcon } from "./utils";

import type { VendorStat } from "./utils";

// ----------------------------------------------------------------------

interface TimelineFiltersProps {
  stats: VendorStat[];
  hasFilter: boolean;
  isActive: (vendor: string) => boolean;
  onToggle: (vendor: string) => void;
  onClear: () => void;
}

/**
 * Vendor filter row: one chip per vendor (brand icon + model count),
 * multi-select. The «Все» chip resets to the neutral «show all» state.
 * Scrolls horizontally on narrow screens instead of wrapping into a wall.
 */
export function TimelineFilters({
  stats,
  hasFilter,
  isActive,
  onToggle,
  onClear,
}: TimelineFiltersProps) {
  const t = useTranslations("llmTimeline");

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 2,
        pb: 0.5,
        overflowX: "auto",
        flexWrap: { md: "wrap" },
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Chip
        label={t("filters.all")}
        size="small"
        color="primary"
        variant={hasFilter ? "outlined" : "filled"}
        onClick={onClear}
      />
      {stats.map(({ vendor, count }) => {
        const active = isActive(vendor);
        const color = vendorColor(vendor);
        return (
          <Chip
            key={vendor}
            size="small"
            clickable
            onClick={() => onToggle(vendor)}
            variant={active ? "filled" : "outlined"}
            color={color === "default" ? undefined : color}
            icon={
              <Iconify
                width={16}
                icon={vendorIcon(vendor)}
                sx={
                  hasBrandIcon(vendor) ? undefined : { color: `${color}.main` }
                }
              />
            }
            label={`${vendor} · ${count}`}
            sx={{ flexShrink: 0 }}
          />
        );
      })}
    </Box>
  );
}
