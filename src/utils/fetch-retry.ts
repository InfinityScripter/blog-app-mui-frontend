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
      status
        ? `Request failed (${status}): ${url}`
        : `Request failed: ${url}`,
    );
    this.name = "FetchFailedError";
    this.status = status;
  }
}

// Two retries after the initial attempt: enough to ride out a backend restart
// (~1s) without stretching a Vercel build when the backend is genuinely down.
const RETRY_DELAYS_MS: readonly number[] = [1000, 4000];

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
      lastError = new FetchFailedError(url, res.status);
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
