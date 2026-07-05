// ----------------------------------------------------------------------
// Shared decorative "floating LLM logos" backdrop, used site-wide behind
// public pages (see `src/layouts/main/layout.tsx`). Static config only — the
// logo set is curated here, not derived from page data.

/** Visual intensity preset — dimmer on reading pages, richer on showcases. */
type LlmBackdropVariant = "showcase" | "reading";

/** One floating logo slot in the decorative 3D backdrop. */
export interface LlmBackdropSlot {
  /** CSS offset from the top, e.g. "12%". */
  top: string;
  /** CSS offset from the left, e.g. "6%". */
  left: string;
  /** Icon size in px. */
  size: number;
  /** Full float+spin cycle duration, seconds. */
  duration: number;
  /** Animation start offset, seconds. */
  delay: number;
}

export interface LlmBackdropProps {
  /** Intensity preset; defaults to "showcase". */
  variant?: LlmBackdropVariant;
}
