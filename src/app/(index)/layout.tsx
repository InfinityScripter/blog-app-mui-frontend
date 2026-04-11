import type { ReactNode } from "react";

import { MainLayout } from "src/layouts/main";

// ----------------------------------------------------------------------

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <>
      <link
        rel="preload"
        as="image"
        href="/assets/background/background-3.webp"
        type="image/webp"
      />
      <MainLayout>{children}</MainLayout>
    </>
  );
}
