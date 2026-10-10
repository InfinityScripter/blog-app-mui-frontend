import { CONFIG } from "src/config-global";

import type { HostPoseName } from "../components/types";

export const HERO_SOCIAL_LINKS = [
  {
    key: "youtube",
    href: CONFIG.social.youtube,
    icon: "mingcute:youtube-fill",
  },
  {
    key: "instagram",
    href: CONFIG.social.instagram,
    icon: "mingcute:instagram-fill",
  },
  {
    key: "telegram",
    href: CONFIG.social.telegramChannel,
    icon: "mingcute:telegram-fill",
  },
] as const;

export const HERO_LINK_POSES = {
  youtube: "point-left",
  instagram: "wow",
  telegram: "thumbs-up",
} as const satisfies Record<
  (typeof HERO_SOCIAL_LINKS)[number]["key"],
  HostPoseName
>;

export const HERO_TAP_REACTIONS = [
  { key: "laugh", pose: "laugh" },
  { key: "kiss", pose: "dog-kiss" },
  { key: "secret", pose: "smirk" },
  { key: "quiz", pose: "curious" },
] as const satisfies readonly { key: string; pose: HostPoseName }[];

export const HERO_POSES: readonly HostPoseName[] = [
  "wave",
  ...Object.values(HERO_LINK_POSES),
  ...HERO_TAP_REACTIONS.map((reaction) => reaction.pose),
];
