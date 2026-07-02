---
name: aifirst-blog-current
colors:
  primary: "#00A76F"
  secondary: "#8E33FF"
  info: "#00B8D9"
  success: "#22C55E"
  warning: "#FFAB00"
  error: "#FF5630"
  background-light: "#FFFFFF"
  background-dark: "#141A21"
  paper-dark: "#1C252E"
  text-primary-light: "#1C252E"
  text-secondary-light: "#637381"
  neutral-light: "#F4F6F8"
  neutral-dark: "#28323D"
  portfolio-gradient-from: "#2065D1"
  portfolio-gradient-to: "#00A76F"
---

# Design System: aifirst.us.com — CURRENT STATE (pre-redesign snapshot)

Extracted from source 2026-07-02 (branch `claude/stitch-site-redesign`, extract-design-md skill).

## 1. Visual Theme & Atmosphere

A Russian-language AI-news blog + engineer portfolio built on the Minimals MUI
template. Clean, airy, template-default: pure white light mode, deep blue-slate
dark mode (#141A21). The only strong brand gestures are an animated
green↔amber gradient shimmer on hero headlines and a blue→green tint band on
the portfolio hero. Everything else — buttons, cards, chips — reads as stock
Minimals: competent, generic, indistinguishable from thousands of dashboards.

Cool color temperature throughout (blue-grey neutrals #919EAB family).
Whitespace is generous (section padding 80–112px), density low on marketing
pages, medium in feed lists.

## 2. Color Palette & Roles

### Primary Foundation
- **Pure White** `#FFFFFF` — light bg + paper
- **Ink Slate** `#141A21` — dark bg; **Charcoal Slate** `#1C252E` — dark paper
- **Mist Grey** `#F4F6F8` — neutral fills light; `#28323D` dark neutral

### Accent & Interactive
- **Minimals Green** `#00A76F` — primary CTA, links, active nav (runtime-swappable presets: cyan/purple/blue/orange/red)
- **Electric Violet** `#8E33FF` — secondary (rarely used)
- **Amber** `#FFAB00` — warning + gradient partner of primary in hero shimmer

### Typography & Text Hierarchy
- Light: primary `#1C252E` (grey800), secondary `#637381` (grey600), disabled `#919EAB`
- Dark: primary `#FFFFFF`, secondary `#919EAB`

### Functional States
Success `#22C55E`, Warning `#FFAB00`, Error `#FF5630`, Info `#00B8D9`

## 3. Typography Rules

- **Body: Public Sans** — neutral geometric-humanist sans, weights 400–700
- **Display: Onest** — Cyrillic-first grotesque for h1–h6, weights 600–800
- h1 40→64px w800 lh1.25 · h2 32→48px w800 · h3 24→32px w700 · h4 20-24 w700 · h5 18-20 · h6 17-18 w600
- body1 16px lh1.5 · body2 14px · caption 12px · overline 12px uppercase w700
- Buttons: 14px w700, no text-transform

## 4. Component Stylings

### Buttons
Radius 8, solid fills, no gradients/borders, standard MUI hover darken.

### Cards
Radius 16 (2× base), `customShadows.card` (soft ambient), padding 24, no
borders, white/dark-paper surface. Post cards: cover image top, title,
meta row (avatar, date, views/comments) — classic blog-card.

### Navigation
Main header: translucent blur AppBar, desktop inline links + cmd-K search
button, dashboard button. Mobile: drawer. Active state = primary color text.

### Inputs & Forms
Outlined, radius 8, RHF+Zod via RHF* wrappers, focus ring = primary.

### Domain Components
- **Hero (home/portfolio):** animated gradient-clip headline (primary↔warning,
  20s shimmer), SVG decorative circles/dots/lines background, CTA row
- **LLM timeline:** MUI-lab alternating timeline, vendor brand icons
- **Newsletter capture:** gradient-tint band + email input + button
- **Changelog:** release feed cards with vendor chips

## 5. Layout Principles

- Containers: MUI `Container` maxWidth `lg` (1200)
- Base spacing 8px grid; sections py 10–14 (80–112px)
- Breakpoints: MUI defaults (sm 600 / md 900 / lg 1200)
- 12-col `Grid`; feed = single column list + sidebar widgets on desktop
- Mobile-first responsive; drawer nav < md

## 6. Notes

Runtime theme customization exists (settings drawer): primary preset,
light/dark, font, RTL, compact. CSS-vars theme (`extendTheme`,
class-selector color schemes, no-flash script). Any redesign must keep:
CSS-vars pipeline, RHF* form components, MUI v7 Grid, kebab-case files,
≤200-line files, hooks in `hooks/`, sections isolation.
