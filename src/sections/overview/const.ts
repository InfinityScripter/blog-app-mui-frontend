import type { StatCardConfig } from "./types";

// ----------------------------------------------------------------------

export const OVERVIEW_STAT_CARDS: StatCardConfig[] = [
  {
    key: "totalPosts",
    label: "Постов",
    icon: "solar:document-text-bold-duotone",
  },
  {
    key: "totalViews",
    label: "Просмотров",
    icon: "solar:eye-bold-duotone",
  },
  {
    key: "totalComments",
    label: "Комментариев",
    icon: "solar:chat-round-dots-bold-duotone",
  },
  {
    key: "totalFavorites",
    label: "В избранном",
    icon: "solar:heart-bold-duotone",
  },
];
