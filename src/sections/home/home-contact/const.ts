import { CONFIG } from "src/config-global";

import type { ContactLink } from "./types";

export const CONTACT_TITLE = "Контакты";
export const CONTACT_SUBTITLE = "Открыт к диалогу — выберите удобный канал";

export const CONTACT_LINKS: ContactLink[] = [
  {
    icon: "solar:letter-bold-duotone",
    label: "Email",
    value: CONFIG.contacts.email,
    href: `mailto:${CONFIG.contacts.email}`,
  },
  {
    icon: "akar-icons:github-fill",
    label: "GitHub",
    value: "InfinityScripter",
    href: CONFIG.social.github,
    external: true,
  },
  {
    icon: "akar-icons:linkedin-fill",
    label: "LinkedIn",
    value: "in/talalaevs",
    href: CONFIG.social.linkedin,
    external: true,
  },
  {
    icon: "akar-icons:telegram-fill",
    label: "Telegram",
    value: "@sh0ny",
    href: CONFIG.social.telegram,
    external: true,
  },
  {
    icon: "solar:map-point-bold-duotone",
    label: "Локация",
    value: "Москва",
  },
];
