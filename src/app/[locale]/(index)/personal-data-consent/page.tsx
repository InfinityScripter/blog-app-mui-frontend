import type { Metadata } from "next";

import { localizedAlternates } from "src/utils/seo-alternates";
import { PERSONAL_DATA_CONSENT } from "src/sections/legal/legal-documents";
import { LegalDocumentView } from "src/sections/legal/legal-document-view";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Согласие на обработку персональных данных",
    description: "Условия согласия на обработку персональных данных.",
    ...localizedAlternates(locale, "/personal-data-consent/"),
  };
}

export default function Page() {
  return <LegalDocumentView content={PERSONAL_DATA_CONSENT} />;
}
