import type { ModelRelease } from "src/types/api";

import Stack from "@mui/material/Stack";
import { Label } from "src/components/label";

import { formatPrice, formatContext } from "./utils";

// ----------------------------------------------------------------------

interface ReleaseSpecChipsProps {
  release: ModelRelease;
}

/**
 * Context-window and price chips. Unknown values render as an em dash (prices
 * are never invented — null means unknown), so the chip set is always present
 * and consistent.
 */
export function ReleaseSpecChips({ release }: ReleaseSpecChipsProps) {
  const chips = [
    { label: `Контекст: ${formatContext(release.contextTokens)}` },
    { label: `Вход: ${formatPrice(release.priceIn)} / 1M` },
    { label: `Выход: ${formatPrice(release.priceOut)} / 1M` },
  ];

  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
      {chips.map((chip) => (
        <Label key={chip.label} variant="outlined" color="default">
          {chip.label}
        </Label>
      ))}
    </Stack>
  );
}
