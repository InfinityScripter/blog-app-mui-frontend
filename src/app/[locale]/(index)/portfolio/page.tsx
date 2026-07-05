import { getTranslations } from "next-intl/server";
import { PortfolioView } from "src/sections/portfolio/view";
import { localizedAlternates } from "src/utils/seo-alternates";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portfolio.meta" });
  return {
    title: { absolute: t("title") },
    description: t("description"),
    ...localizedAlternates(locale, "/portfolio/"),
  };
}

export default function Page() {
  return <PortfolioView />;
}
