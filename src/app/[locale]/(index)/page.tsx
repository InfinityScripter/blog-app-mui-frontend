import { CONFIG } from "src/config-global";
import { getPosts } from "src/actions/blog-ssr";
import { HomeView } from "src/sections/home/view";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "src/utils/seo-alternates";
import { toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";

// ----------------------------------------------------------------------

// JSON-LD structured data: lets Google/Yandex build a richer snippet (and a
// Knowledge-panel / sitelinks-search-box) instead of guessing from page text.
// The site is an AI-driven news aggregator; Mihail Talalaev is its author.
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Talalaev — AI-агрегатор новостей",
      url: `${CONFIG.site.url}/`,
      inLanguage: "ru-RU",
      description:
        "AI-first агрегатор новостей: нейросеть (LLM) сама находит, фильтрует и кратко пересказывает свежие новости об искусственном интеллекте, IT и технологиях.",
      keywords:
        "AI-агрегатор, новости AI, искусственный интеллект, нейросеть, LLM, IT-новости, технологии",
      author: {
        "@type": "Person",
        name: "Михаил Талалаев",
        alternateName: "Mihail Talalaev",
        jobTitle: "Software Engineer",
      },
      potentialAction: {
        "@type": "SearchAction",
        target: `${CONFIG.site.url}/news/?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "Person",
      name: "Михаил Талалаев",
      alternateName: "Mihail Talalaev",
      url: `${CONFIG.site.url}/`,
      jobTitle: "Software Engineer",
      knowsAbout: [
        "Искусственный интеллект",
        "AI",
        "LLM",
        "React",
        "Next.js",
        "TypeScript",
      ],
    },
  ],
};

interface PageProps {
  params: Promise<{ locale: string }>;
}

// `title.absolute` opts out of the root template (`%s | Talalaev`) so the
// homepage title isn't doubled. Localized per locale; alternates carry the
// hreflang links for ru/en.
export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    ...localizedAlternates(locale, "/"),
  };
}

// ISR: server-render the homepage feed so the most-linked URL ships crawlable
// post HTML (was CSR-only — empty for crawlers/LLMs). Refreshed at most hourly,
// matching getPosts' native-fetch revalidate window.
export const revalidate = 3600;

// Prerender only the default-locale (Russian) home at build; EN renders
// on-demand against the warmed translation cache (mirrors /post, /tag/[slug]).
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  // Fetch the full feed server-side (all posts, newest-first via the list
  // endpoint — same data useGetPosts() reads). Localized titles come from the
  // warmed cache; getPosts retries transient failures and throws on a real
  // outage rather than caching an empty feed for the ISR window.
  const initialPosts = await getPosts(toAppLocale(locale));

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeView initialPosts={initialPosts} />
    </>
  );
}
