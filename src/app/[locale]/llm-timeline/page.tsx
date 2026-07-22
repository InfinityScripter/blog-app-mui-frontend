import { CONFIG } from "src/config-global";
import { getReleases } from "src/actions/blog-ssr";
import { getTranslations } from "next-intl/server";
import { LLM_MODELS } from "src/sections/llm-timeline/const";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { localizedAlternates } from "src/utils/seo-alternates";
import { buildUnifiedLlmCatalog } from "src/utils/llm-catalog";
import { COMPARABLE_MODELS } from "src/sections/llm-compare/data";
import { sortByReleaseDesc } from "src/sections/llm-timeline/utils";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LlmTimelineView } from "src/sections/llm-timeline/view/llm-timeline-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "llmTimeline.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/llm-timeline/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${BASE_URL}/${locale}/llm-timeline/`,
      type: "website",
    },
  };
}

export const revalidate = 600;

export default async function Page() {
  const { releases } = await getReleases();
  const catalog = buildUnifiedLlmCatalog(
    LLM_MODELS,
    COMPARABLE_MODELS,
    releases,
  );
  const models = sortByReleaseDesc(catalog.timelineModels);

  // ItemList matches visible order: newest releases first.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
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
      <LlmTimelineView models={models} />
    </>
  );
}
