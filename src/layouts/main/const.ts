import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

// Footer link columns. Translatable labels reference a `footer.<key>` message
// (`headlineKey` / `nameKey`); the contacts email is literal data, so it uses
// `name` directly. The footer component resolves keys via `t()`.
export const LINKS = [
  {
    headlineKey: "docs",
    children: [
      { nameKey: "termsOfUse", href: "#" },
      { nameKey: "privacyPolicy", href: "#" },
    ],
  },
  {
    headlineKey: "contacts",
    children: [
      {
        name: CONFIG.contacts.email,
        href: `mailto:${CONFIG.contacts.email}`,
      },
    ],
  },
] as const;

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
