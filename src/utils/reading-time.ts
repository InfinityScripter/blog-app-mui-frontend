// ----------------------------------------------------------------------

// Average adult reading speed (words per minute). Russian prose lands close to
// the 200 wpm figure widely used for blog reading-time estimates.
const WORDS_PER_MINUTE = 200;

/**
 * Estimate reading time in whole minutes from raw HTML content (Tiptap output).
 * Strips tags, counts words, divides by reading speed. Always at least 1.
 */
export function getReadingTime(content?: string): number {
  if (!content) return 1;

  const text = content
    .replace(/<[^>]*>/g, " ") // drop HTML tags
    .replace(/&[a-z]+;/gi, " ") // drop HTML entities (&nbsp;, &amp;, …)
    .trim();

  if (!text) return 1;

  const words = text.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}
