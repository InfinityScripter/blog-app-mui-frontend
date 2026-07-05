// Structural hero config only. User-visible copy (overline, title parts, lead,
// panel title/description, link labels) is resolved per-locale in the hero
// components via `useTranslations("home")` — a plain data module can't call the
// `t()` hook at module scope, so link labels carry a stable `key` instead.

// Оглавление журнала: href — данные, label резолвится по `home.hero.panel.links.<key>`.
export const HERO_PANEL_LINKS = [
  { key: "news", href: "/news" },
  { key: "llmTimeline", href: "/llm-timeline" },
  { key: "changelog", href: "/changelog" },
  { key: "about", href: "/portfolio" },
] as const;
