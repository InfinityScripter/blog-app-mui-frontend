"use client";

import NProgress from "nprogress";
import { useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "src/routes/hooks";

// ----------------------------------------------------------------------

export function NProgressDone() {
  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, router, searchParams]);

  return null;
}
