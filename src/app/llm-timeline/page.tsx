import { CONFIG } from "src/config-global";
import { LLM_MODELS } from "src/sections/llm-timeline/const";
import { sortByReleaseAsc } from "src/sections/llm-timeline/utils";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LlmTimelineView } from "src/sections/llm-timeline/view/llm-timeline-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export const metadata = {
  title: "История LLM: хронология больших языковых моделей",
  description:
    "Хронология ключевых больших языковых моделей от старых к новым — даты выхода, размер контекста, параметры и краткий разбор значимости каждой модели.",
  alternates: { canonical: `${BASE_URL}/llm-timeline/` },
  openGraph: {
    title: "История LLM | Talalaev",
    description:
      "Ключевые LLM от GPT до современных моделей: даты, контекст и значимость в одной хронологии.",
    url: `${BASE_URL}/llm-timeline/`,
    type: "website",
  },
};

// Fully static — data is a curated constant, no fetch.
export default function Page() {
  const models = sortByReleaseAsc(LLM_MODELS);

  // ItemList of the models in chronological order → richer SERP for the page.
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LlmTimelineView models={models} />
    </>
  );
}
