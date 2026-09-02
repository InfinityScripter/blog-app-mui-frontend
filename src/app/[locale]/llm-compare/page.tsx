import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { sortModels } from "src/sections/llm-compare/utils";
import { LLM_MODELS } from "src/sections/llm-timeline/const";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { localizedAlternates } from "src/utils/seo-alternates";
import { buildUnifiedLlmCatalog } from "src/utils/llm-catalog";
import { COMPARABLE_MODELS } from "src/sections/llm-compare/data";
import { mergeTimelineModels } from "src/utils/llm-timeline-source";
import { getReleases, getTimelineModels } from "src/actions/blog-ssr";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LlmCompareView } from "src/sections/llm-compare/view/llm-compare-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "llmCompare.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/llm-compare/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${BASE_URL}/${locale}/llm-compare/`,
      type: "website",
    },
  };
}

// Reads the release feed and the remote timeline entries with the same ISR
// window as /changelog; a persistent backend failure must throw, not cache.
export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "llmCompare.meta" });
  const [{ releases }, timelineModels] = await Promise.all([
    getReleases(),
    getTimelineModels(),
  ]);
  const catalog = buildUnifiedLlmCatalog(
    mergeTimelineModels(LLM_MODELS, timelineModels),
    COMPARABLE_MODELS,
    releases,
  );
  const models = sortModels(catalog.comparableModels, "release", "desc");

  // ItemList of the compared models → richer SERP + machine-readable for LLMs.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("jsonLdName"),
    itemListElement: models.map((model, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${model.vendor} ${model.name}`.trim(),
      url: model.sourceUrl,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <LlmCompareView models={models} pricingAsOf={catalog.pricingAsOf} />
    </>
  );
}
