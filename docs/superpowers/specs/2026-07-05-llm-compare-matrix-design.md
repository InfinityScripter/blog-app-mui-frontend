# LLM Comparison Matrix — Design Spec

Date: 2026-07-05
Feature: DEEP-ANALYSIS bet #3 — public LLM comparison matrix
Status: approved (autonomous build authorized by owner)

## Goal

A public, sortable/filterable **comparison matrix** of current & notable LLMs:
price (input/output $/1M tokens), context window, key benchmarks, release date,
capabilities. This is the niche magnet — the page people bookmark and LLMs cite.

Distinct from the existing `/llm-timeline` (historical narrative of 68 models)
and `/changelog` (per-release news feed). The matrix answers _"which model do I
pick right now, by the numbers?"_ — a decision tool, not a story.

## Non-goals (YAGNI)

- No backend / DB. Static curated data, same pattern as `llm-timeline`.
- Not all 68 timeline models — a 68-row price table is noise. Curated
  frontier/notable set (~24 models, 2024–2025) that a buyer actually weighs.
- No live pricing API. Prices are hand-verified snapshots with an
  "verified as of" date, «NEVER invented» — unknown ⇒ `null` ⇒ em dash.
- No user accounts, no saved comparisons server-side (pin state is URL-only).

## Data model

New section `src/sections/llm-compare/`. New type `ComparableModel` — a richer
shape than timeline's `LlmModel`, because the matrix needs structured comparable
numbers the timeline keeps in prose.

```ts
// pricing: USD per 1M tokens. null = undisclosed / not-applicable (never invented).
interface ModelPricing {
  inputPerM: number | null; // $/1M input tokens
  outputPerM: number | null; // $/1M output tokens
}

// A benchmark score. value is the raw number (percent or elo);
// unit disambiguates rendering. null value = not reported for this model.
interface BenchmarkScore {
  value: number | null;
  unit: "percent" | "elo";
}

// The curated benchmark columns the matrix compares on. Each optional/nullable.
interface ModelBenchmarks {
  mmlu?: BenchmarkScore | null; // general knowledge, %
  gpqa?: BenchmarkScore | null; // graduate reasoning (diamond), %
  sweBench?: BenchmarkScore | null; // SWE-bench Verified, % (agentic coding)
  aime?: BenchmarkScore | null; // AIME math, %
}

interface ComparableModel {
  id: string; // stable, matches timeline id where the model overlaps
  vendor: string; // reuse vendorColor/vendorIcon from llm-timeline
  name: string;
  releaseDate: string; // ISO YYYY-MM-DD
  contextTokens: number | null;
  maxOutputTokens: number | null;
  pricing: ModelPricing;
  benchmarks: ModelBenchmarks;
  capabilities: string[]; // reasoning / multimodal / open-weights / agentic ...
  modality: ("text" | "vision" | "audio" | "image-gen")[];
  openWeights: boolean;
  highlight: string; // one-line "why pick this"
  sourceUrl: string; // vendor pricing/model page (verifiable)
  pricingAsOf: string; // ISO date the price was last verified
}
```

Data split by vendor-neutral file size limit (≤200 lines): `data/models-*.ts`
grouped so each file stays under the cap; re-exported from `data/index.ts` as
`COMPARABLE_MODELS`. `pricingAsOf` defaults to the build/curation date
(2026-07-05) and is shown once as a page-level "prices verified as of …" note.

## Components (one component / file, ≤200 lines)

```
src/sections/llm-compare/
  types.ts                    ComparableModel + sub-types
  const.ts                    benchmark column defs, sort keys, capability filters
  utils.ts                    formatUsd, formatBench, sortModels, filter helpers, best-in-column
  data/
    models-frontier.ts        top current frontier (OpenAI/Anthropic/Google/xAI…)
    models-open.ts            open-weights (DeepSeek/Llama/Qwen/Mistral…)
    models-ru.ts              RU vendors (Yandex/Sber) — niche differentiator
    index.ts                  COMPARABLE_MODELS = [...]
  hooks/
    use-compare-filters.ts    vendor + modality + open-weights filter state
    use-compare-sort.ts       sort column + direction, URL-synced
    use-compare-pins.ts       pinned model ids (max 3), URL-synced (?pin=a,b,c)
  compare-hero.tsx            title, blurb, "prices as of" note, result count
  compare-toolbar.tsx         vendor/modality/open-weights filters + reset
  compare-table.tsx          desktop sortable table; best-in-column highlighted
  compare-table-row.tsx      one model row (vendor chip, price, context, benches, pin toggle)
  compare-card.tsx           mobile stacked card (one model)
  compare-pin-bar.tsx        sticky bar: pinned models side-by-side, remove/clear
  compare-empty.tsx          zero-results state (filters too narrow)
  view/
    llm-compare-view.tsx      composition + responsive table/cards switch
    types.ts
  __tests__/utils.test.ts     pure-helper unit tests
```

Reuse from `llm-timeline`: `vendorColor`, `vendorIcon`, `hasBrandIcon`,
`formatContext`, `releaseYear`. Reuse `Label`, `Iconify` from components. Do NOT
import across sections directly for logic — lift the shared vendor helpers into
a place both can use. Decision: keep `llm-timeline/utils` as the owner and
import the 3 vendor helpers from it into compare (they are display-only, stable,
and duplicating the vendor→color/icon maps would drift). This is the one
cross-section import, justified and documented.

## Route & nav

- `src/app/llm-compare/page.tsx` — static/ISR public page, `metadata` for SEO,
  renders `LlmCompareView`. Add `layout.tsx` if a distinct `<title>` is needed.
- `src/routes/paths.ts` — add `llmCompare: { root: "/llm-compare" }`.
- `src/layouts/config-nav-main.tsx` — new nav item "Сравнение LLM"
  (icon `solar:ranking-bold-duotone` or `solar:tuning-square-bold-duotone`),
  placed right after "История LLM".
- GEO/SEO: JSON-LD `Dataset` or `Table`-style structured data is overkill;
  instead emit an `ItemList` of models + a plain semantic `<table>` so crawlers
  and LLMs can read it. Add the page to `/llms.txt`.

## Interaction

- **Sort:** click a column header → sort by that metric; toggle asc/desc; default
  sort = release date desc. Nulls always sort last regardless of direction.
- **Filter:** vendor multi-select, modality (vision/audio), open-weights toggle.
  Empty filter = all. Result count shown in hero.
- **Best-in-column:** for each numeric column, the best value across the
  _currently filtered_ set gets a subtle highlight (e.g. bold + success tint) —
  the "who wins this metric" read at a glance. Lower-is-better for price.
- **Pin to compare:** each row/card has a pin toggle (max 3). Pinned models
  appear in a sticky `compare-pin-bar` side-by-side with every field, for a
  focused head-to-head. Pin ids persist in the URL (`?pin=`) so a comparison is
  shareable — this is the LLM-citation / social-share hook.
- **Responsive:** ≥ md → table; < md → stacked cards. Same data, same sort/filter.

## Error / edge handling

- Every numeric is nullable; a null renders as `—` (em dash), never 0 or blank.
- `formatUsd(null) → "—"`, `formatUsd(3) → "$3.00"`, sub-dollar keeps 2 decimals.
- Pin URL param is sanitized: unknown ids dropped, capped at 3, deduped.
- Bad/absent sort column in URL → falls back to default (release date desc).
- No network: page is fully static, cannot fail on a backend 500 (unlike SSG
  fetch pages — see memory `prerender-fetch-must-be-guarded`; N/A here, no fetch).

## Testing

- `__tests__/utils.test.ts` (Jest, pure): `formatUsd`, `formatBench`,
  `sortModels` (incl. nulls-last both directions), `bestInColumn`
  (lower-is-better for price), pin sanitize (cap/dedupe/unknown-drop),
  filter composition.
- ESLint gates: `max-lines` 200 (locked at error), no `for-of`/`while`
  (functional array code), no `as`/`any`, string params must be unions.
- Manual browser verify via preview tools: sort, filter, pin, responsive,
  dark mode, best-in-column highlight.

## Data sourcing rule («NEVER invented»)

Prices and benchmarks are transcribed from vendor pages / official model cards
only. Any number not published for a model ⇒ `null`. `pricingAsOf` records the
verification date. Benchmark values use the vendor-reported figure on the
canonical benchmark (SWE-bench Verified, GPQA Diamond, MMLU, AIME) — noted in a
short methodology line in the hero so the page is honest about provenance.

## Build order

1. types + const + utils + utils tests (TDD helpers first)
2. curated data files (frontier / open / ru) + index
3. hooks (filters, sort, pins) — URL-synced
4. presentational components (table, row, card, pin-bar, toolbar, hero, empty)
5. view composition + responsive switch
6. route + paths + nav + llms.txt
7. lint/tsc/test green → browser verify → commit
