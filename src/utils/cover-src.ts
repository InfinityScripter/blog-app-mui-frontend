import { CONFIG } from "src/config-global";

import { formatImageUrl } from "./format-image-url";

// Shared fallback for post covers. A post without a cover would otherwise
// render a broken <img> (formatImageUrl returns "" for an empty url); fall
// back to a cover asset instead of one identical placeholder.
export const PLACEHOLDER_COVER = `${CONFIG.site.basePath}/assets/placeholder.svg`;

// Number of seeded fallback covers available on the asset host at
// `/assets/images/cover/cover-N.webp` (served from the backend via
// formatImageUrl's `/assets/` routing). The backend ships cover-1..cover-24.
const FALLBACK_COVER_COUNT = 24;

// The backend stamps this exact path as DEFAULT_POST_COVER_URL on any post that
// arrives without a real cover (most bot/legacy news posts). Treat it as "no
// cover" so those don't all render an identical cover-1 — they get seeded
// variety instead. A post with a genuinely uploaded cover keeps its own URL.
const DEFAULT_COVER_PATH = "/assets/images/cover/cover-1.webp";

function isPlaceholderCover(coverUrl?: string | null): boolean {
  return !coverUrl || coverUrl === DEFAULT_COVER_PATH;
}

/**
 * Deterministic 1..count index from a seed string (small rolling hash kept in a
 * safe integer range with %), so the same post always resolves to the same
 * fallback cover but different posts vary.
 */
function seedToIndex(seed: string, count: number): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  return (hash % count) + 1;
}

/**
 * Resolves a post cover URL to a renderable src. When `coverUrl` is present it
 * is normalised via formatImageUrl. When it is missing: with a `seed` (e.g. the
 * post id or title) it returns a deterministic, varied cover asset so cards
 * don't all share one identical placeholder; without a seed it falls back to the
 * bundled placeholder (kept for backward compatibility with callers that don't
 * pass one).
 */
export function coverSrc(coverUrl?: string | null, seed?: string): string {
  // A real, non-default cover always wins.
  if (!isPlaceholderCover(coverUrl)) {
    const formatted = formatImageUrl(coverUrl);
    if (formatted) return formatted;
  }

  // No cover (or the backend's default) + a seed → deterministic varied cover.
  if (seed) {
    const index = seedToIndex(seed, FALLBACK_COVER_COUNT);
    return formatImageUrl(`/assets/images/cover/cover-${index}.webp`);
  }

  // No seed: keep the bundled placeholder for any legacy caller.
  const formatted = formatImageUrl(coverUrl);
  return formatted || PLACEHOLDER_COVER;
}
