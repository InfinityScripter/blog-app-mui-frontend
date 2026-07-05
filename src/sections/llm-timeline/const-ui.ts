// ----------------------------------------------------------------------
// Static UI config for the /llm-timeline section (not model data — that
// lives in `data/`). Eras annotate year chips.

/**
 * Era caption shown under the year chip at the first model of the year.
 * Years without an entry show no caption (the era continues).
 */
export const YEAR_ERAS: Record<number, string> = {
  2018: "Рождение трансформеров",
  2020: "Гонка масштабов",
  2022: "ChatGPT-момент",
  2023: "Гонка вендоров",
  2024: "Мультимодальность",
  2025: "Reasoning и агенты",
};
