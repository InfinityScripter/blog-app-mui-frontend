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
    resources: [
      {
        title: "Сравнение LLM",
        url: `${CONFIG.site.url}/llm-compare/`,
        description:
          "Матрица актуальных языковых моделей: цена за 1M токенов, окно контекста и бенчмарки (MMLU, GPQA, SWE-bench, AIME).",
      },
      {
        title: "История LLM",
        url: `${CONFIG.site.url}/llm-timeline/`,
        description:
          "Хронология больших языковых моделей от GPT-1 до reasoning-эры.",
      },
      {
        title: "Релизы AI-моделей",
        url: `${CONFIG.site.url}/changelog/`,
        description:
          "Хроника релизов языковых моделей с ключевыми характеристиками.",
      },
    ],
    posts,
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
