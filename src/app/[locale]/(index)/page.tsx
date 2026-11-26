import { CONFIG } from "src/config-global";
import { HomeView } from "src/sections/home/view";
import { getTranslations } from "next-intl/server";
import { serializeJsonLd } from "src/utils/serialize-json-ld";
import { localizedPageMetadata } from "src/utils/seo-alternates";
import { LOCALES, toAppLocale, DEFAULT_LOCALE } from "src/i18n/locales";

// ----------------------------------------------------------------------

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const title = t("title");
  const description = t("description");

  return {
    ...localizedPageMetadata(toAppLocale(locale), "/", { title, description }),
    title: { absolute: title },
  };
}

export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  const siteId = `${CONFIG.site.url}/#website`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": siteId,
        name: "Life Style",
        // Google may reject "Life Style" as too generic and then shows the
        // site name of the parent domain us.com ("US.COM"). Our own host as
        // an alternate gives it a backup it "strongly considers".
        alternateName: ["aifirst.us.com"],
        url: `${CONFIG.site.url}/`,
        inLanguage: LOCALES,
        author: { "@type": "Person", name: "Михаил Талалаев" },
      },
      {
        "@type": "WebPage",
        url: `${CONFIG.site.url}/${locale}/`,
        name: t("title"),
        description: t("description"),
        inLanguage: locale,
        isPartOf: { "@id": siteId },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <HomeView />
    </>
  );
}
