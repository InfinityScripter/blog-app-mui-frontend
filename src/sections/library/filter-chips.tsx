import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

// ----------------------------------------------------------------------

interface FilterOption<T extends string> {
  value: T;
  label: string;
}

interface FilterChipsProps<T extends string> {
  /** Label for the neutral «all» chip. */
  allLabel: string;
  options: FilterOption<T>[];
  isActive: (value: T) => boolean;
  hasFilter: boolean;
  onToggle: (value: T) => void;
  onClear: () => void;
}

/**
 * A horizontal multi-select chip row (the «all» chip resets to neutral).
 * Scrolls horizontally on narrow screens instead of wrapping into a wall.
 * Shared by the reading kind-filter and the tools category-filter.
 */
export function FilterChips<T extends string>({
  allLabel,
  options,
  isActive,
  hasFilter,
  onToggle,
  onClear,
}: FilterChipsProps<T>) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        mb: 2.5,
        pb: 0.5,
        overflowX: "auto",
        flexWrap: { md: "wrap" },
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Chip
        label={allLabel}
        size="small"
        color="primary"
        variant={hasFilter ? "outlined" : "filled"}
        onClick={onClear}
        sx={{ flexShrink: 0 }}
      />
      {options.map((option) => (
        <Chip
          key={option.value}
          size="small"
          clickable
          label={option.label}
          onClick={() => onToggle(option.value)}
          variant={isActive(option.value) ? "filled" : "outlined"}
          color={isActive(option.value) ? "primary" : "default"}
          sx={{ flexShrink: 0 }}
        />
      ))}
    </Box>
  );
}
