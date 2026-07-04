// ----------------------------------------------------------------------
// Static UI config for the /llm-timeline section (not model data — that
// lives in `data/`). Eras annotate year chips; slots position the floating
// brand-logo backdrop.

import type { BackdropSlot } from "./types";

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

/**
 * Hand-tuned positions hugging the page edges so logos never sit under the
 * central timeline column. Icons are assigned to slots round-robin.
 */
export const BACKDROP_SLOTS: BackdropSlot[] = [
  { top: "12%", left: "4%", size: 52, duration: 26, delay: 0 },
  { top: "26%", left: "90%", size: 44, duration: 30, delay: 3 },
  { top: "38%", left: "7%", size: 38, duration: 24, delay: 6 },
  { top: "52%", left: "92%", size: 56, duration: 34, delay: 1 },
  { top: "64%", left: "3%", size: 46, duration: 28, delay: 9 },
  { top: "78%", left: "88%", size: 40, duration: 22, delay: 4 },
  { top: "88%", left: "6%", size: 50, duration: 32, delay: 7 },
  { top: "8%", left: "82%", size: 36, duration: 27, delay: 11 },
  { top: "46%", left: "96%", size: 34, duration: 25, delay: 13 },
  { top: "70%", left: "94%", size: 42, duration: 29, delay: 15 },
];
