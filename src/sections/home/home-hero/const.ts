import { CONFIG } from "src/config-global";

export const HERO_HOST_SRC = "/assets/life-style/host-wave.png";

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
