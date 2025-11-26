import { useEffect, type ReactNode } from "react";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";

import type { ThemeDirection } from "src/types/domain";

// ----------------------------------------------------------------------

const cacheRtl = createCache({
  key: "rtl",
  prepend: true,
  stylisPlugins: [rtlPlugin],
});

interface RTLProps {
  children: ReactNode;
  direction: ThemeDirection;
}

export function RTL({ children, direction }: RTLProps) {
  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  if (direction === "rtl") {
    return <CacheProvider value={cacheRtl}>{children}</CacheProvider>;
  }

  return <>{children}</>;
}
