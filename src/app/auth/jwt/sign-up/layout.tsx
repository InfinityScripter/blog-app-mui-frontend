import type { ReactNode } from "react";

import { GuestGuard } from "src/auth/guard";
// ----------------------------------------------------------------------
import { AuthSplitLayout } from "src/layouts/auth-split";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <GuestGuard>
      <AuthSplitLayout>{children}</AuthSplitLayout>
    </GuestGuard>
  );
}
