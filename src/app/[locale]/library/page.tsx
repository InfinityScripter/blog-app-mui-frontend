import { CONFIG } from "src/config-global";
import { getTranslations } from "next-intl/server";
import { localizedAlternates } from "src/utils/seo-alternates";
// Import directly from the view file (not a barrel) to keep the public bundle lean.
import { LibraryView } from "src/sections/library/view/library-view";
import { TOOL_ITEMS, READING_ITEMS } from "src/sections/library/data";

// ----------------------------------------------------------------------

const BASE_URL = CONFIG.site.url;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "library.meta" });
  return {
    title: t("title"),
    description: t("description"),
    ...localizedAlternates(locale, "/library/"),
    openGraph: {
      title: t("ogTitle"),
      description: t("ogDescription"),
      url: `${BASE_URL}/${locale}/library/`,
      type: "website",
    },
  };
}

// Fully static — data is a curated constant, no fetch (cannot fail on a backend).
export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "library.meta" });

  // ItemList of curated external resources → richer SERP + machine-readable.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: t("jsonLdName"),
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
