import type { SocialIconName } from "src/components/iconify";

import { paths } from "src/routes/paths";
import { CONFIG } from "src/config-global";

// ----------------------------------------------------------------------

// Footer link columns. Translatable labels reference a `footer.<key>` message
// (`headlineKey` / `nameKey`); the contacts email is literal data, so it uses
// `name` directly. The footer component resolves keys via `t()`.
type FooterHeadlineKey = "contacts" | "documents";
type FooterLinkNameKey = "privacyPolicy" | "personalDataConsent";

interface FooterLink {
  href: string;
  name?: string;
  nameKey?: FooterLinkNameKey;
}

interface FooterLinkList {
  headlineKey: FooterHeadlineKey;
  children: FooterLink[];
}

export const LINKS: FooterLinkList[] = [
  {
    headlineKey: "contacts",
    children: [
      {
        name: CONFIG.contacts.email,
        href: `mailto:${CONFIG.contacts.email}`,
      },
    ],
  },
  {
    headlineKey: "documents",
    children: [
      {
        nameKey: "privacyPolicy",
        href: paths.legal.privacyPolicy,
      },
      {
        nameKey: "personalDataConsent",
        href: paths.legal.personalDataConsent,
      },
    ],
  },
];

interface SocialLink {
  value: SocialIconName;
  name: string;
  path: string;
}

export const socials: SocialLink[] = [
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
