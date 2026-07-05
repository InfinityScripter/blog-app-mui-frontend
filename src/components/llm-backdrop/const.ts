// ----------------------------------------------------------------------
// Static config for the shared LLM-logo backdrop: the curated brand-icon set
// and the hand-tuned slot layout. All slugs verified present in the Iconify
// `logos:` set (colored brand marks — they ignore any `color` prop).

import type { LlmBackdropSlot } from "./types";

/**
 * Curated LLM / AI brand logos floated across the backdrop. Order matters only
 * for the round-robin slot assignment. Keep every entry a real `logos:` icon.
 */
export const BACKDROP_ICONS: string[] = [
  "logos:openai-icon",
  "logos:anthropic-icon",
  "logos:google",
  "logos:meta",
  "logos:mistral-ai-icon",
  "logos:deepseek",
  "logos:grok",
  "logos:qwen",
  "logos:yandex-ru",
  "logos:microsoft-icon",
  "logos:moonshot-ai-icon",
  "logos:hugging-face-icon",
  "logos:perplexity",
  "logos:nvidia",
  "logos:stability-ai",
];

/**
 * Hand-tuned positions hugging the page edges so logos stay clear of the
 * central reading column. Icons are assigned to slots round-robin. Duration is
 * the full float+spin cycle; delay staggers them so they never move in unison.
 */
export const BACKDROP_SLOTS: LlmBackdropSlot[] = [
  { top: "9%", left: "3%", size: 52, duration: 26, delay: 0 },
  { top: "20%", left: "91%", size: 44, duration: 30, delay: 3 },
  { top: "31%", left: "6%", size: 38, duration: 24, delay: 6 },
  { top: "44%", left: "94%", size: 56, duration: 34, delay: 1 },
  { top: "55%", left: "2%", size: 46, duration: 28, delay: 9 },
  { top: "67%", left: "89%", size: 40, duration: 22, delay: 4 },
  { top: "79%", left: "5%", size: 50, duration: 32, delay: 7 },
  { top: "90%", left: "92%", size: 36, duration: 27, delay: 11 },
  { top: "14%", left: "84%", size: 34, duration: 25, delay: 13 },
  { top: "37%", left: "96%", size: 30, duration: 29, delay: 15 },
  { top: "62%", left: "95%", size: 42, duration: 31, delay: 2 },
  { top: "73%", left: "3%", size: 32, duration: 23, delay: 8 },
  { top: "85%", left: "87%", size: 44, duration: 33, delay: 5 },
  { top: "26%", left: "2%", size: 30, duration: 28, delay: 12 },
  { top: "50%", left: "90%", size: 34, duration: 26, delay: 14 },
];
