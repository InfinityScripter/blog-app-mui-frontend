import { CONFIG } from "src/config-global";
import { HomeView } from "src/sections/home/view";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "src/utils/seo-alternates";

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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />
      <HomeView />
    </>
  );
}
