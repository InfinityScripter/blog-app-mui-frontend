import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";

// ----------------------------------------------------------------------
// Wraps the newsletter confirm / unsubscribe status pages in the public site
// shell (header + footer) so they read as real pages, not a lone card floating
// on a blank white background. Только MainLayout: AuthProvider уже оборачивает
// всё дерево в src/app/[locale]/layout.tsx.

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
