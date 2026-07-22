import type { Metadata } from "next";

import { PERSONAL_DATA_CONSENT } from "src/sections/legal/legal-documents";
import { LegalDocumentView } from "src/sections/legal/legal-document-view";

export const metadata: Metadata = {
  title: "Согласие на обработку персональных данных",
  description: "Условия согласия на обработку персональных данных.",
};

export default function Page() {
  return <LegalDocumentView content={PERSONAL_DATA_CONSENT} />;
}
