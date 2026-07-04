import type { Post } from "src/types/domain";

// ----------------------------------------------------------------------
// Build an `/llms.txt` document (https://llmstxt.org) — a markdown site map
// aimed at LLMs: a titled intro plus a flat list of posts (title, one-line
// description, canonical URL). Pure function so the route stays thin and this
// is unit-testable.

interface BuildLlmsTxtParams {
  siteName: string;
  siteUrl: string;
  tagline: string;
  posts: Post[];
}

function postLine(siteUrl: string, post: Post): string | null {
  const id = post._id ?? post.id;
  if (!id) return null;

  const title = (post.title ?? "").trim() || "Без названия";
  const url = `${siteUrl}/post/${id}/`;
  const description = (post.description ?? "").replace(/\s+/g, " ").trim();

  return description
    ? `- [${title}](${url}): ${description}`
    : `- [${title}](${url})`;
}

export function buildLlmsTxt({
  siteName,
  siteUrl,
  tagline,
  posts,
}: BuildLlmsTxtParams): string {
  const header = `# ${siteName}\n> ${tagline}`;

  const lines = posts
    .map((post) => postLine(siteUrl, post))
    .filter((line): line is string => line !== null);

  const list =
    lines.length > 0
      ? `## Посты\n${lines.join("\n")}`
      : "## Посты\nСписок временно недоступен.";

  return `${header}\n\n${list}\n`;
}
