# AGENTS.md — blog-app-mui-frontend

Guidance for AI agents (Claude Code, Cursor, Copilot, Codex, …) writing code in
this repo. The full style reference is [`.cursor/rules/code-style.mdc`](.cursor/rules/code-style.mdc);
this file is the short, agent-facing source of truth. **Follow it exactly.**

## Stack

**Next.js 15 (App Router) + React 19 + MUI v7**, built on the Minimals.cc
template. SWR for data, React Hook Form + Zod for forms, Tiptap for the editor.
Port **3033** (`npm run dev`). Backend is a separate repo on port 7272.

> Env is build-time, `NEXT_PUBLIC_`-prefixed, read via `process.env` — NOT
> `import.meta.env` / `VITE_`. Routing is `next/navigation` via
> `src/routes/hooks`, paths in `src/routes/paths.ts`.

## Non-negotiable rules

1. **kebab-case files/folders, named-export functions.** Never PascalCase a
   filename. Never mass-rename. The codebase is kebab-case — keep it.
2. **No `any`. No type assertions (`as` / `as const` / `as unknown as`).** Fix
   the cause: annotate the source, or use `unknown` + a runtime narrow. The only
   sanctioned `as` is a documented third-party-type augmentation in
   `src/types/*.d.ts` (e.g. `theme.vars`), never inline at a call site.
3. **String params with a fixed value set are a union/enum**, never bare
   `string`. e.g. `type Variant = "filled" | "outlined"`.
4. **No suppressions.** `@ts-nocheck` / `@ts-ignore` are **banned by lint**
   (`ban-ts-comment` = error). `@ts-expect-error` only with a ≥10-char reason.
   Don't `eslint-disable` to push code through — fix the cause.
5. **Forms use RHF.** React Hook Form + Zod via `src/components/hook-form/`;
   use `RHF*` field components, never raw MUI inputs in a form.
6. **Styling via MUI `sx` + theme palette** (`theme.palette`, `alpha(...)`) so
   light/dark + primary-color switching work. Don't hardcode palette hex in CSS.
7. **Sections are isolated.** A file under `src/sections/X/` must NOT import from
   `src/sections/Y/`. Shared UI lives in `src/components/`.
8. **No circular deps** (`import/no-cycle` = error). **No unused vars/imports**
   (error repo-wide; `_`-prefix intentional-unused). **No dead files** — knip
   must stay at 0 unused files/deps. Build features in `src/sections/` +
   `src/app/`, don't resurrect vendored template areas.

## When to split a component

Split by _what's extractable_, never to hit a line count. A 350-line form that's
all markup + handlers does NOT need splitting; a 120-line component with a 60-line
inline data array DOES.

- `const.ts` — data the component renders (card lists, FAQ entries, skills…).
  Inline a one-off scalar or a style object used once.
- `types.ts` — a non-trivial own type shared across sub-components. A 2–3 prop
  inline `interface FooProps` stays inline.
- `utils.ts` — a pure helper (formatting, `sx` mapping) with no JSX.
- `index.ts` — only when the dir is imported from outside the section.

## Verification gates (run before claiming done)

All must be green. CI (`.github/workflows/frontend-ci.yml`) enforces them on PRs.

```bash
npx tsc --noEmit                                   # 0 errors
yarn lint                                          # 0 errors AND 0 warnings
npx madge --circular --extensions ts,tsx src       # no circular deps
yarn build                                         # must compile (catches deleted
                                                   #   .css @imports that tsc misses)
yarn knip                                          # 0 unused files / deps
```

E2E (`yarn e2e`) needs the backend on :7272 **and Postgres running** — a backend
500 with `ECONNREFUSED 5432` means Postgres is down, not your code.

## Gotchas (these have bitten before)

- **Dual lockfiles.** The repo has BOTH `package-lock.json` and `yarn.lock`; CI
  runs `yarn install --frozen-lockfile`. If you change deps, run `yarn install`
  (resync yarn.lock) AND `npm install --package-lock-only`, then verify
  `yarn install --frozen-lockfile` exits 0. A stale yarn.lock fails CI.
- **tsc does not trace `.css` `@import`s.** Deleting a component dir that has a
  `styles.css` imported from `src/global.css` passes tsc but fails `yarn build`.
  Always run the build after deleting component dirs.
- **knip per-FILE list is accurate; its dir-level summary is not.** Some dirs mix
  live and dead files (e.g. `src/sections/overview/app`, `/e-commerce`). Delete
  only files `knip --files` flags, never a whole dir on assumption.
- **`critters`** is flagged unused by knip but required by Next `optimizeCss` —
  keep it (it's in `ignoreDependencies`).

## LLM stats dashboard (local-only)

- Route `/dashboard/admin/llm-stats` (admin-guarded). Shows model/harness/time/
  project/cost stats aggregated from local AI-harness logs.
- **Local-only by design.** The API route `src/app/api/llm-stats/route.ts`
  (Node runtime) reads `~/.claude/projects`, `~/.codex/sessions`, and
  `~/.local/share/opencode/opencode.db`. On the prod VDS those dirs are absent, so
  it returns an empty `StatsBundle` with a warning — the page renders an empty
  state. Nothing about this feature runs server-side in production.
- Parsing lives in `src/server/llm-stats/` (pure, unit-tested with Vitest:
  `npm run test:unit`). **Add a harness** = add an adapter in `adapters/` and
  register it in `scan.ts`. Costs are estimates from `pricing.ts`, not billing.
- `src/server/llm-stats/**` must stay React-free; the section
  (`src/sections/admin/llm-stats/`) is presentation only.

## Out of scope

The backend lives in a separate repo (`blog-app-mui-backend`). Don't edit it from
here. Don't touch another agent's uncommitted work.
