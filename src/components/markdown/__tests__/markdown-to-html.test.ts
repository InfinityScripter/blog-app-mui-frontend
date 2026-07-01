import { it, expect, describe } from "vitest";
import { markdownToHtml } from "src/components/markdown/markdown-to-html";
import { isMarkdownContent } from "src/components/markdown/html-to-markdown";

describe("markdownToHtml", () => {
  it("converts a heading to <h1>", () => {
    expect(markdownToHtml("# Title")).toContain("<h1>Title</h1>");
  });

  it("converts bold and a bullet list", () => {
    const html = markdownToHtml("**bold**\n\n- one\n- two");
    expect(html).toContain("<strong>bold</strong>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<li>one</li>");
  });

  it("converts a GFM table", () => {
    const html = markdownToHtml("| a | b |\n| - | - |\n| 1 | 2 |");
    expect(html).toContain("<table>");
    expect(html).toContain("<td>1</td>");
  });

  it("converts a fenced code block", () => {
    const html = markdownToHtml("```\nconst x = 1;\n```");
    expect(html).toContain("<pre>");
    expect(html).toContain("<code>");
  });

  it("returns a string for empty input", () => {
    expect(markdownToHtml("")).toBe("");
  });

  it("output of a markdown source is no longer detected as markdown", () => {
    // Guards the editor round-trip: converted HTML must pass through untouched
    // on the next render instead of being re-converted.
    const html = markdownToHtml("# Title\n\n**bold**");
    expect(isMarkdownContent(html)).toBe(false);
  });
});
