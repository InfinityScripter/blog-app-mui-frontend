import { Iconify } from "src/components/iconify";

// ----------------------------------------------------------------------

// Static nav config: stable `key` (→ `nav.<key>` translation), path and icon.
// Titles are resolved per-locale by `useNavData` (src/layouts/main/hooks) so
// this stays a plain data module without calling the `t()` hook at module scope.
export const NAV_ITEMS = [
  {
    key: "home",
    path: "/",
    icon: <Iconify width={22} icon="solar:home-2-bold-duotone" />,
  },
  {
    key: "news",
    path: "/news",
    icon: <Iconify width={22} icon="solar:notebook-bold-duotone" />,
  },
  {
    key: "blog",
    path: "/post",
    icon: <Iconify width={22} icon="solar:file-bold-duotone" />,
  },
  {
    key: "releases",
    path: "/changelog",
    icon: <Iconify width={22} icon="solar:rocket-2-bold-duotone" />,
  },
  {
    key: "llmTimeline",
    path: "/llm-timeline",
    icon: <Iconify width={22} icon="solar:clock-circle-bold-duotone" />,
  },
  {
    key: "llmCompare",
    path: "/llm-compare",
    icon: <Iconify width={22} icon="solar:ranking-bold-duotone" />,
  },
  {
    key: "library",
    path: "/library",
    icon: <Iconify width={22} icon="solar:bookmark-square-bold-duotone" />,
  },
  {
    key: "about",
    path: "/portfolio",
    icon: <Iconify width={22} icon="solar:user-circle-bold-duotone" />,
  },
] as const;
