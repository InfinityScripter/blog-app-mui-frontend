import { MainLayout } from "../../layouts/main";

// ----------------------------------------------------------------------

import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
