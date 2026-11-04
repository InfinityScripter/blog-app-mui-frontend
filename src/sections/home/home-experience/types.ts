import type { MarketingTheme } from "src/sections/home/components/types";

// ----------------------------------------------------------------------

type ExperienceKey =
  | "gazprom"
  | "qcup"
  | "userver"
  | "shurikmarket"
  | "stomplan"
  | "yandexGo"
  | "aifirst";

export interface ExperienceItem {
  // Stable key → `home.experience.items.<key>.{position,company,location,description}`.
  key: ExperienceKey;
  startDate: string;
  endDate: string | null;
  technologies: string;
  logo: string;
  link: string;
}

export interface ExperienceTimelineItemProps {
  item: ExperienceItem;
  isMobile: boolean;
  theme: MarketingTheme;
}
