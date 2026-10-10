import { useState, useCallback } from "react";

import { heroReaction } from "../utils";

import type { HeroLinkKey } from "../types";

// ----------------------------------------------------------------------

export function useHeroHost() {
  const [hovered, setHovered] = useState<HeroLinkKey>();
  const [taps, setTaps] = useState(0);

  const tap = useCallback(() => {
    setHovered(undefined);
    setTaps((count) => count + 1);
  }, []);

  return {
    ...heroReaction(hovered, taps),
    tap,
    setHovered,
  };
}
