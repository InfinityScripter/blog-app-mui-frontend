# SITE.md — aifirst.us.com redesign loop state

## 1. Vision
RU AI-journal + engineer portfolio in «Editorial Ink» design language
(.stitch/DESIGN.md). Implemented directly in Next.js 15 + MUI v7 (no Stitch
MCP connected — local loop: brief → code → screenshot → critique → refine).

## 2. Stitch project
N/A — Stitch MCP unavailable in this environment. metadata.json not created.

## 3. Loop protocol (local adaptation)
1. Read `.stitch/next-prompt.md` (baton) → target + brief ref.
2. Implement in code (sections/theme), respecting DESIGN.md §8 constraints.
3. Verify: dev server (port 3055, no --turbo) + screenshots light/dark,
   desktop/mobile; console clean.
4. Update sitemap below; write next baton.

## 4. Sitemap / progress
- [x] theme-core — palette/fonts/shadows/component overrides
- [x] home — hero + feed + newsletter/telegram CTA
- [x] layout-shell — header nav + footer
- [x] post-detail — article page + comments + related
- [x] news+tag — list pages
- [x] changelog — ledger + detail
- [x] llm-timeline — re-skin
- [x] portfolio — hero/stats/experience/contacts
- [x] newsletter-status — confirm/unsubscribe
- [x] auth — sign-in/sign-up/reset/verify
- [ ] dashboard — regression check only

## 5. Roadmap (order)
theme-core → home+shell → post-detail → news/tag → changelog → llm-timeline
→ portfolio → newsletter-status → auth → dashboard regression → verify suite.

## 6. Creative freedom backlog
- Reading-progress hairline bar on post pages
- Mono «view counter» ticker animation
- Print-style drop caps on long articles (RU typographic rules)
