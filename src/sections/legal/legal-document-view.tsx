"use client";

import Container from "@mui/material/Container";
import { Markdown } from "src/components/markdown";

interface LegalDocumentViewProps {
  content: string;
}

export function LegalDocumentView({ content }: LegalDocumentViewProps) {
  return (
    <Container maxWidth="md" sx={{ py: { xs: 5, md: 8 } }}>
      <Markdown>{content}</Markdown>
    </Container>
  );
}
