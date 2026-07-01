import type { LabelColor } from "src/components/label";

// ----------------------------------------------------------------------

/**
 * Maps a known vendor (lowercased) to a theme semantic color for its Label —
 * never a hex, so light/dark and primary-color changes stay predictable. An
 * unknown vendor falls back to «default» via {@link vendorColor}.
 */
export const VENDOR_TO_COLOR: Record<string, LabelColor> = {
  openai: "success",
  anthropic: "warning",
  google: "info",
  deepmind: "info",
  meta: "info",
  mistral: "secondary",
  deepseek: "primary",
  xai: "error",
  cohere: "secondary",
  yandex: "error",
};
