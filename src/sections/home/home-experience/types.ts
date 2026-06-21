import type { MarketingTheme } from "src/sections/home/components/types";

// ----------------------------------------------------------------------

export interface ExperienceItem {
  position: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string | null;
  description: string[];
  technologies: string;
  logo: string;
  link: string;
}

export interface ExperienceTimelineItemProps {
  item: ExperienceItem;
  isMobile: boolean;
  theme: MarketingTheme;
}
