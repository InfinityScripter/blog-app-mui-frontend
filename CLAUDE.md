# CLAUDE.md — blog-app-mui-frontend

Guidance for Claude Code working in this frontend repo. Full monorepo
architecture (frontend + backend, deploy, env) lives in the parent
`../CLAUDE.md`; this file focuses on **frontend gotchas** — the things that are
easy to get wrong and have bitten us before.

## Stack

Next.js 15 (App Router) + React 19, MUI v7, TypeScript. Port 3033.
`npm run dev` · `npm run build` · `npm run lint` / `lint:fix` · `npm run knip`.

## Gotchas — read before you touch these

### 1. Header/footer: every top-level public route needs its own `layout.tsx`

The root `src/app/layout.tsx` wraps **only** `AuthProvider` — it does **not**
render `MainLayout`. The site header + footer come from `MainLayout`, and each
public route mounts it via its own `src/app/<route>/layout.tsx`:

```tsx
import { MainLayout } from "src/layouts/main";
import { AuthProvider } from "../../auth/context/jwt";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <MainLayout>{children}</MainLayout>
    </AuthProvider>
  );
}
```

- Have it: `llm-timeline`, `changelog`, `news`, `llm-compare`, `library`.
- Routes inside the `(index)` route group (home, `portfolio`) inherit
  `src/app/(index)/layout.tsx`.
- **A new top-level route without `layout.tsx` renders with no header/footer.**
  Always add it. (This bit us — fixed in PR #18 for `/llm-compare`, `/library`.)
- **Do NOT double-wrap `MainLayout`.** A nested layout above an already-wrapped
  one renders two headers/footers (the `changelog/[slug]` bug, PR #14).

### 2. Verify header/footer in a real browser — never by grepping HTML

Public pages render client-side: the raw SSR/prod HTML shows `<header>` **0
times** (MUI `AppBar` only appears after hydration). That is **not** a bug.
`curl | grep '<header'` gives a false "broken". Verify with Playwright against
the rendered DOM (`document.querySelector('header')`) after navigation. Some
routes (e.g. `news`) prerender and _do_ show `<header>` in HTML — the
discrepancy with `llm-compare`/`library` is expected, not a regression.

### 3. Unit tests use Vitest, not Jest

- Run all: `npm run test:unit` · one file: `npx vitest run <path>`.
- Test files **must** explicitly `import { it, expect, describe } from "vitest"`
  — there are no globals (else `describe is not defined`).
- `vitest.config.ts` `include` is an allow-list of dirs; `__tests__/*.test.ts`
  inside a section is picked up. (Jest is the **backend's** runner only.)

### 4. `max-lines` is locked at error (200)

One React component per file, ≤200 lines (`skipBlankLines`, `skipComments`).
Split growth into sub-components / `const.ts` / `types.ts` / `utils.ts`.
**Curated static data files** (arrays, no logic) are exempt via `overrides` in
`.eslintrc.cjs` — see `src/sections/{llm-timeline,llm-compare,library}/data/**`.
Add new data dirs there, don't inline giant arrays into components.

### 5. ES5 target — no `for-of`/`while`/generators in `src`

Airbnb + es5 build forbids `for-of`, `while`, `continue`, generators. Write
functional array code (`map`/`filter`/`reduce`). Husky blocks commits on lint
error.

### 6. No `as`, no `any`, string params must be unions/enums

Hard TS rules in this repo: no type assertions, no `any`; a string-typed
parameter that has a fixed set of values must be a union/enum, not `string`.

### 7. Hooks live in `hooks/`, separate from JSX

Business logic (custom hooks) never sits next to a component file — it lives in
a `hooks/` folder (module-local `<module>/hooks/use-x.ts`, or global
`src/hooks/`). The module re-exports it via its `index.ts`.

### 8. Sections are page-specific and isolated

`src/sections/*` components are paired to pages and must not be imported by
other sections or by `src/components`. The one documented exception:
`llm-compare` and `library` import display-only vendor helpers from
`src/sections/llm-timeline/utils` (color/icon maps) — duplicating those maps
would drift. Keep such cross-section imports display-only and rare.

### 9. Guard every SSG/ISR fetch

A public page that fetches at build/regenerate time must `try/catch` — one
backend 500 during a deploy window otherwise fails the whole Vercel build (or
caches a 404 for an hour). Fully static pages (no fetch — like `llm-compare`,
`library`, `llm-timeline`) can't hit this.

## Deploy

Push to `main` → Vercel auto-deploys the frontend (aliases `aifirst.us.com`,
`talalaev.su`). Static pages are edge-cached; a fresh deploy re-prerenders them,
but confirm the live prod in a browser after the deployment is READY — not by
cache age. The direct `blog-<hash>.vercel.app` URL is Vercel-auth protected
(fetch 401).
