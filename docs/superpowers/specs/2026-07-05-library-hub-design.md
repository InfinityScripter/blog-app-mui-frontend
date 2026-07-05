# Library Hub (reading-list + tools + TIL) — Design Spec

Date: 2026-07-05
Feature: DEEP-ANALYSIS bet #9 — годовой reading-list + tool-directory + TIL
Status: approved (autonomous build authorized by owner)

## Goal

One evergreen `/library` hub with three curated sections a reader returns to:

1. **Читать** — a reading-list of the best external AI/LLM sources (blogs,
   newsletters, papers, landmark posts), grouped by kind, each with a one-line
   «зачем читать».
2. **Инструменты** — a tool-directory of AI tools worth knowing (name, category,
   what-it's-for, pricing model, link).
3. **TIL** — «Today I Learned»: short, dated, own micro-notes (a fact + why it
   matters). The author's primary micro-content.

Long-tail SEO + guaranteed annual sequel («…, v1» framing). This is the
content-density play from the roadmap.

## Non-goals (YAGNI)

- No backend / DB / bot assembly. Static curated data, same proven pattern as
  `llm-timeline` and `llm-compare`. Bot-assembly can layer on later (separate
  3-repo effort) without changing the page.
- No per-item detail pages. Items are links out (reading/tools) or inline cards
  (TIL). No `/library/[slug]`.
- No search/filter beyond a section tab + a lightweight kind filter within
  Читать and Инструменты (reuse the chip-toggle idiom). No pagination.
- Not exhaustive — curated, opinionated («что реально стоит времени»), honest.

## Data model

New section `src/sections/library/`. Three small typed datasets, «NEVER
invented» for facts (a tool's price we're unsure of → «—»/free-text, not a
guessed number).

```ts
// Reading-list entry — an external source worth reading.
type ReadingKind = "blog" | "newsletter" | "paper" | "post" | "video" | "book";
interface ReadingItem {
  id: string;
  title: string; // «Simon Willison's Weblog»
  author: string; // «Simon Willison»
  kind: ReadingKind;
  url: string; // canonical external link
  lang: "ru" | "en";
  why: string; // one-line «зачем читать» (RU)
}

// Tool-directory entry.
type ToolCategory =
  | "agents"
  | "ide"
  | "chat"
  | "search"
  | "images"
  | "audio"
  | "eval"
  | "orchestration"
  | "data";
type PricingModel = "free" | "freemium" | "paid" | "open-source";
interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  pricing: PricingModel;
  url: string;
  what: string; // one-line «для чего» (RU)
}

// TIL micro-note (own content).
interface TilItem {
  id: string;
  date: string; // ISO YYYY-MM-DD
  title: string; // the learned thing, short
  body: string; // 1-3 sentences: the fact + why it matters (RU)
  tags: string[]; // e.g. ["prompting", "cost"]
  sourceUrl: string | null; // where it came from, or null
}
```

Data files (each ≤200 lines; eslint override `library/data/**` like the other
curated datasets): `data/reading.ts`, `data/tools.ts`, `data/til.ts`,
`data/index.ts` (re-exports READING_ITEMS / TOOL_ITEMS / TIL_ITEMS).

## Components (one component / file, ≤200 lines)

```
src/sections/library/
  types.ts                    the three item types + enums
  const.ts                    tab defs, kind/category/pricing label maps, filter options
  utils.ts                    groupByKind, filterByKind, sortTilDesc, label/color helpers
  data/{reading,tools,til,index}.ts
  hooks/use-library-tab.ts    active tab, URL-synced (?tab=read|tools|til)
  hooks/use-kind-filter.ts    generic kind/category filter (reused by reading & tools)
  library-hero.tsx            title, blurb, tab switcher
  reading-list.tsx            Читать: grouped list + kind filter
  reading-item.tsx            one reading row (kind chip, title→link, author, why)
  tools-directory.tsx         Инструменты: filterable grid + category filter
  tool-card.tsx               one tool card (category chip, name→link, pricing, what)
  til-feed.tsx                TIL: reverse-chron list
  til-card.tsx                one TIL note (date, title, body, tags, source)
  view/
    library-view.tsx          composition + tab switching
    types.ts
  __tests__/utils.test.ts     pure-helper unit tests
```

Reuse `Label`, `Iconify`, `monoLabelSx`. The chip-toggle filter idiom mirrors
`llm-compare/compare-toolbar`. No cross-section logic imports needed (kind maps
are library-local).

## Route & nav

- `src/app/library/page.tsx` — static public page, `metadata`, ItemList JSON-LD
  of reading + tools (external links → richer SERP), renders `LibraryView`.
- `src/routes/paths.ts` — add `library: { root: "/library" }`.
- `src/layouts/config-nav-main.tsx` — nav item «Библиотека»
  (`solar:bookmark-square-bold-duotone`), after «Сравнение LLM».
- `/llms.txt` — add «Библиотека» to the Ресурсы section (buildLlmsTxt already
  supports resources).

## Interaction

- **Tabs:** Читать / Инструменты / TIL. Active tab in URL (`?tab=`) so a
  specific tab is shareable/deep-linkable. Default = read.
- **Читать:** grouped by kind (Блоги, Рассылки, Статьи…) with a kind-filter
  chip row; empty filter = all. RU/EN language chip per item.
- **Инструменты:** category-filter chip row; cards in a responsive grid;
  pricing shown as a colored Label (free=success, open-source=info,
  freemium=warning, paid=default).
- **TIL:** reverse-chronological cards; tag chips; optional source link.
- **Responsive:** reading = single column list; tools = grid (1/2/3 cols by
  breakpoint); TIL = single column.

## Error / edge handling

- Empty section (e.g. TIL has no items yet) → a friendly placeholder, not blank.
- Every external link `target="_blank" rel="noopener"`.
- Unknown kind/category/pricing → falls back to a neutral label + default color
  (never crashes on an unmapped enum value).
- Fully static — no fetch, cannot fail on a backend (cf. memory
  `prerender-fetch-must-be-guarded`; N/A here).

## Testing

- `__tests__/utils.test.ts` (vitest, pure): `groupByKind`, `filterByKind`
  (empty = all), `sortTilDesc` (newest first, stable), label/color fallbacks for
  unmapped enum values.
- ESLint gates: `max-lines` 200 (locked at error), no `for-of`/`while`, no
  `as`/`any`, string params must be unions/enums.
- Browser verify: tab switch + URL sync, kind/category filters, responsive grid,
  dark mode, external links, empty-state.

## Build order

1. types + const + utils + utils tests
2. curated data (reading, tools, til) + index + eslint override
3. hooks (tab, kind-filter) — tab URL-synced
4. presentational components (hero, reading, tools, til + their item/card parts)
5. view composition + tab switch
6. route + paths + nav + llms.txt
7. lint/tsc/test green → browser verify → commit
