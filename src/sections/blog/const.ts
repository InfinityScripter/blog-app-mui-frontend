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
