# Portal improvement plan — aifirst.us.com (frontend + backend + bot)

Date: 2026-07-11. Source: parallel deep-recon of all 3 repos (file:line-verified),
challenging the stale 2026-07-01 DEEP-ANALYSIS. North stars (all four):
growth/SEO/virality · killer content features · UX/design polish · bot-as-channel.

## Ground truth — already done (do NOT redo)

- FE: dynamic OG images (site+post+changelog), real share buttons (TG/X/VK+copy),
  `/tag/[slug]` + clickable chips, header search, newsletter double-opt-in,
  RSS/Atom (blog+news+changelog per-locale, linked in head), per-post
  generateMetadata + JSON-LD (+FAQ +@graph), sitemap w/ hreflang, robots crawler
  allow-list (GPTBot/ClaudeBot/Perplexity/Google-Extended), llms.txt, localized ISR
  revalidate, i18n ru/en+geo+DeepL cache, llm-timeline / llm-compare / library (all
  full, interactive, SSG), changelog. Template junk gone.
- BE: posts indexes (C6 all 5), rate-limit on auth+newsletter (C8 core), N+1
  post/details fixed, post/latest bounded, JWT+roles+rotating refresh+CSRF, bcrypt
  +lockout, bot-token constant-time, upload MIME/size, file-serve nosniff, reset-code
  CSPRNG, audit_logs, subscribers, parameterized SQL (no injection).
- BOT: EN AI feeds (arXiv cs.AI/cs.CL, DeepMind, Simon Willison, HN AI/LLM), full-body
  fetch (gated), temp 0.6 + max_tokens 4096, source-attribution self-heal, relevance
  filter (keyword+LLM), cross-post to TG channel, weekly digest, release detection,
  LLM timeout+retry, dedup ledger, idempotent publish, crash recovery, 362 tests.

## Batches (ranked by impact/effort). Iterate ≤15, verify each live.

### Batch 1 — BOT: stop off-topic news reaching prod  [impact very-high, effort S]
The live /news shows fashion/celebrity from generic RU feeds — kills "AI blog"
credibility instantly. Root cause: RELEVANCE_MODE=shadow (drops nothing) +
generic RU feeds mixed in.
- Flip default RELEVANCE_MODE shadow→on (envSchema.ts:130); keep threshold 2.
- Curate feeds: keep AI/ML ones, drop/deprioritize generic hardware/daily-best that
  produce fashion news (defaultFeeds.ts:17-25). Add topical Habr AI hub only.
- Add OpenAI(via gunzip fetch)/Anthropic/Meta AI blog feeds (defaultFeeds.ts:32).
- Fix stale docs (.env.example:64, CandidateStore.ts:51, README test count).
- Verify: `npm run fetch` dry-run shows only AI-relevant candidates; tests green.

### Batch 2 — FE: SSR the homepage feed (C5)  [impact very-high, effort M]
Most-linked URL returns empty HTML to crawlers/LLMs → invisible to SEO+GEO.
- Server-render initial page in `(index)/page.tsx` via getBlogPosts (like /blog),
  pass as initial data to a client feed that hydrates + infinite-scrolls.
- Verify: `curl -s localhost:3033/ru | grep -c "<article"` > 0; post titles in raw HTML.

### Batch 3 — FE+BE: real pagination (C7)  [impact high, effort M] (cross-repo)
Every list fetches whole corpus; backend list ships full `content`.
- BE: lean-list column projection (drop content) in PostFindQuery + list service.
- FE: home-feed/post-list/news use backend limit+offset (cursor or page).
- Verify: /api/post/list response has no `content`; network payload shrinks; feed paginates.

### Batch 4 — BE: security hardening (real vulns)  [impact high, effort S]
- Rate-limit auth/verify.ts + resend-verification.ts (brute-force 6-digit code).
- Rate-limit dogs/admin/login.ts + dogs/booking/requests.ts.
- CSPRNG for email-verification code (Math.random→crypto.randomInt).
- CSPRNG for uuidv4 (newsletter confirm/unsubscribe + refresh familyId).
- Constant-time dogs webhook secret compare.
- Whitelist body on admin PUT post (block mass-assignment of userId/counters).
- Verify: tests green; rate-limit returns 429 after N; new tests for each.

### Batch 5 — FE: Telegram CTA everywhere + channel link  [impact high, effort S]
Bot cross-posts to a channel but the site never links it.
- Add persistent TG channel CTA on post pages (end-of-article) + header nav item.
- Swap personal t.me/sh0ny → channel (const.ts:2 TODO).
- Verify: CTA visible on /ru/post/[id] and header; links resolve.

### Batch 6 — FE+BE: PUBLIC LLM-usage stats dashboard  [KILLER FEATURE, impact very-high, effort M-L] (cross-repo)
Real usage/cost data from the author's own bot = primary source nobody else has;
LLMs love citing it. Currently admin-only.
- BE: public read endpoint for aggregated llm_stats_snapshots (no PII, cached).
- BOT: capture response.usage (chatCompletion.ts) → push tokens/cost to backend.
- FE: public /ru/llm-stats page (charts already exist in admin view; reuse) +
  add to nav + llms.txt + sitemap + JSON-LD Dataset.
- Verify: /ru/llm-stats renders real numbers SSR; in raw HTML.

### Batch 7 — FE: GEO/UX polish pass  [impact medium, effort S]
- Footer #-links fixed/removed (const.ts:12-13); display:none placeholder Alert removed.
- BLUF/answer-first + "обновлено" date visible on post template (GEO citation lift).
- a11y sweep on new components.
- Verify: web-design-guidelines review clean; Lighthouse a11y ≥95.

## Cross-repo deps
- Batch 3: FE pagination needs BE lean-list first.
- Batch 6: FE public dashboard needs BE public endpoint + BOT usage push first.

## Reviewer / security / plan-compliance (after build)
Separate reviewer role: bug review + security review (all repos) + verify implemented
matches this plan. Then report.

## Delivery status (2026-07-11, post-review)

Adversarial review (bug + security + compliance, findings verified) → verdict
**ship-with-fixes**, ~80% compliance. 959 tests green (BOT 371 / BE 430 / FE 164).

DONE (verified live): B1 bot relevance=on + AI-only feeds (+ fixed a run-abort crash
on malformed feed items); B2 SSR home feed (C5); B3 backend lean-list + readingTime;
B4 security hardening; B5 Telegram CTAs; B6 public /llm-stats dashboard (killer
feature, JSON-LD Dataset, SEO-wired); B7 polish. Public llm-stats leaks nothing
(allowlist strip, verified). Rate-limit XFF-spoof bypass found by review and FIXED
(getTrustedClientIp + allowlist).

DELIBERATELY SCOPED (claims corrected to match reality):
- **B3 frontend pagination — NOT wired.** Backend accepts ?page/?limit and the list
  payload is lean (content stripped), but the home/blog feed still fetches the full
  corpus and slices client-side. Acceptable at current scale (~8 posts); the backend
  is ready when the FE needs it. The payload win (no content per row) shipped; the
  cursor-paginated feed did not.
- **B6 bot usage-capture leg — NOT wired.** The dashboard renders the author's real
  data from the existing manual `npm run llm-stats:push` (local ~/.claude scan). The
  bot does NOT yet capture its own response.usage and push token/cost. Deferred as
  optional; the "primary-source data" claim holds via the manual push, not an
  automated bot pipeline.
- **B1 feed substitution:** planned OpenAI/Anthropic/Meta RSS don't serve parseable
  feeds (gzip / HTML), so Google AI blog / HuggingFace / Microsoft Research were used
  instead (all live-verified).
