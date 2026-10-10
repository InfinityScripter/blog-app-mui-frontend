import type { ReactNode, ElementType } from "react";

import type { HostPoseName } from "../components/types";
import type { HERO_SOCIAL_LINKS, HERO_TAP_REACTIONS } from "./const";

// ----------------------------------------------------------------------

export interface MInviewProps {
  children?: ReactNode;
  component?: ElementType;
}

export type HeroLinkKey = (typeof HERO_SOCIAL_LINKS)[number]["key"];

type HeroTapKey = (typeof HERO_TAP_REACTIONS)[number]["key"];

export interface HeroReaction {
  pose: HostPoseName;
  bubble: "hint" | `hover.${HeroLinkKey}` | `tap.${HeroTapKey}`;
}

export type HeroMotionMode = "still" | "phone" | "desktop";
