import { CONFIG } from "src/config-global";

import { formatImageUrl } from "./format-image-url";

// Shared fallback for post covers. A post without a cover would otherwise
// render a broken <img> (formatImageUrl returns "" for an empty url); fall
// back to the bundled placeholder instead.
export const PLACEHOLDER_COVER = `${CONFIG.site.basePath}/assets/placeholder.svg`;

export function coverSrc(coverUrl?: string | null): string {
  return formatImageUrl(coverUrl) || PLACEHOLDER_COVER;
}
