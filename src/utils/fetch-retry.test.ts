import { it, vi, expect, describe, afterEach } from "vitest";

import {
  NotFoundError,
  RateLimitedError,
  FetchFailedError,
  fetchJsonWithRetry,
} from "./fetch-retry";

// No real backoff in tests.
const NO_DELAYS: readonly number[] = [0, 0];

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("fetchJsonWithRetry", () => {
  it("returns parsed JSON on first success", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({ ok: 1 }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/list", undefined, NO_DELAYS),
    ).resolves.toEqual({ ok: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("retries transient 5xx and succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 500))
      .mockResolvedValueOnce(jsonResponse({}, 502))
      .mockResolvedValueOnce(jsonResponse({ posts: [] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/list", undefined, NO_DELAYS),
    ).resolves.toEqual({ posts: [] });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries network errors and rethrows the last one when exhausted", async () => {
    const boom = new Error("socket hang up");
    const fetchMock = vi.fn().mockRejectedValue(boom);
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/list", undefined, NO_DELAYS),
    ).rejects.toBe(boom);
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("throws FetchFailedError with status after exhausting 5xx retries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 500));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchJsonWithRetry(
      "https://api.test/list",
      undefined,
      NO_DELAYS,
    );
    await expect(promise).rejects.toBeInstanceOf(FetchFailedError);
    await promise.catch((error: FetchFailedError) => {
      expect(error.status).toBe(500);
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("retries 429 (rate limit) and succeeds", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse({}, 429))
      .mockResolvedValueOnce(jsonResponse({ posts: [] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/post?id=x", undefined, NO_DELAYS),
    ).resolves.toEqual({ posts: [] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("throws RateLimitedError (a FetchFailedError) after exhausting 429 retries", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 429));
    vi.stubGlobal("fetch", fetchMock);

    const promise = fetchJsonWithRetry(
      "https://api.test/post?id=x",
      undefined,
      NO_DELAYS,
    );
    // Subclass of FetchFailedError, so existing `instanceof FetchFailedError`
    // consumers keep catching it; carries the 429 status.
    await expect(promise).rejects.toBeInstanceOf(RateLimitedError);
    await expect(promise).rejects.toBeInstanceOf(FetchFailedError);
    await promise.catch((error: RateLimitedError) => {
      expect(error.status).toBe(429);
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("throws NotFoundError on 404 without retrying", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}, 404));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/post?id=x", undefined, NO_DELAYS),
    ).rejects.toBeInstanceOf(NotFoundError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("treats invalid JSON as transient and retries", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response("<html>bad gateway</html>"))
      .mockResolvedValueOnce(jsonResponse({ posts: [1] }));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchJsonWithRetry("https://api.test/list", undefined, NO_DELAYS),
    ).resolves.toEqual({ posts: [1] });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("passes init through to fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse({}));
    vi.stubGlobal("fetch", fetchMock);
    const init = { next: { revalidate: 3600 } } as RequestInit;

    await fetchJsonWithRetry("https://api.test/list", init, NO_DELAYS);
    expect(fetchMock).toHaveBeenCalledWith("https://api.test/list", init);
  });
});
