import TurndownService from "turndown";

import { htmlTags } from "./html-tags";

const excludeTags = ["pre", "code"];

const turndownService = new TurndownService({
  codeBlockStyle: "fenced",
  fence: "```",
});

const keepTags = new Set(
  htmlTags.filter((item) => !excludeTags.includes(item)),
);

/**
 * Turndown adds an `isBlock` flag to nodes at runtime that is not part of the
 * DOM `HTMLElement` type used by `@types/turndown`.
 */
interface TurndownNode extends HTMLElement {
  isBlock?: boolean;
}

/**
 * Custom rule
 * https://github.com/mixmark-io/turndown/issues/241#issuecomment-400591362
 */
turndownService.addRule("keep", {
  filter: (node) => keepTags.has(node.nodeName.toLowerCase()),
  replacement(content: string, node: TurndownNode) {
    const { isBlock, outerHTML } = node;

    return isBlock ? `\n\n${outerHTML}\n\n` : outerHTML;
  },
});

// ----------------------------------------------------------------------

export function htmlToMarkdown(html: string): string {
  return turndownService.turndown(html);
}

// ----------------------------------------------------------------------

export function isMarkdownContent(content: string): boolean {
  // If it contains HTML tags, treat it as HTML (turndown converts it to markdown).
  if (/<\/?[a-z][\s\S]*>/i.test(content)) {
    return false;
  }

  // Checking if the content contains Markdown-specific patterns.
  // Line-anchored patterns use the `m` flag so markers anywhere in the text are
  // detected, not only on the first line.
  const markdownPatterns = [
    /* Heading */
    /^#+\s/m,
    /* Blockquote */
    /^>\s/m,
    /* Code block */
    /^```/m,
    /* Table */
    /^\|/m,
    /* Unordered list */
    /^\s*[*+-]\s+\S/m,
    /* Ordered list */
    /^\s*\d+\.\s+\S/m,
    /* Bold / italic */
    /(\*\*|__)[^\s].*?[^\s](\*\*|__)/,
    /* Image */
    /!\[.*?\]\(.*?\)/,
    /* Link */
    /\[.*?\]\(.*?\)/,
  ];

  // Checking if any of the patterns match
  return markdownPatterns.some((pattern) => pattern.test(content));
}
