import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";

// ----------------------------------------------------------------------
// Wraps the newsletter confirm / unsubscribe status pages in the public site
// shell (header + footer) so they read as real pages, not a lone card floating
// on a blank white background.
import { AuthProvider } from "../../auth/context/jwt";

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
