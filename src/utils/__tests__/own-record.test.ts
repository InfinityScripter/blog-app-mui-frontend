import { it, expect, describe } from "vitest";
import { ownRecordGet, ownRecordHas } from "src/utils/own-record";

const LABELS: Record<string, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic",
};

describe("ownRecordGet", () => {
  it("returns an own value when present", () => {
    expect(ownRecordGet(LABELS, "openai", "fallback")).toBe("OpenAI");
  });

  it("returns the fallback for a missing key", () => {
    expect(ownRecordGet(LABELS, "acme", "fallback")).toBe("fallback");
  });

  it("ignores prototype keys instead of returning inherited values", () => {
    expect(ownRecordGet(LABELS, "constructor", "fallback")).toBe("fallback");
    expect(ownRecordGet(LABELS, "__proto__", "fallback")).toBe("fallback");
    expect(ownRecordGet(LABELS, "hasOwnProperty", "fallback")).toBe("fallback");
  });

  it("treats an undefined record as empty", () => {
    expect(ownRecordGet(undefined, "openai", "fallback")).toBe("fallback");
  });
});

describe("ownRecordHas", () => {
  it("is true only for own keys", () => {
    expect(ownRecordHas(LABELS, "openai")).toBe(true);
    expect(ownRecordHas(LABELS, "constructor")).toBe(false);
    expect(ownRecordHas(undefined, "openai")).toBe(false);
  });
});
