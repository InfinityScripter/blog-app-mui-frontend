import type { ReactNode } from "react";

import { CONFIG } from "src/config-global";

// Root-level 404 for paths that never enter a `[locale]` segment (the locale
// layout owns `<html>`, so this one must render its own shell). Locale-scoped
// not-found pages live at src/app/[locale]/not-found.tsx with the full styled
// view. Kept intentionally minimal and dependency-free.
export const metadata = {
  title: `404 — ${CONFIG.site.name}`,
};

function RootNotFound(): ReactNode {
  return (
    <html lang="ru">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1 style={{ fontSize: 48, margin: 0 }}>404</h1>
          <p>
            <a href="/ru">На главную</a>
          </p>
        </div>
      </body>
    </html>
  );
}

export default RootNotFound;
