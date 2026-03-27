import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { AuthGuard } from "src/auth/guard";
import { DashboardLayout } from "src/layouts/dashboard";

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
