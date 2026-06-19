import { type ColorType } from "src/theme/core/components/types";

// ----------------------------------------------------------------------

/** Single mobilization record: plan/fact for a subproject+category on a date. */
export interface MobilizationDataItem {
  date: string;
  subproject: string;
  category: string;
  plan: number;
  fact: number;
}

/** Palette color key accepted by the mobilization widgets. */
export type MobilizationColor = ColorType;

/** Sparkline-shaped chart data fed to the small summary widgets. */
export interface MobilizationChartData {
  categories: string[];
  series: number[];
}
