import type { Post } from "src/types/domain";
import type { FaqItem } from "src/utils/post-geo-content";

import { CONFIG } from "src/config-global";
import { NEWS_TAG } from "src/sections/news/const";
import { deriveSource, deriveSourceUrl } from "src/sections/news/utils";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;
const PUBLISHER = { "@type": "Person", name: "Михаил Талалаев" } as const;

/**
 * Builds the JSON-LD for a post page. Posts tagged `новости` are aggregated
 * news, so they emit `NewsArticle` with `isBasedOn`/`citation` pointing at the
 * original source (the site is an AI aggregator — it must attribute, not claim
 * authorship). Authored blog posts emit plain `Article`. Returns null when the
 * post is missing so the caller can skip the <script>.
 */
export function buildPostJsonLd(post: Post | undefined, id: string) {
  if (!post) return null;

  const isNews = (post.tags ?? []).some(
    (tag) => tag.toLowerCase() === NEWS_TAG,
  );

  const base = {
    "@context": "https://schema.org",
    "@type": isNews ? "NewsArticle" : "Article",
    headline: post.title,
    description: post.description,
    image: post.coverUrl ? [post.coverUrl] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt ?? post.createdAt,
    author: PUBLISHER,
    publisher: PUBLISHER,
    mainEntityOfPage: `${BASE_URL}/post/${id}/`,
  };

  if (!isNews) return base;

  // News: attribute the original source when the bot recorded one.
  const sourceName = deriveSource(post);
  const sourceUrl = deriveSourceUrl(post);
  return {
    ...base,
    ...(sourceUrl && { isBasedOn: sourceUrl, sameAs: sourceUrl }),
    ...(sourceName && {
      citation: sourceUrl
        ? { "@type": "CreativeWork", name: sourceName, url: sourceUrl }
        : sourceName,
    }),
  };
}

// ----------------------------------------------------------------------

/**
 * Reduce a markdown answer to a single plain-text string for the schema.org
 * `Answer.text` field, which is rendered verbatim by search engines and does
 * not interpret markdown. Strips heading/emphasis/list/link/code markers and
 * collapses whitespace. Intentionally simple — enough to remove syntax noise,
 * not a full markdown parser.
 */
function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`([^`]+)`/g, "$1") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links → link text
    .replace(/^[ \t]*#{1,6}[ \t]+/gm, "") // ATX headings
    .replace(/^[ \t]*>[ \t]?/gm, "") // blockquotes
    .replace(/^[ \t]*[-*+][ \t]+/gm, "") // unordered list markers
    .replace(/^[ \t]*\d+\.[ \t]+/gm, "") // ordered list markers
    .replace(/(\*\*|__|\*|_|~~)/g, "") // emphasis / strikethrough
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Builds `FAQPage` JSON-LD from parsed FAQ entries so a post with a `## FAQ`
 * section can win an FAQ rich result. Returns null for an empty list (caller
 * skips the <script>). Answers are flattened to plain text — schema.org does
 * not render markdown in `Answer.text`.
 */
export function buildFaqJsonLd(faq: FaqItem[]) {
  if (faq.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: stripMarkdown(item.answer),
      },
    })),
  };
}
