# Page redesign briefs — Editorial Ink (enhance-prompt output)

Design system: see `.stitch/DESIGN.md` (REQUIRED for every brief below).
Shared tokens: Paper `#FAFAF9` bg · Warm Ink `#1C1917` text · Graphite `#57534E`
secondary · Signal Vermilion `#C2451E` accent · hairline `rgba(28,25,23,0.10)` ·
Unbounded display h1/h2 · Manrope structure/body · JetBrains Mono metadata.

## 0. Theme core (prerequisite for all pages)

Swap palette (vermilion primary ramp, stone greys, warm dark scheme), fonts
(Unbounded/Manrope/JetBrains Mono), shadows (stone-tinted, flatter), button/card/
chip/input overrides (radius 10/20, hairline borders, tactile press). Default
settings preset → vermilion; presets drawer keeps working.

## 1. Home (`/` — home-view)

Editorial front page of an AI journal: asymmetric hero + featured feed.

1. **Hero:** left-aligned 7/12 column — mono overline «AI-журнал · ежедневно»,
   Unbounded h1 with ONE vermilion accent word (solid color, no gradient
   shimmer, no animation loop), graphite lead ≤65ch, single primary CTA
   «Читать ленту» + ghost «Телеграм-бот». Right 5/12 — quiet meta panel:
   latest post teaser card + mono stats (posts count, tags) from real data.
   Remove centered layout, gradient text, SVG circle confetti.
2. **Feed:** featured latest post as wide card (cover left / text right),
   then hairline-separated list rows (mono date, tag chips, title, excerpt).
   Tag filter row above as outlined pills. No 3-equal-card grids.
3. **Newsletter CTA:** ink band (dark surface on light scheme) with hairline
   frame, Unbounded h2, mono privacy note, inline email + vermilion button.
4. **Telegram CTA:** compact split band, not gradient.

## 2. Post detail (`/post/[id]`)

Reading-first article page, 720px measure.

1. **Hero:** cover image radius 24, title Unbounded ≤2 lines below (not
   overlaid), mono meta row (date · reading time · views), author line.
2. **Body:** Manrope 400 18px/1.7, 65ch; headings Manrope 700; links
   vermilion underline; blockquote with vermilion left rule; code JetBrains.
3. **Toolbar:** hairline-pill share buttons, no filled color blocks.
4. **Related:** 2-col zig-zag, hairline cards.
5. **Comments:** paper cards, hairline rules, vermilion submit.

## 3. News (`/news`) and Tag (`/tag/[slug]`)

Same list grammar as home feed: page header (mono overline + Unbounded h2 +
graphite count), tag pills row, hairline-separated feed rows. No card walls.

## 4. Changelog (`/changelog`, `/changelog/[slug]`)

Release ledger, information-dense → mono-heavy.

1. Header: overline «Релизы моделей», Unbounded h2.
2. Entries: date column in mono left, vendor chip + release title + summary
   right; hairline row separators; «свежее» pulsing vermilion live-dot
   (perpetual micro-motion, subtle).
3. Detail page: same article grammar as post detail.

## 5. LLM timeline (`/llm-timeline`)

Keep MUI-lab alternating timeline + brand icons; re-skin: stone hairline
connectors, paper cards with hairline borders, mono years, vermilion active
node, spring stagger reveal. No neon, no filled color nodes except accent.

## 6. Portfolio (`/portfolio`)

Engineer profile, asymmetric split hero (photo/monogram right 5/12, text left
7/12). Replace blue→green gradient band with paper + hairline frame + one
vermilion rule. Stats as mono numbers over hairline-top cells (real data
only). Experience timeline: mono years + hairline connectors. Contacts:
outlined rows with vermilion icons.

## 7. Newsletter status (`/newsletter/confirm`, `/unsubscribe`)

Centered single Paper card OK (utility page): hairline border radius 20,
state icon in vermilion/success, Unbounded h3, graphite text, one CTA home.

## 8. Auth (`/auth/jwt/sign-in`, `sign-up`, reset/update/verify)

Split layout: left brand panel (ink surface, Unbounded wordmark, mono
tagline), right form column on paper. Labels above inputs, radius 10,
vermilion focus ring + submit. Remove illustration clutter if any.

## 9. Dashboard

Out of scope for visual rework (admin tool) — inherits new theme tokens
automatically; verify nothing breaks, fix regressions only.
