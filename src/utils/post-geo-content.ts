import {
  htmlToMarkdown,
  isMarkdownContent,
} from "src/components/markdown/html-to-markdown";

// ----------------------------------------------------------------------
// GEO post-template parsing: pull a `## FAQ` section out of post content and
// expose it as structured Q/A, leaving the rest as the article body. Pure
// functions — no JSX, no DOM assumptions beyond turndown (which ships its own
// HTML parser and runs in node).

export interface FaqItem {
  /** Plain heading text of the `### question`. */
  question: string;
  /** Answer body as markdown (may contain lists, code, tables). */
  answer: string;
}

interface ParsedPostContent {
  /** Article content with the FAQ section removed (markdown). */
  body: string;
  /** Parsed FAQ entries; empty when the post has no `## FAQ` section. */
  faq: FaqItem[];
}

// A level-2 heading whose text is one of the known FAQ labels. Case-insensitive,
// line-anchored. Capturing the whole line lets us locate the section boundary.
const FAQ_HEADING =
  /^##[ \t]+(?:FAQ|Часто задаваемые вопросы|Частые вопросы)[ \t]*$/im;

/** Any level-2 heading — used to find where the FAQ section ends. */
const H2_LINE = /^##[ \t]+\S/;

/** A level-3 heading line — each one opens a new question inside the section. */
const H3_LINE = /^###[ \t]+(.*\S)[ \t]*$/;

/**
 * Normalise post content (HTML from Tiptap or markdown from the bot) to a
 * markdown string, then split off any `## FAQ` section. Returns the remaining
 * body and the parsed FAQ entries. Empty input yields an empty body and no FAQ.
 */
export function parsePostContent(content?: string): ParsedPostContent {
  if (!content || !content.trim()) {
    return { body: "", faq: [] };
  }

  const normalized = isMarkdownContent(content)
    ? content
    : htmlToMarkdown(content);
  const markdown = normalizeHeadings(normalized);

  const headingMatch = FAQ_HEADING.exec(markdown);
  if (!headingMatch) {
    return { body: markdown.trim(), faq: [] };
  }

  const sectionStart = headingMatch.index;
  const afterHeading = sectionStart + headingMatch[0].length;

  // The FAQ section runs until the next level-2 heading (or end of content).
  const rest = markdown.slice(afterHeading);
  const nextH2 = findNextH2(rest);
  const sectionEnd = nextH2 === -1 ? markdown.length : afterHeading + nextH2;

  const sectionBody = markdown.slice(afterHeading, sectionEnd);
  const faq = parseFaqSection(sectionBody);

  const body = `${markdown.slice(0, sectionStart)}\n\n${markdown.slice(
    sectionEnd,
  )}`.trim();

  return { body, faq };
}

// `htmlToMarkdown` (turndown here) is configured to KEEP most HTML tags verbatim
// — including `<h2>`/`<h3>` and `<p>` — so its output is markdown-ish but still
// carries raw heading tags. For FAQ extraction we need real `##`/`###` markers,
// so convert kept heading tags to ATX headings and unwrap paragraph tags. Only
// touches heading/paragraph wrappers; inline HTML inside answers is left intact
// and rendered later by `<Markdown>`.
const HTML_HEADING = /<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi;
const OPEN_P = /<p[^>]*>/gi;
const CLOSE_P = /<\/p>/gi;

function normalizeHeadings(markdown: string): string {
  return markdown
    .replace(HTML_HEADING, (_match, level: string, inner: string) => {
      const hashes = "#".repeat(Number(level));
      return `\n\n${hashes} ${inner.trim()}\n\n`;
    })
    .replace(OPEN_P, "\n\n")
    .replace(CLOSE_P, "\n\n");
}

/**
 * Index (into `text`) of the first line that is a level-2 heading, or -1.
 * Operates line-by-line so the offset maps back onto the original string.
 */
function findNextH2(text: string): number {
  const lines = text.split("\n");
  const offsets = lineOffsets(lines);
  const hitIndex = lines.findIndex((line) => H2_LINE.test(line));
  return hitIndex === -1 ? -1 : offsets[hitIndex];
}

/** Cumulative character offset at the start of each line (accounting for `\n`). */
function lineOffsets(lines: string[]): number[] {
  return lines.reduce<number[]>((acc, line, index) => {
    if (index === 0) {
      acc.push(0);
      return acc;
    }
    acc.push(acc[index - 1] + lines[index - 1].length + 1);
    return acc;
  }, []);
}

/**
 * Parse the inside of a FAQ section: each `### heading` opens a question, the
 * text up to the next `###` (still inside the section) is its answer. Questions
 * with an empty answer are dropped.
 */
function parseFaqSection(section: string): FaqItem[] {
  const lines = section.split("\n");

  // Group lines into blocks, each starting at a `### heading`.
  const blocks = lines.reduce<string[][]>((acc, line) => {
    if (H3_LINE.test(line)) {
      acc.push([line]);
    } else if (acc.length > 0) {
      acc[acc.length - 1].push(line);
    }
    return acc;
  }, []);

  return blocks
    .map((block) => {
      const [headingLine, ...answerLines] = block;
      const headingMatch = H3_LINE.exec(headingLine);
      const question = headingMatch ? headingMatch[1].trim() : "";
      const answer = answerLines.join("\n").trim();
      return { question, answer };
    })
    .filter((item) => item.question !== "" && item.answer !== "");
}

// ----------------------------------------------------------------------

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * True when `updatedAt` is meaningfully later than `createdAt` (> 24h), so the
 * post page should surface a visible "Обновлено" date. Guards against showing a
 * near-duplicate of the publish date, which would just be noise.
 */
export function isMeaningfullyUpdated(
  createdAt?: string | Date,
  updatedAt?: string | Date,
): boolean {
  if (!createdAt || !updatedAt) return false;

  const created = new Date(createdAt).getTime();
  const updated = new Date(updatedAt).getTime();

  if (Number.isNaN(created) || Number.isNaN(updated)) return false;

  return updated - created > DAY_MS;
}
