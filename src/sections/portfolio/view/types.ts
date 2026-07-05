// Metric `key` maps to `portfolio.metrics.<key>.label` (and `.value` when the
// value is translatable copy). `value` is set here only for proper-noun values
// (tech stack) that must stay literal across locales — leave undefined to
// resolve the value from the message catalog instead.
export interface PortfolioMetric {
  key: string;
  icon: string;
  value?: string;
}
