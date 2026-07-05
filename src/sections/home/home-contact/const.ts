import { CONFIG } from "src/config-global";

import type { ContactLink } from "./types";

// `labelKey` → `home.contact.links.<key>` (resolved in `HomeContact`). Proper-
// noun labels (Email/GitHub/…) map to identical values in every locale; only
// «Локация» differs. Its `valueKey` → `home.contact.location` is the sole
// value that is UI copy — the other values are proper-noun data, kept as-is.
export const CONTACT_LINKS: ContactLink[] = [
  {
    icon: "solar:letter-bold-duotone",
    labelKey: "email",
    value: CONFIG.contacts.email,
    href: `mailto:${CONFIG.contacts.email}`,
  },
  {
    icon: "akar-icons:github-fill",
    labelKey: "github",
    value: "InfinityScripter",
    href: CONFIG.social.github,
    external: true,
  },
  {
    icon: "akar-icons:linkedin-fill",
    labelKey: "linkedin",
    value: "in/talalaevs",
    href: CONFIG.social.linkedin,
    external: true,
  },
  {
    icon: "akar-icons:telegram-fill",
    labelKey: "telegram",
    value: "@sh0ny",
    href: CONFIG.social.telegram,
    external: true,
  },
  {
    icon: "solar:map-point-bold-duotone",
    labelKey: "location",
    valueKey: "location",
  },
];
