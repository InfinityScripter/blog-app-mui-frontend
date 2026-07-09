import type { PostResponse, ListPostsResponse } from "src/types/api";

import { langQuery } from "src/utils/lang-param";
import { fetchJsonWithRetry } from "src/utils/fetch-retry";
import { DEFAULT_LOCALE, type AppLocale } from "src/i18n/locales";

// Cold-cache safety net for the localized public post pages (feeds: news / blog
// / tag; and a single post's details). Post text is translated on the backend
// and served from a cache warmed ahead of time (POST /api/admin/translate/warm
// + a per-post warm on publish), so a normal translated read is a fast DB hit.
// The risk is a COLD cache (a brand-new post, a cache wipe, or a not-yet-warmed
// corpus): the backend translates synchronously and — on the free tier — can
// exceed Vercel's 10s serverless limit (a whole feed, or even one long body) →
// 504. These helpers cap the wait and degrade to the ORIGINAL (Russian) content
// so the page always renders; the background warm then fills the cache and the
// next ISR render flips to the translation.

// Budget (ms) for a cold-cache translated FEED fetch. Well under 10s to leave
// room for the fallback fetch + render.
const TRANSLATED_FEED_BUDGET_MS = 4500;

// Budget (ms) for a cold-cache translated single POST (details). A single body
// is one request but can be long; still capped under Vercel's 10s so a slow
// cold body degrades to the original instead of 504-ing the page.
const TRANSLATED_DETAIL_BUDGET_MS = 7000;

/** Resolves to `"timeout"` if `promise` doesn't settle within `ms`. */
function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T | "timeout"> {
  // When the timeout branch wins the race, `promise` keeps running (a retrying
  // fetch can take ~20s to finally reject). Consume that late settlement so a
  // post-race rejection can't surface as an unhandled rejection in the
  // long-lived server process. The caller falls back to the original on timeout,
  // so this discarded result/error is intentional.
  promise.catch(() => undefined);
  return Promise.race([
    promise,
    new Promise<"timeout">((resolve) => {
      setTimeout(() => resolve("timeout"), ms);
    }),
  ]);
}

/**
 * Runs a locale-aware fetch with a cold-cache safety net. For the original
 * locale (`ru`) it just calls `fetchOriginal` (byte-identical, no translation).
 * For a translatable locale it tries `fetchTranslated`, but if that errors OR
 * overruns `budgetMs` (a cold translation that would risk a 504) it degrades to
 * `fetchOriginal` — original content beats a timed-out page. Chrome stays
 * localized either way (next-intl). Once the cache is warm the translated path
 * returns quickly and the fallback never fires.
 *
 * This does NOT swallow a real outage: if the backend is down, `fetchOriginal`
 * throws too, so the page still fails (and ISR keeps the last good render)
 * instead of caching empty/placeholder content.
 */
async function withColdCacheFallback<T>(
  lang: AppLocale,
  budgetMs: number,
  fetchOriginal: () => Promise<T>,
  fetchTranslated: () => Promise<T>,
): Promise<T> {
  if (lang === DEFAULT_LOCALE) {
    return fetchOriginal();
  }
  try {
    const result = await withTimeout(fetchTranslated(), budgetMs);
    return result === "timeout" ? fetchOriginal() : result;
  } catch {
    return fetchOriginal();
  }
}

/**
 * Fetches a post list (`{ posts }`) in the active locale from `baseUrl` (which
 * already carries its own query, e.g. `?tag=…`), appending `&lang=` for a
 * translatable locale, with the cold-cache fallback above. The caller (an
 * ISR/SSR list page) gets translated titles on a warm cache and the original
 * (Russian) feed if a cold translation would time out. `ru` fetches the
 * byte-identical original with no fallback path.
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
  return withColdCacheFallback(
    lang,
    TRANSLATED_FEED_BUDGET_MS,
    () => read(DEFAULT_LOCALE),
    () => read(lang),
  );
}

/**
 * Fetches a single post's details (`{ post, latestPosts }`) in the active locale
 * from `baseUrl` (which already carries `?id=…`), with the cold-cache fallback.
 * A warm cache returns the translated post fast; a cold body that would overrun
 * the detail budget degrades to the original (Russian) post so the page never
 * 504s, and the background warm fills the body for the next ISR render. `ru`
 * fetches the original with no fallback path.
 */
export function fetchDetailLocalized(
  baseUrl: string,
  lang: AppLocale,
  init: RequestInit,
): Promise<PostResponse> {
  const read = (at: AppLocale) =>
    fetchJsonWithRetry<PostResponse>(`${baseUrl}${langQuery(at, true)}`, init);
  return withColdCacheFallback(
    lang,
    TRANSLATED_DETAIL_BUDGET_MS,
    () => read(DEFAULT_LOCALE),
    () => read(lang),
  );
}
