import { CONFIG } from "src/config-global";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LibraryView } from "src/sections/library/view/library-view";
import { TOOL_ITEMS, READING_ITEMS } from "src/sections/library/data";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

export const metadata = {
  title: "Библиотека: что читать про AI, инструменты и заметки TIL",
  description:
    "Курируемая подборка лучших источников про AI и LLM, каталог полезных инструментов и короткие заметки из практики (TIL). Без хайпа, обновляется.",
  alternates: { canonical: `${BASE_URL}/library/` },
  openGraph: {
    title: "Библиотека | Talalaev",
    description:
      "Лучшие источники про AI, каталог инструментов и заметки из практики в одном месте.",
    url: `${BASE_URL}/library/`,
    type: "website",
  },
};

// Fully static — data is a curated constant, no fetch (cannot fail on a backend).
export default function Page() {
  // ItemList of curated external resources → richer SERP + machine-readable.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Библиотека: источники и инструменты по AI",
    itemListElement: [...READING_ITEMS, ...TOOL_ITEMS].map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: "title" in entry ? entry.title : entry.name,
      url: entry.url,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LibraryView />
    </>
  );
}
