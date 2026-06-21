import { Image } from "src/components/image";
import { coverSrc } from "src/utils/cover-src";

import type { ThumbProps } from "./types";

// ----------------------------------------------------------------------

/**
 * Renders the thumbnail. When the post has no cover, coverSrc falls back to a
 * deterministic, varied cover asset seeded by the post id/title — so cards never
 * all share one identical placeholder.
 */
export function Thumb({ item, ratio, sx }: ThumbProps) {
  const seed = String(item.post._id ?? item.post.id ?? item.post.title);
  return (
    <Image
      alt={item.post.title}
      src={coverSrc(item.post.coverUrl, seed)}
      ratio={ratio}
      sx={sx}
    />
  );
}
