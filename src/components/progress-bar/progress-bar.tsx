"use client";

import "./styles.css";

import NProgress from "nprogress";
import { Suspense, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "src/routes/hooks";

// ----------------------------------------------------------------------

export function ProgressBar() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest?.("a[href]");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      const rel = anchor.getAttribute("rel");

      if (href?.startsWith("/") && target !== "_blank" && rel !== "noopener") {
        if ((anchor as HTMLAnchorElement).href !== window.location.href) {
          NProgress.start();
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    window.history.pushState = new Proxy(window.history.pushState, {
      apply: (target, thisArg, argArray) => {
        NProgress.done();
        return target.apply(thisArg, argArray);
      },
    });

    return () => {
      document.removeEventListener("click", handleClick, { capture: true });
    };
  }, []);

  return (
    <Suspense fallback={null}>
      <NProgressDone />
    </Suspense>
  );
}

// ----------------------------------------------------------------------

function NProgressDone() {
  const pathname = usePathname();

  const router = useRouter();

  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, router, searchParams]);

  return null;
}
