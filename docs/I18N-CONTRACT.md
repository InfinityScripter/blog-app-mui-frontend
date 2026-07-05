# I18N Contract — post content translation (FE ↔ BE)

Owner: backend (`blog-app-mui-backend`). Frozen interface between frontend and backend for the
site-wide i18n feature. Keep FE and BE in sync via this doc.

## Languages

- `ru` — **original**. Content stored in `posts` as authored. Never translated, never stored in the translations table.
- `en` — machine-translated (DeepL), cached in `post_translations`.
- Extensible: adding a language = new locale in FE routing + new rows on demand. No contract change.

## The `lang` query param

All public post read endpoints accept an **optional** `lang` query param:

| Endpoint | Added param | Behavior |
|---|---|---|
| `GET /api/post/details?id=<id>` | `&lang=<ru\|en>` | `ru`/absent → original post. `en` → translated (cache-or-translate). |
| `GET /api/post/list` | `&lang=<ru\|en>` | `title` + `description` translated for every post (summary scope — the body in a list response may be the original; lists don't render it). Warm-cache DB hit; see "Row scope" below. |
| `GET /api/post/latest` | `&lang=<ru\|en>` | Same. |
| `GET /api/post/search?query=…` | `&lang=<ru\|en>` | Query runs against original; results returned translated for `en`. |

- **Unknown/absent `lang` → treated as `ru`** (original). Never 400 on a bad lang; degrade to original.
- `lang=ru` MUST be byte-identical to the current (pre-i18n) response. This guarantees zero regression for the Russian site.

## Response shape — UNCHANGED

The response envelope and field names do **not** change. Only the **values** of the translatable
fields differ when `lang=en`:

- `post.title`, `post.description`, `post.content` carry translated text for `lang=en`.
- Everything else (`id`, `tags`, `coverUrl`, `author`, counts, `comments`, dates, `publish`, meta_*) is returned **as-is** (untranslated). `id` is always the original post id — the frontend routes/keys by original id regardless of language.
- `content` is HTML/Markdown; DeepL `tag_handling=html` preserves tags. `<script>/<style>/<code>` and `translate="no"` elements are left untranslated.

Frontend therefore needs **no shape change** — it passes `lang` (from the active locale, `ru` for the original) and renders `title/description/content` as today.

## Translation semantics (backend)

- Table `post_translations (post_id TEXT, lang TEXT, title, description, content, source_hash, status, created_at, updated_at, PRIMARY KEY(post_id, lang))`.
- On `lang=en` request: look up by `(post_id, 'en')`.
  - **Hit + fresh** (`source_hash` matches current hash of original `title+description+content`) → return cached.
  - **Miss or stale** → translate via DeepL, upsert row (with new `source_hash`), return translated.
  - **Provider error / no `DEEPL_AUTH_KEY`** → return the **original** fields, set `status='error'`, log. Never 500 the read path.
- `source_hash` = stable hash (e.g. sha256) of the concatenated original translatable fields; guards against serving stale translations after a post edit.

### Row scope: `summary` vs `full`

A cached `post_translations` row carries a `scope` (column, default `'full'`) recording how complete it is — so a feed can cheaply show a translated title without paying to translate the whole body:

- **`full`** — `title` + `description` + `content` all translated. Written by the **details** route (`/api/post/details`). The ONLY scope the details route will serve; a `summary` row does not satisfy a details read (its body is still the original), so opening the post translates the body and upgrades the row to `full`.
- **`summary`** — `title` + `description` translated, `content` = the **original** (feeds never render a body). Written by the **list**/**search** routes (as they translate on demand) and by the **warmup** (below). Two short DeepL calls per post instead of a whole body.

Both routes REUSE a fresh row of *either* scope with no network call (a full row's short fields are already correct; a summary row is exactly what a list needs). This is invisible to the frontend — the response shape is unchanged; `scope` is a backend cache detail. The `en`-list-titles behaviour is now ON: feeds/lists return translated `title`/`description` for `lang=en` (a warm-cache DB hit), while the `content` in a list response for a `summary`-cached post is still the original (lists don't render it).

### Feed warmup — `POST /api/admin/translate/warm` (admin-only)

Pre-translates the SUMMARY (title + description) of every published post into every non-original locale and caches it (`scope='summary'`), so a subsequent feed render is a DB hit instead of dozens of synchronous per-request DeepL calls (which, across a ~60-item feed, exceed Vercel's 10s function limit → 504). Runs on the VDS backend (`next start`, no serverless timeout), so a synchronous pass is fine there.

- Auth: `requireAuth` + `requireAdmin` (403 otherwise).
- `POST /api/admin/translate/warm` → warm all translatable locales. `?lang=en` → only that locale. `?lang=ru` or an unknown lang → 400 (`ru` is the original, never translated).
- Idempotent + resumable: a post whose summary is already fresh is skipped. In-flight single-flight guard (409 on a concurrent call) keeps two runs from doubling the DeepL fan-out.
- Response: `{ success, data: { posts, translated, cached, errors, langs: [{ lang, translated, cached, error }] } }`.
- Also auto-runs per post: creating/publishing a post fires a fire-and-forget summary warm for that one post (so a new post's feed title is translated without a manual run). Never blocks or fails the create.
- Deploy: run once after a backend deploy that changes translations, or after clearing the cache, to warm prod. FE feeds already fall back to the original (RU) titles if a cold-cache translation would overrun the render budget, so warming is an optimisation, not a correctness requirement.

## Env

- Backend: `DEEPL_AUTH_KEY` (free tier → `https://api-free.deepl.com/v2/translate`). Absent = graceful degrade to original.
- Frontend: none needed for content translation (all server-side in backend). UI catalog generation uses `DEEPL_AUTH_KEY` at build/dev only (not runtime).

## Invariants (must hold)

1. `lang=ru`/absent → identical to legacy response (no regression).
2. Response shape/field names never change with `lang`.
3. `post.id` is always the original id.
4. Read path never fails due to translation errors (degrade to original).
5. Repeat `lang=en` reads are cache hits (no repeated DeepL calls until source changes).
6. A `summary`-scope row never satisfies a details read — the body always ends up translated (or the original on a graceful degrade), never a half-translated post.
7. A warm cache makes a `lang=en` feed a DB hit; a cold one degrades to original (RU) titles on the FE rather than 504-ing. Warming is an optimisation, not required for correctness.
