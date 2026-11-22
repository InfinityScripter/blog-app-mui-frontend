import type { MarketingTheme } from "src/sections/home/components/types";

// ----------------------------------------------------------------------

type ExperienceKey =
  "earlier" | "ecommerce" | "dentalSaas" | "aiPlatform" | "aifirst";

export interface ExperienceItem {
  // Stable key → `home.experience.items.<key>.{position,company,location,description}`.
  key: ExperienceKey;
  startDate: string;
  endDate: string | null;
  technologies: string;
  // Iconify name for the timeline dot — a neutral glyph, never a company logo.
  icon: string;
  // Only own public resources; when absent the card is not a link.
  link?: string;
}

export interface ExperienceTimelineItemProps {
  item: ExperienceItem;
  isMobile: boolean;
  theme: MarketingTheme;
}
