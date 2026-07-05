// ----------------------------------------------------------------------
// Static UI config for the /llm-timeline section (not model data — that
// lives in `data/`). Eras annotate year chips.

/**
 * Years that open a new «era» — the first model of such a year shows an era
 * caption under its year chip. The caption text is localized: resolved in the
 * component via `t("eras.<year>")` (a plain data module can't call the `t()`
 * hook at module scope, so the year itself is the stable key). Years absent
 * here show no caption (the era continues).
 */
export const ERA_YEARS: readonly number[] = [
  2018, 2020, 2022, 2023, 2024, 2025,
] as const;
