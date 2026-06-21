"use client";

import "./styles.css";

import NProgress from "nprogress";
import { Suspense, useEffect } from "react";

import { NProgressDone } from "./n-progress-done";

// ----------------------------------------------------------------------

export function ProgressBar() {
  useEffect(() => {
    NProgress.configure({ showSpinner: false });

    const handleClick = (e: MouseEvent) => {
      const { target: eventTarget } = e;
      if (!(eventTarget instanceof Element)) return;

      const anchor = eventTarget.closest("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      const href = anchor.getAttribute("href");
      const target = anchor.getAttribute("target");
      const rel = anchor.getAttribute("rel");

      if (href?.startsWith("/") && target !== "_blank" && rel !== "noopener") {
        if (anchor.href !== window.location.href) {
          NProgress.start();
        }
      }
    };

    document.addEventListener("click", handleClick, { capture: true });

    const pushStateHandler: ProxyHandler<History["pushState"]> = {
      apply: (
        target,
        thisArg: History,
        argArray: Parameters<History["pushState"]>,
      ) => {
        NProgress.done();
        return target.apply(thisArg, argArray);
      },
    };

    window.history.pushState = new Proxy(
      window.history.pushState,
      pushStateHandler,
    );

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
