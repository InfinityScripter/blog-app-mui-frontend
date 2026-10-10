import type { Theme, SxProps } from "@mui/material/styles";

import { varAlpha } from "./utils";
import { monoFont } from "../core/typography";

// ----------------------------------------------------------------------
// Editorial Ink shared patterns (see .stitch/DESIGN.md): mono metadata
// labels, hairline rules. Prefer these over ad-hoc sx.

/** JetBrains Mono metadata label — dates, counters, overlines, indexes. */
export const monoLabelSx: SxProps<Theme> = {
  fontFamily: monoFont,
  fontSize: 12,
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "text.secondary",
};

/** Mono value text (dates in lists, view counters) — no uppercase. */
export const monoValueSx: SxProps<Theme> = {
  fontFamily: monoFont,
  fontSize: 13,
  fontWeight: 500,
};

/** 1px hairline in the current scheme — borders, rules, dividers. */
export function hairline(theme: Theme): string {
  return `1px solid ${varAlpha(theme.vars.palette.grey["500Channel"], 0.16)}`;
}
