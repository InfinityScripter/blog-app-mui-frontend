import type { AxiosAdapter, AxiosResponse, InternalAxiosRequestConfig } from "axios";

import { it, vi, expect, describe, beforeEach } from "vitest";

import axiosInstance from "../axios";

// ----------------------------------------------------------------------
// Exercises the response interceptor's 401→refresh→retry logic by swapping in a
// scripted adapter. We assert single-flight dedup, stop-after-one, the
// refresh-path bypass, and the session-expired emit on a failed refresh.

// Mock the session-events bridge so we can assert emitSessionExpired is called.
const emitSpy = vi.fn();
vi.mock("src/auth/context/jwt/session-events", () => ({
  emitSessionExpired: () => emitSpy(),
  onSessionExpired: () => () => {},
}));

function ok(config: InternalAxiosRequestConfig, data: unknown = {}): AxiosResponse {
  return {
    data,
    status: 200,
    statusText: "OK",
    headers: {},
    config,
  };
}

function unauthorized(config: InternalAxiosRequestConfig): never {
  const err = new Error("Unauthorized") as Error & {
    response: { status: number; data: { message: string } };
    config: InternalAxiosRequestConfig;
    isAxiosError: boolean;
  };
  err.response = { status: 401, data: { message: "Unauthorized" } };
  err.config = config;
  err.isAxiosError = true;
  throw err;
}

/** Install a scripted adapter and return call counters. */
function installAdapter(
  script: (url: string, config: InternalAxiosRequestConfig) => AxiosResponse,
) {
  const calls: string[] = [];
  const adapter: AxiosAdapter = async (config) => {
    const url = config.url ?? "";
    calls.push(url);
    return script(url, config);
  };
  axiosInstance.defaults.adapter = adapter;
  return { calls };
}

describe("axios refresh interceptor", () => {
  beforeEach(() => {
    emitSpy.mockClear();
  });

  it("on 401, refreshes once then retries the original request", async () => {
    let protectedHits = 0;
    const { calls } = installAdapter((url, config) => {
      if (url === "/api/auth/refresh") return ok(config);
      // First hit → 401; after refresh the retry succeeds.
      protectedHits += 1;
      if (protectedHits === 1) return unauthorized(config);
      return ok(config, { ok: true });
    });

    const res = await axiosInstance.get("/api/protected");
    expect(res.data).toEqual({ ok: true });
    expect(calls.filter((u) => u === "/api/auth/refresh")).toHaveLength(1);
    expect(emitSpy).not.toHaveBeenCalled();
  });

  it("does not retry (and emits session-expired) when refresh itself fails", async () => {
    const { calls } = installAdapter((url, config) => 
      // Both the protected call and the refresh return 401.
       unauthorized(config)
    );

    await expect(axiosInstance.get("/api/protected")).rejects.toThrow();
    // Exactly one refresh attempt; no infinite loop.
    expect(calls.filter((u) => u === "/api/auth/refresh")).toHaveLength(1);
    expect(emitSpy).toHaveBeenCalledTimes(1);
  });

  it("does not attempt refresh for a 401 on the refresh endpoint itself", async () => {
    const { calls } = installAdapter((url, config) => unauthorized(config));

    await expect(axiosInstance.post("/api/auth/refresh")).rejects.toThrow();
    // The bypass list prevents the refresh call from triggering another refresh.
    expect(calls.filter((u) => u === "/api/auth/refresh")).toHaveLength(1);
  });

  it("single-flight: concurrent 401s share ONE refresh call", async () => {
    const protectedHits: Record<string, number> = {};
    const { calls } = installAdapter((url, config) => {
      if (url === "/api/auth/refresh") return ok(config);
      protectedHits[url] = (protectedHits[url] ?? 0) + 1;
      if (protectedHits[url] === 1) return unauthorized(config);
      return ok(config, { url });
    });

    const [a, b] = await Promise.all([
      axiosInstance.get("/api/a"),
      axiosInstance.get("/api/b"),
    ]);
    expect(a.data).toEqual({ url: "/api/a" });
    expect(b.data).toEqual({ url: "/api/b" });
    // Two 401s, but only a single shared refresh.
    expect(calls.filter((u) => u === "/api/auth/refresh")).toHaveLength(1);
  });
});
