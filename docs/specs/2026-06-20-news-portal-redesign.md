# News Portal Redesign — Design Spec

**Date:** 2026-06-20
**Status:** Approved direction, ready for phased implementation
**Stack:** Next.js 15 (App Router) + MUI v7, CSS-vars theme (dark-mode for free)

## Goal

Turn the AI/portfolio blog into a **serious editorial news portal**. News (posts
tagged `новости`, published by the Telegram bot) becomes the **primary** section
with its own route, dense editorial layout, рубрики, and a distinctive heading
font. The portfolio blog (`/post`) stays as-is, secondary.

## Decisions (locked)

| Decision        | Choice                                                             | Why                                                                                                                            |
| --------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Style           | Strict editorial (Meduza / NYT / The Bell)                         | Dense, readable, serious production look                                                                                       |
| Priority        | News is primary; portfolio secondary                               | User wants a news portal, not a blog with news                                                                                 |
| Heading font    | **Onest** (Google Fonts, OFL)                                      | Modern grotesque, excellent Cyrillic, YS-like feel. **YS Display/Text rejected — Commercial Type EULA forbids web embedding.** |
| News separation | Dedicated `/news` route + `?tag=новости` backend filter            | Clean split; ISR-cached news list                                                                                              |
| Theme           | Reuse all tokens (primary `#00A76F`, radius 8, shadows, dark-mode) | Zero theme-color edits; only add the font + a category→color mapper                                                            |

## Layout — `/news`

Editorial-dense (see approved mockup):

- **Section header bar:** «Новости» + рубрики (Главное · Технологии · Наука ·
  Политика), thick bottom rule (newspaper style).
- **Lead story:** large horizontal card — thumbnail left, рубрика label + headline
  - source · date · reading-time.
- **Feed:** dense list — small 96×72 thumbnail + рубрика badge + 2-line headline +
  source · date, separated by hairline rules (not boxed cards).
- **Рубрика colors** via theme semantics (Label `color` prop, never hex):
  Главное=`info`, Наука=`success`, Технологии=`warning`, Политика=`info`.
- **No social icons** (views/shares) — serious news, not social.

## Typography

- **Onest** for headings (display) — replaces Barlow. `next/font/google`, weights
  400/500/600/700/variable. Wired as a CSS var, set on MUI `typography.h1..h6`
  fontFamily and the news headlines.
- **Public Sans** stays for body/UI (unchanged).
- News headline density: `subtitle1`/`subtitle2` weights, tight line-height.

## Backend change (`blog-app-mui-backend`)

Minimal, backward-compatible — `?tag=` is optional.

1. `src/models/Post.ts` — add `tag?: string` to `PostFilter`; in `buildWhere`,
   add a `tags @> to_jsonb(ARRAY[$N]::text[])` clause (tags is `jsonb`). Confirm
   the stored shape (`SELECT tags FROM posts LIMIT 1`) — it's a JSON array of
   strings, so `@>` containment is correct.
2. `src/services/post.ts` — `listPosts` accepts optional `tag`, forwards it
   (anonymous/published branch: `{ publish: 'published', tag }`).
3. `src/pages/api/post/list.ts` — read `req.query.tag`, pass through.
4. Test: `?tag=новости` returns only tagged posts; no tag → unchanged.

## Frontend changes

**Font (do first — visible everywhere):**

- `src/app/layout.tsx` — add `Onest` via `next/font/google`, expose CSS var.
- `src/theme/core/typography.ts` — set heading fontFamily to the Onest var.

**Fixes (low risk, ship independently):**

- `src/utils/format-time.ts` — `import 'dayjs/locale/ru'` + ru locale; date →
  `D MMMM YYYY` (`20 июня 2026`).
- `src/sections/blog/post-item.tsx:132` — `PostItemLatest` responsive cover
  height `{ xs: 'auto', lg: 360 }` (fix mobile CLS).
- `src/sections/blog/post-details-hero.tsx:44` — responsive hero height
  `{ xs: 320, md: 480 }`; add `maxLine` to the h1 for long RU headlines.
- News cards: when no `coverUrl`, render a flat `background.neutral` block with a
  muted icon instead of the loud placeholder SVG.

**News section (new, isolated — must NOT import `sections/blog`):**

```
src/sections/news/
  news-item.tsx          # compact news card (lead + list variants)
  news-list.tsx          # lead + dense list wrapper
  news-section-bar.tsx   # header bar with рубрики
  view/news-list-view.tsx
  const.ts               # NEWS_TAG='новости', рубрика list, RU copy
  types.ts               # NewsItem (Pick<Post,...> + source, category)
  utils.ts               # categoryColor(tag): LabelColor (pure, no JSX); deriveSource(post)
```

**Routing + nav:**

- `src/actions/blog-ssr.ts` — `getNewsPosts()` → `/api/post/list?tag=новости`, ISR 3600.
- `src/app/news/page.tsx`, `news/layout.tsx`, `news/[id]/page.tsx`, `[id]/layout.tsx`
  (detail reuses existing `PostDetailsHomeView`).
- `src/routes/paths.ts` — `news: { root, details(id) }`.
- `src/layouts/config-nav-main.tsx` — add «Новости» nav item, **first** (primary).

## Source/category derivation

The bot stores source in the post body («Источник: Meduza») and uses tag
`новости`. For рубрики, derive `category` from the post's tags or a future
explicit field; for now map all to «Главное» unless a known рубрика tag exists.
`source` parsed from content or stored — start with the feed name in tags.

## Phases (ship + verify each)

1. **Backend** `?tag=` filter + test (pg-mem). Verify green.
2. **Font + fixes** (Onest, ru date, CLS, hero) — verify in browser.
3. **News section + route + nav** — build, verify `/news` renders dense feed.
4. **Polish** (impeccable-design-polish): hover, motion, dark-mode, responsive
   at mobile/tablet/desktop.

## Risks / gotchas

- **Sections isolation:** `sections/news` cannot import `sections/blog` — fork the
  view, share via `src/components/`.
- **SSR + SWR:** list is ISR (`getNewsPosts`), hydrate with SWR if needed.
- **ISR caching:** `/news` revalidates hourly; new bot posts appear within the hour
  or on rebuild.
- **Dark-mode:** all colors via theme palette / `varAlpha` — never hex.
- **Verification gates (AGENTS.md):** `tsc --noEmit`, `lint` (0 warnings), `madge
--circular`, `build`, `knip` must all pass.
- **Onest licensing:** OFL, web embedding allowed. (YS rejected for licensing.)
