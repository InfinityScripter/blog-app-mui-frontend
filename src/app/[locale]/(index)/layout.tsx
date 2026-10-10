import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";

// ----------------------------------------------------------------------

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
