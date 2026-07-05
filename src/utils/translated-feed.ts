import type { ListPostsResponse } from "src/types/api";

import { langQuery } from "src/utils/lang-param";
import { fetchJsonWithRetry } from "src/utils/fetch-retry";
import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// Cold-cache safety net for the localized public feeds (news / blog / tag).
// Post titles + descriptions are translated on the backend and served from a
// cache that is warmed ahead of time (POST /api/admin/translate/warm, plus a
// per-post warm on publish), so a normal translated list read is a fast DB hit.
// The risk is the FIRST render after a brand-new post or a cache wipe: the
// backend would translate the whole feed synchronously and could exceed
// Vercel's 10s serverless function limit (→ 504). This helper caps the wait and
// degrades to the original (Russian) feed if the translated fetch is too slow.

// Budget (ms) for a translated feed fetch on a cold cache. Well under 10s to
// leave room for the fallback fetch + render.
const TRANSLATED_FEED_BUDGET_MS = 4500;

/** Resolves to `"timeout"` if `promise` doesn't settle within `ms`. */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | "timeout"> {
  return Promise.race([
    promise,
    new Promise<"timeout">((resolve) => {
      setTimeout(() => resolve("timeout"), ms);
    }),
  ]);
}

/**
 * Runs a locale-aware list fetch with a cold-cache safety net. For the original
 * locale (`ru`) it just calls `fetchOriginal` (byte-identical, no translation).
 * For a translatable locale it tries `fetchTranslated`, but if that errors OR
 * overruns TRANSLATED_FEED_BUDGET_MS (a cold full-feed translation that would
 * risk a 504) it degrades to `fetchOriginal` — RU titles beat a timed-out page.
 * Chrome stays localized either way (next-intl). Once the cache is warm the
 * translated path returns quickly and the fallback never fires.
 *
 * This does NOT swallow a real outage: if the backend is down, `fetchOriginal`
 * throws too, so the page still fails (and ISR keeps the last good render)
 * instead of caching an empty feed.
 */
async function listWithColdCacheFallback(
  lang: AppLocale,
  fetchOriginal: () => Promise<ListPostsResponse>,
  fetchTranslated: () => Promise<ListPostsResponse>,
): Promise<ListPostsResponse> {
  if (lang === DEFAULT_LOCALE) {
    return fetchOriginal();
  }
  try {
    const result = await withTimeout(
      fetchTranslated(),
      TRANSLATED_FEED_BUDGET_MS,
    );
    return result === "timeout" ? fetchOriginal() : result;
  } catch {
    return fetchOriginal();
  }
}

/**
 * Fetches a post list (`{ posts }`) in the active locale from `baseUrl` (which
 * already carries its own query, e.g. `?tag=…`), appending `&lang=` for a
 * translatable locale. Wraps the translated read in the cold-cache fallback
 * above, so the caller (an ISR/SSR list page) gets translated titles on a warm
 * cache and the original (Russian) feed if a cold translation would time out.
 * `ru` fetches the byte-identical original with no fallback path.
 */
export function fetchListLocalized(
  baseUrl: string,
  lang: AppLocale,
  init: RequestInit,
): Promise<ListPostsResponse> {
  const read = (at: AppLocale) =>
    fetchJsonWithRetry<ListPostsResponse>(
      `${baseUrl}${langQuery(at, true)}`,
      init,
    );
  return listWithColdCacheFallback(
    lang,
    () => read(DEFAULT_LOCALE),
    () => read(lang),
  );
}
