import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

// Footer link columns. Translatable labels reference a `footer.<key>` message
// (`headlineKey` / `nameKey`); the contacts email is literal data, so it uses
// `name` directly. The footer component resolves keys via `t()`.
// Dropped the "docs" column (Terms/Privacy) — both were dead `href: "#"`
// placeholders with no backing pages: broken UX, and their shared "#" href
// collided as React keys in the footer (site-wide console error). No legal
// pages exist for this personal blog, so the column is removed rather than faked.
export const LINKS = [
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
