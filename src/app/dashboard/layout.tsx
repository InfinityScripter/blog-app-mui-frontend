import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";
import { AuthGuard } from "src/auth/guard";
import { DashboardLayout } from "src/layouts/dashboard";

// ----------------------------------------------------------------------

// Keep the entire dashboard/admin tree out of search indexes. robots.txt is a
// soft signal; this emits a hard `noindex, nofollow` meta tag that crawlers
// honour even when a URL leaks via an external link. Inherited by every
// /dashboard/* route (including /dashboard/admin/*).
export const metadata = {
  robots: { index: false, follow: false },
};

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
