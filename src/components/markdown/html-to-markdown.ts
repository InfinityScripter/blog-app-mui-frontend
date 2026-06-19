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
  // Checking if the content contains Markdown-specific patterns
  const markdownPatterns = [
    /* Heading */
    /^#+\s/,
    /* List item */
    /^(\*|-|\d+\.)\s/,
    /* Code block */
    /^```/,
    /* Table */
    /^\|/,
    /* Unordered list */
    /^(\s*)[*+-] [^\r\n]+/,
    /* Ordered list */
    /^(\s*)\d+\. [^\r\n]+/,
    /* Image */
    /!\[.*?\]\(.*?\)/,
    /* Link */
    /\[.*?\]\(.*?\)/,
  ];

  // Checking if any of the patterns match
  return markdownPatterns.some((pattern) => pattern.test(content));
}
