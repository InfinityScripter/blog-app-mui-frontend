import Box from "@mui/material/Box";

import { Iconify } from "../iconify";
import { BACKDROP_ICONS, BACKDROP_SLOTS } from "./const";

import type { LlmBackdropProps } from "./types";

// ----------------------------------------------------------------------

/**
 * Decorative fixed backdrop shared across public pages: curated LLM brand logos
 * slowly drifting and spinning in 3D at the page edges (clear of the central
 * reading column). Pure eye-candy — pointer-events off, aria-hidden, hidden on
 * mobile and under `prefers-reduced-motion` (see styles.css).
 *
 * `variant="reading"` dims it further for text-heavy pages (article bodies);
 * `variant="showcase"` (default) is the fuller effect for landing/list pages.
 */
export function LlmBackdrop({ variant = "showcase" }: LlmBackdropProps) {
  return (
    <Box aria-hidden className={`llm-backdrop llm-backdrop--${variant}`}>
      {BACKDROP_SLOTS.map((slot, index) => (
        <Iconify
          key={`${slot.top}-${slot.left}`}
          className="llm-backdrop__icon"
          icon={BACKDROP_ICONS[index % BACKDROP_ICONS.length]}
          width={slot.size}
          sx={{
            top: slot.top,
            left: slot.left,
            animationDuration: `${slot.duration}s`,
            animationDelay: `${slot.delay}s`,
          }}
        />
      ))}
    </Box>
  );
}
