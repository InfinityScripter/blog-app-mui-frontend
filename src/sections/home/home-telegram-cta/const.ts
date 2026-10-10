import { CONFIG } from "src/config-global";

export const TELEGRAM_URL = CONFIG.social.telegramChannel;

export const HOME_SECTION_LINKS = [
  { key: "news", href: "/news" },
  { key: "changelog", href: "/changelog" },
  { key: "llmCompare", href: "/llm-compare" },
] as const;

export const PEEK_SRC = "/assets/life-style/host/peek.webp";

export const MARQUEE_REPEATS = 4;

// The image is mirrored so the "wall" she holds is the screen's left edge;
// x = -16% puts that edge exactly at the section border.
export const PEEK_VARIANTS = {
  hidden: { x: "-80%", scaleX: -1, rotate: -6 },
  shown: {
    x: "-16%",
    scaleX: -1,
    rotate: 0,
    transition: { type: "spring", stiffness: 120, damping: 14, delay: 0.2 },
  },
  hover: { x: "-8%", scaleX: -1, rotate: 3 },
} as const;
