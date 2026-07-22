import type { Metadata } from "next";

import { PRIVACY_POLICY } from "src/sections/legal/legal-documents";
import { LegalDocumentView } from "src/sections/legal/legal-document-view";

export const metadata: Metadata = {
  title: "Политика обработки персональных данных",
  description: "Правила обработки персональных данных на aifirst.us.com.",
};

export default function Page() {
  return <LegalDocumentView content={PRIVACY_POLICY} />;
}
