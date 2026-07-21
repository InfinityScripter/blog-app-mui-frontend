// Server-side JSON fetch for the ISR/prerender data reads (src/actions/blog-ssr).
//
// Plain `fetch` + throw-on-!ok bit prod on 2026-07-03: a transient backend 500
// during a Vercel build threw, pages caught it as notFound()/empty-list, and
// ISR cached that result for a whole revalidate window — a 2-minute backend
// blip became an hour of 404-posts and empty feeds.
//
// This helper gives those reads two properties:
//   1. Transient failures (5xx, network, bad JSON) retry with backoff before
//      giving up, absorbing deploy-window blips.
//   2. 404 is NOT retried — it throws NotFoundError immediately, so pages can
//      map "object really gone" to notFound(). Any other exhausted failure
//      must be rethrown by the page (failing the build / keeping the stale ISR
//      page) instead of being cached as a 404 or an empty list.

/* eslint-disable max-classes-per-file -- two tiny sibling error types that
   only make sense together with the helper below */

export class NotFoundError extends Error {
  constructor(url: string) {
    super(`Resource not found (404): ${url}`);
    this.name = "NotFoundError";
  }
}

export class FetchFailedError extends Error {
  readonly status?: number;

  constructor(url: string, status?: number) {
    super(
      status ? `Request failed (${status}): ${url}` : `Request failed: ${url}`,
    );
    this.name = "FetchFailedError";
    this.status = status;
  }
}

// A 429 that survived all retries. Distinct from a plain FetchFailedError so a
// 429 ("we tripped our OWN backend rate-limit" — a big build bursting past the
// per-IP cap) is identifiable in logs/monitoring apart from a real outage
// (5xx/network). NOTE: this is observability only — no code branches on it yet;
// an exhausted RateLimitedError still propagates and fails the build like any
// other. The actual build-safety guard is the prerender cap in the post page's
// generateStaticParams (fewer concurrent build-time detail fetches), NOT a catch
// on this type. Subclasses FetchFailedError so existing `instanceof
// FetchFailedError` consumers keep catching it.
export class RateLimitedError extends FetchFailedError {
  constructor(url: string) {
    super(url, 429);
    this.name = "RateLimitedError";
  }
}

// Retries after the initial attempt. The longer tail (15s) is sized for the
// backend's per-IP list rate-limit (60/min): a big build that prerenders many
// posts/tags can burst past the cap and get 429s, so a rate-limited read waits
// out most of a window rather than failing the whole deploy. Short early delays
// still absorb a backend restart (~1s) cheaply.
const RETRY_DELAYS_MS: readonly number[] = [1000, 4000, 15000];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/* eslint-disable no-await-in-loop -- sequential backoff retries: each attempt
   must finish (and the delay elapse) before the next one starts */
export async function fetchJsonWithRetry<T>(
  url: string,
  init?: Parameters<typeof fetch>[1],
  retryDelaysMs: readonly number[] = RETRY_DELAYS_MS,
): Promise<T> {
  let lastError: unknown = new FetchFailedError(url);

  for (let attempt = 0; attempt <= retryDelaysMs.length; attempt += 1) {
    if (attempt > 0) {
      await sleep(retryDelaysMs[attempt - 1]);
    }
    try {
      const res = await fetch(url, init);
      if (res.status === 404) {
        throw new NotFoundError(url);
      }
      if (res.ok) {
        return (await res.json()) as T;
      }
      // 429 is retried like any transient failure (the retry delays are sized
      // to wait out most of the rate-limit window), but the error we carry
      // forward is the typed RateLimitedError so a caller can special-case it.
      lastError =
        res.status === 429
          ? new RateLimitedError(url)
          : new FetchFailedError(url, res.status);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      lastError = error;
    }
  }

  throw lastError;
}
/* eslint-enable no-await-in-loop */
