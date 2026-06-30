import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

export const LINKS = [
  {
    headline: "Документы",
    children: [
      { name: "Условия использования", href: "#" },
      { name: "Политика конфиденциальности", href: "#" },
    ],
  },
  {
    headline: "Контакты",
    children: [
      {
        name: CONFIG.contacts.email,
        href: `mailto:${CONFIG.contacts.email}`,
      },
    ],
  },
];

export const socials = [
  {
    value: "telegram",
    name: "Telegram",
    path: CONFIG.social.telegram,
  },
  {
    value: "github",
    name: "GitHub",
    path: CONFIG.social.github,
  },
  {
    value: "linkedin",
    name: "Linkedin",
    path: CONFIG.social.linkedin,
  },
  {
    value: "vk",
    name: "VK",
    path: "https://vk.com/sh0ny",
  },
];
