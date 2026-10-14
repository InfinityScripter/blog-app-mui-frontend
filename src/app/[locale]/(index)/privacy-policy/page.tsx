import type { Metadata } from "next";

import { localizedAlternates } from "src/utils/seo-alternates";
import { PRIVACY_POLICY } from "src/sections/legal/legal-documents";
import { LegalDocumentView } from "src/sections/legal/legal-document-view";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  return {
    title: "Политика обработки персональных данных",
    description: "Правила обработки персональных данных на aifirst.us.com.",
    ...localizedAlternates(locale, "/privacy-policy/"),
  };
}

export default function Page() {
  return <LegalDocumentView content={PRIVACY_POLICY} />;
}
