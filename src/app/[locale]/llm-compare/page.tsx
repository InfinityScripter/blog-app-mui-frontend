import { CONFIG } from "src/config-global";
import { getReleases } from "src/actions/blog-ssr";
import { getTranslations } from "next-intl/server";
import { sortModels } from "src/sections/llm-compare/utils";
import { LLM_MODELS } from "src/sections/llm-timeline/const";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { localizedAlternates } from "src/utils/seo-alternates";
import { buildUnifiedLlmCatalog } from "src/utils/llm-catalog";
import { COMPARABLE_MODELS } from "src/sections/llm-compare/data";
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

// Fully static — data is a curated constant, no fetch (cannot fail on a backend).
export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "llmCompare.meta" });
  const { releases } = await getReleases();
  const catalog = buildUnifiedLlmCatalog(
    LLM_MODELS,
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
