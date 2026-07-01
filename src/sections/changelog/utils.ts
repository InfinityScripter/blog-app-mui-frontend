import type { LabelColor } from "src/components/label";

import { VENDOR_TO_COLOR } from "./const";

// ----------------------------------------------------------------------

/** Maps a vendor to a theme semantic color for its Label (never a hex). */
export function vendorColor(vendor: string): LabelColor {
  return VENDOR_TO_COLOR[vendor.trim().toLowerCase()] ?? "default";
}

/**
 * A verdict is the owner's one-liner take. It has no severity axis, so it maps
 * to a single neutral-brand color rather than a heuristic sentiment — kept a
 * function so callers never hardcode a hex.
 */
export function verdictColor(): LabelColor {
  return "primary";
}

/**
 * Formats a $/1M-tokens price. `null` means unknown (never invented), rendered
 * as an em dash so the chip still reads cleanly.
 */
export function formatPrice(price: number | null): string {
  if (price === null || Number.isNaN(price)) return "—";
  // Trim trailing zeros (2.50 → "2.5", 3.00 → "3") without locale surprises.
  const fixed = price.toFixed(2).replace(/\.?0+$/, "");
  return `$${fixed}`;
}

/**
 * Formats a context-window token count into a compact human label
 * (200000 → "200K", 1000000 → "1M"). `null` means unknown → em dash.
 */
export function formatContext(tokens: number | null): string {
  if (tokens === null || Number.isNaN(tokens) || tokens <= 0) return "—";
  if (tokens >= 1_000_000) {
    const millions = tokens / 1_000_000;
    return `${millions.toFixed(millions % 1 === 0 ? 0 : 1)}M`;
  }
  if (tokens >= 1_000) {
    const thousands = tokens / 1_000;
    return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)}K`;
  }
  return String(tokens);
}
