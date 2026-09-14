import { it, expect, describe } from "vitest";
import { safeReturnTo } from "src/auth/guard/safe-return-to";

const FALLBACK = "/dashboard";

describe("safeReturnTo", () => {
  it("keeps an in-app relative path", () => {
    expect(safeReturnTo("/dashboard/post", FALLBACK)).toBe("/dashboard/post");
    expect(safeReturnTo("/ru/dashboard?tab=1", FALLBACK)).toBe(
      "/ru/dashboard?tab=1",
    );
  });

  it("rejects absolute and protocol-relative URLs", () => {
    expect(safeReturnTo("https://evil.example", FALLBACK)).toBe(FALLBACK);
    expect(safeReturnTo("//evil.example", FALLBACK)).toBe(FALLBACK);
    expect(safeReturnTo("http://evil.example/phish", FALLBACK)).toBe(FALLBACK);
  });

  it("rejects backslash tricks and empty/null", () => {
    expect(safeReturnTo("/\\evil.example", FALLBACK)).toBe(FALLBACK);
    expect(safeReturnTo(null, FALLBACK)).toBe(FALLBACK);
    expect(safeReturnTo(undefined, FALLBACK)).toBe(FALLBACK);
    expect(safeReturnTo("", FALLBACK)).toBe(FALLBACK);
  });
});
