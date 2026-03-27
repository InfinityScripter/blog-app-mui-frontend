import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";
import { AuthProvider } from "src/auth/context/jwt";

// ----------------------------------------------------------------------

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
