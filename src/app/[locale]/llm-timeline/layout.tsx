import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";

// ----------------------------------------------------------------------
// Только MainLayout: AuthProvider уже оборачивает всё дерево в
// src/app/[locale]/layout.tsx — второй экземпляр здесь дублировал бы
// GET /me на каждый просмотр страницы.

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <MainLayout>{children}</MainLayout>;
}
