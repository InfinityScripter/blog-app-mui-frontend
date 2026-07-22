import type { ModelRelease } from "src/types/api";
import type { LabelColor } from "src/components/label";

import { VENDOR_TO_COLOR } from "./const";

// ----------------------------------------------------------------------

/** Maps a vendor to a theme semantic color for its Label (never a hex). */
export function vendorColor(vendor: string): LabelColor {
  return VENDOR_TO_COLOR[vendor.trim().toLowerCase()] ?? "default";
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

/**
 * Релиз считается «свежим» первые 7 дней — строка леджера получает
 * пульсирующую точку-индикатор.
 */
const FRESH_RELEASE_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export function isFreshRelease(releasedAt: string | null | undefined): boolean {
  if (!releasedAt) return false;
  const releasedTime = new Date(releasedAt).getTime();
  if (Number.isNaN(releasedTime)) return false;
  return Date.now() - releasedTime <= FRESH_RELEASE_WINDOW_MS;
}

/** Stable newest-first order shared by the rendered list and its JSON-LD. */
export function sortReleasesDesc(releases: ModelRelease[]): ModelRelease[] {
  return [...releases].sort((a, b) => {
    const aTime = a.releasedAt ? new Date(a.releasedAt).getTime() : 0;
    const bTime = b.releasedAt ? new Date(b.releasedAt).getTime() : 0;
    return (
      bTime - aTime ||
      `${a.model} ${a.version}`.localeCompare(`${b.model} ${b.version}`)
    );
  });
}
