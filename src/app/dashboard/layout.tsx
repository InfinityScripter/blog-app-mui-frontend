import { CONFIG } from "src/config-global";
import { DashboardLayout } from "src/layouts/dashboard";

import { AuthGuard } from "src/auth/guard";

import type { ReactNode } from "react";

// ----------------------------------------------------------------------

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  if (CONFIG.auth.skip) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthGuard>
  );
}
