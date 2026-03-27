import type { ReactNode } from "react";

// ----------------------------------------------------------------------
import { AuthSplitLayout } from "src/layouts/auth-split";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
