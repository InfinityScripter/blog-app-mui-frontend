import Box from "@mui/material/Box";
import { Iconify } from "src/components/iconify";

import { BACKDROP_SLOTS } from "./const-ui";
import { vendorIcon, hasBrandIcon } from "./utils";

// ----------------------------------------------------------------------

interface TimelineBackdropProps {
  vendors: string[];
}

/**
 * Decorative fixed backdrop: vendor brand logos slowly floating and spinning
 * in 3D at the page edges (never under the central timeline column). Pure
 * eye-candy: pointer-events off, aria-hidden, hidden on mobile and under
 * `prefers-reduced-motion` (see styles.css).
 */
export function TimelineBackdrop({ vendors }: TimelineBackdropProps) {
  const icons = Array.from(
    new Set(vendors.filter(hasBrandIcon).map(vendorIcon)),
  );

  if (!icons.length) return null;

  return (
    <Box aria-hidden className="llm-timeline-backdrop">
      {BACKDROP_SLOTS.map((slot, index) => (
        <Iconify
          key={`${slot.top}-${slot.left}`}
          className="llm-timeline-backdrop__icon"
          icon={icons[index % icons.length]}
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
