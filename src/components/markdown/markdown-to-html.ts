import { Marked } from "marked";

// A dedicated instance keeps our options isolated from any global `marked` state.
const marked = new Marked({
  gfm: true,
  // Match the viewer (`remark-gfm`): a single newline is NOT a hard break.
  breaks: false,
});

/**
 * Convert a Markdown string to an HTML string.
 *
 * Used at the editor boundary: Tiptap parses its input as HTML, so bot-authored
 * posts stored as Markdown must be converted first — otherwise markers like
 * `# heading`, `**bold**` and `- list` are shown as literal plain text and the
 * post "breaks" on edit. See {@link isMarkdownContent} for the detection side.
 *
 * `parse` is synchronous here because no async extensions are registered.
 */
export function markdownToHtml(markdown: string): string {
  const html = marked.parse(markdown);
  return typeof html === "string" ? html : "";
}
