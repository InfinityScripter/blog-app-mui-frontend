import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "src/utils/seo-alternates";
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

  // ItemList of the compared models → richer SERP + machine-readable for LLMs.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("jsonLdName"),
    itemListElement: COMPARABLE_MODELS.map((model, index) => ({
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LlmCompareView />
    </>
  );
}
