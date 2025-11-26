import { AuthSplitLayout } from "src/layouts/auth-split";

// ----------------------------------------------------------------------

import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
