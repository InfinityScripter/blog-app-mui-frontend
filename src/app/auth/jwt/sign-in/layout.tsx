import { AuthSplitLayout } from "src/layouts/auth-split";

import { GuestGuard } from "src/auth/guard";

// ----------------------------------------------------------------------

import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <GuestGuard>
      <AuthSplitLayout section={{ title: "Привет, С возвращением" }}>
        {children}
      </AuthSplitLayout>
    </GuestGuard>
  );
}
