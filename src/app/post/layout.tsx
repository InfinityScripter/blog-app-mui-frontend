import { MainLayout } from "src/layouts/main";

import { AuthProvider } from "../../auth/context/jwt";

// ----------------------------------------------------------------------

import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}
