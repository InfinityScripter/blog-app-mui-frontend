import { CONFIG } from "src/config-global";
import { COMPARABLE_MODELS } from "src/sections/llm-compare/data";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LlmCompareView } from "src/sections/llm-compare/view/llm-compare-view";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export const metadata = {
  title: "Сравнение LLM: цена, контекст и бенчмарки языковых моделей",
  description:
    "Матрица сравнения актуальных LLM: цена за 1M токенов (вход/выход), окно контекста и ключевые бенчмарки (MMLU, GPQA, SWE-bench, AIME). Сортировка, фильтры и сравнение до трёх моделей.",
  alternates: { canonical: `${BASE_URL}/llm-compare/` },
  openGraph: {
    title: "Сравнение LLM | Talalaev",
    description:
      "Цена, контекст и бенчмарки актуальных языковых моделей в одной сравнительной таблице.",
    url: `${BASE_URL}/llm-compare/`,
    type: "website",
  },
};

// Fully static — data is a curated constant, no fetch (cannot fail on a backend).
export default function Page() {
  // ItemList of the compared models → richer SERP + machine-readable for LLMs.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Сравнение больших языковых моделей",
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
