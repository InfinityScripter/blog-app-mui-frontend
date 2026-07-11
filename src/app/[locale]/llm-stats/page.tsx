import { CONFIG } from "src/config-global";
import { getPublicLlmStats } from "src/actions/blog-ssr";
import { localizedAlternates } from "src/utils/seo-alternates";
import { getTranslations, setRequestLocale } from "next-intl/server";
// Import directly from the view file to keep the public bundle lean.
import { PublicLlmStatsView } from "src/sections/llm-stats/view/public-llm-stats-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("llmStats");

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    ...localizedAlternates(locale, "/llm-stats/"),
    openGraph: {
      title: t("meta.ogTitle"),
      description: t("meta.description"),
      url: `${BASE_URL}/${locale}/llm-stats/`,
      type: "website",
    },
  };
}

// ISR: refreshed at most every 10 minutes (matches the public endpoint cache).
export const revalidate = 600;

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const { bundle, pushedAt } = await getPublicLlmStats();

  // JSON-LD Dataset — this page IS a citable primary-source dataset (real
  // token/model/cost usage), exactly what LLMs and search love to reference.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Real LLM usage & cost — aifirst.us.com",
    description:
      "Aggregate token counts, model/harness split, activity trend and cost estimate from the author's real day-to-day AI usage. Updated regularly.",
    url: `${BASE_URL}/${locale}/llm-stats/`,
    creator: { "@type": "Person", name: "Mihail Talalaev" },
    ...(pushedAt ? { dateModified: pushedAt } : {}),
    license: "https://creativecommons.org/licenses/by/4.0/",
    isAccessibleForFree: true,
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PublicLlmStatsView stats={bundle} pushedAt={pushedAt} />
    </>
  );
}
