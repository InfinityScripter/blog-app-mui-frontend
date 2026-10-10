import { HERO_LINK_POSES, HERO_TAP_REACTIONS } from "./const";

import type { HeroLinkKey, HeroReaction, HeroMotionMode } from "./types";

// ----------------------------------------------------------------------

export function heroReaction(
  hovered: HeroLinkKey | undefined,
  taps: number,
): HeroReaction {
  if (hovered) {
    return { pose: HERO_LINK_POSES[hovered], bubble: `hover.${hovered}` };
  }
  if (taps === 0) {
    return { pose: "wave", bubble: "hint" };
  }
  const reaction = HERO_TAP_REACTIONS[(taps - 1) % HERO_TAP_REACTIONS.length];
  return { pose: reaction.pose, bubble: `tap.${reaction.key}` };
}

export function heroMotionTargets(mode: HeroMotionMode) {
  if (mode === "desktop") {
    return { hostScale: 1.45, wordShift: 45, night: 0.88, fade: 0 };
  }
  if (mode === "phone") {
    return { hostScale: 1.2, wordShift: 12, night: 0, fade: 1 };
  }
  return { hostScale: 1, wordShift: 0, night: 0, fade: 1 };
}
