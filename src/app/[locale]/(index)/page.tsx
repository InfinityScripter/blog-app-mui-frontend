import { CONFIG } from "src/config-global";
import { HomeView } from "src/sections/home/view";
import { DEFAULT_LOCALE } from "src/i18n/locales";
import { getTranslations } from "next-intl/server";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { localizedAlternates } from "src/utils/seo-alternates";

// ----------------------------------------------------------------------

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Life Style",
      url: `${CONFIG.site.url}/`,
      inLanguage: "ru-RU",
      description:
        "ИИ простыми словами: короткие ролики про нейросети, игровая карта из 12 уроков и тест на минуту.",
      keywords:
        "ИИ простыми словами, нейросети для начинающих, LLM, Claude Code, Codex, Life Style",
      author: {
        "@type": "Person",
        name: "Михаил Талалаев",
        alternateName: "Mihail Talalaev",
        jobTitle: "AI Engineer",
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
      jobTitle: "AI Engineer",
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

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    ...localizedAlternates(locale, "/"),
  };
}

// Prerender only the default-locale (Russian) home at build; EN renders
// on-demand against the warmed translation cache (mirrors /post, /tag/[slug]).
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(JSON_LD) }}
      />
      <HomeView />
    </>
  );
}
