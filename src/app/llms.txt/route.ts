import { CONFIG } from "src/config-global";
import { getPosts } from "src/actions/blog-ssr";
import { buildLlmsTxt } from "src/utils/llms-txt";

// ----------------------------------------------------------------------

// `/llms.txt` — a markdown site map for LLM crawlers (ChatGPT, Perplexity,
// Claude). Lists every post so an assistant can find and cite the source.
// ISR-cached; if the backend is unreachable at build time we still emit the
// header + an empty list rather than failing the build (mirrors feed.xml).
export const revalidate = 3600;

export async function GET() {
  let posts: Awaited<ReturnType<typeof getPosts>>["posts"] = [];
  try {
    ({ posts } = await getPosts());
  } catch {
    posts = [];
  }

  const body = buildLlmsTxt({
    siteName: CONFIG.site.name,
    siteUrl: CONFIG.site.url,
    tagline:
      "Русскоязычный блог про AI, LLM и агентов: кейсы, гайды и честные разборы.",
    posts,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
