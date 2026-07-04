import type { SortOption, PublishOption } from "./types";

// ----------------------------------------------------------------------

// Publish-state options for the post details toolbar in the dashboard.
export const POST_PUBLISH_OPTIONS: PublishOption[] = [
  { value: "published", label: "Опубликовано" },
  { value: "draft", label: "Черновик" },
];

// Sort options for the public and dashboard post lists.
export const POST_SORT_OPTIONS: SortOption[] = [
  { value: "latest", label: "Новые" },
  { value: "popular", label: "Популярные" },
  { value: "oldest", label: "Старые" },
];

// Suggestions for the tags autocomplete in the post editor.
export const TAG_SUGGESTIONS = [
  "Technology",
  "Health and Wellness",
  "Travel",
  "Finance",
  "Education",
  "Food and Beverage",
  "Fashion",
  "Home and Garden",
  "Sports",
  "Entertainment",
  "Business",
  "Science",
  "Automotive",
  "Beauty",
  "Fitness",
  "Lifestyle",
  "Real Estate",
  "Parenting",
  "Pet Care",
  "Environmental",
  "DIY and Crafts",
  "Gaming",
  "Photography",
  "Music",
];

// ----------------------------------------------------------------------

// Max tags rendered on a post card before the rest are truncated. Shared by
// the feed, horizontal and vertical post cards.
export const MAX_TAGS = 2;

// Max related posts shown in the "Похожие посты" block.
export const MAX_RELATED = 3;

// ----------------------------------------------------------------------

/**
 * Social share targets for the post hero SpeedDial. `href` builds the
 * network's share-intent URL from the (trailing-slash) post URL and title.
 */
export interface ShareTarget {
  name: string;
  icon: string;
  tooltip: string;
  href: (url: string, title: string) => string;
}

export const SHARE_TARGETS: ShareTarget[] = [
  {
    name: "telegram",
    icon: "logos:telegram",
    tooltip: "Поделиться в Telegram",
    href: (url, title) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "twitter",
    icon: "ri:twitter-x-fill",
    tooltip: "Поделиться в X",
    href: (url, title) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    name: "vk",
    icon: "logos:vk",
    tooltip: "Поделиться во ВКонтакте",
    href: (url) => `https://vk.com/share.php?url=${encodeURIComponent(url)}`,
  },
];
