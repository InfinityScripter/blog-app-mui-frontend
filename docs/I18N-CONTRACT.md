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
| `GET /api/post/list` | `&lang=<ru\|en>` | Same, applied to every post in the list (`title`, `description`; body optional in list). |
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

## Env

- Backend: `DEEPL_AUTH_KEY` (free tier → `https://api-free.deepl.com/v2/translate`). Absent = graceful degrade to original.
- Frontend: none needed for content translation (all server-side in backend). UI catalog generation uses `DEEPL_AUTH_KEY` at build/dev only (not runtime).

## Invariants (must hold)

1. `lang=ru`/absent → identical to legacy response (no regression).
2. Response shape/field names never change with `lang`.
3. `post.id` is always the original id.
4. Read path never fails due to translation errors (degrade to original).
5. Repeat `lang=en` reads are cache hits (no repeated DeepL calls until source changes).
