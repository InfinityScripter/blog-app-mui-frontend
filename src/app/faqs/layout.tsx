import type { ReactNode } from "react";

// ----------------------------------------------------------------------
import { MainLayout } from "../../layouts/main";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
