import { it, expect, describe, afterEach } from "vitest";

import {
  isMutatingMethod,
  readBrowserCookie,
  CSRF_COOKIE_NAME,
} from "../csrf-cookie";

// jsdom is not configured (env: node), so document is undefined by default. We
// stub it per-test to exercise readBrowserCookie's browser branch.
function stubCookie(value: string | undefined): void {
  if (value === undefined) {
    // @ts-expect-error – deleting the test stub
    delete globalThis.document;
    return;
  }
  // @ts-expect-error – minimal document stub for the test
  globalThis.document = { cookie: value };
}

describe("csrf-cookie", () => {
  afterEach(() => stubCookie(undefined));

  describe("isMutatingMethod", () => {
    it("is true for post/put/patch/delete (any case)", () => {
      expect(isMutatingMethod("post")).toBe(true);
      expect(isMutatingMethod("PUT")).toBe(true);
      expect(isMutatingMethod("Patch")).toBe(true);
      expect(isMutatingMethod("DELETE")).toBe(true);
    });

    it("is false for get/head and undefined", () => {
      expect(isMutatingMethod("get")).toBe(false);
      expect(isMutatingMethod("HEAD")).toBe(false);
      expect(isMutatingMethod(undefined)).toBe(false);
    });
  });

  describe("readBrowserCookie", () => {
    it("reads a named cookie value", () => {
      stubCookie(`${CSRF_COOKIE_NAME}=abc123; other=1`);
      expect(readBrowserCookie(CSRF_COOKIE_NAME)).toBe("abc123");
      expect(readBrowserCookie("other")).toBe("1");
    });

    it("returns undefined for a missing cookie", () => {
      stubCookie("foo=bar");
      expect(readBrowserCookie(CSRF_COOKIE_NAME)).toBeUndefined();
    });

    it("returns undefined when document is absent (SSR)", () => {
      stubCookie(undefined);
      expect(readBrowserCookie(CSRF_COOKIE_NAME)).toBeUndefined();
    });

    it("url-decodes the value", () => {
      stubCookie(`${CSRF_COOKIE_NAME}=a%2Bb%3Dc`);
      expect(readBrowserCookie(CSRF_COOKIE_NAME)).toBe("a+b=c");
    });
  });
});
