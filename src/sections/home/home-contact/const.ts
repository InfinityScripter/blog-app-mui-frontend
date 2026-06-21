import type { ContactLink } from "./types";

export const CONTACT_TITLE = "Контакты";
export const CONTACT_SUBTITLE = "Открыт к диалогу — выберите удобный канал";

export const CONTACT_LINKS: ContactLink[] = [
  {
    icon: "solar:letter-bold-duotone",
    label: "Email",
    value: "talalaev.misha@gmail.com",
    href: "mailto:talalaev.misha@gmail.com",
  },
  {
    icon: "akar-icons:github-fill",
    label: "GitHub",
    value: "InfinityScripter",
    href: "https://github.com/InfinityScripter",
    external: true,
  },
  {
    icon: "akar-icons:linkedin-fill",
    label: "LinkedIn",
    value: "in/talalaevs",
    href: "https://linkedin.com/in/talalaevs/",
    external: true,
  },
  {
    icon: "akar-icons:telegram-fill",
    label: "Telegram",
    value: "@sh0ny",
    href: "https://t.me/sh0ny",
    external: true,
  },
  {
    icon: "solar:map-point-bold-duotone",
    label: "Локация",
    value: "Москва",
  },
];
