import { it, expect, describe } from "vitest";

import { createNewsletterSchema } from "./newsletter-schema";

const schema = createNewsletterSchema("Некорректный email", "Нужно согласие");

describe("createNewsletterSchema", () => {
  it("requires explicit consent for newsletter personal data processing", () => {
    expect(schema.safeParse({ email: "reader@example.com" }).success).toBe(
      false,
    );
    expect(
      schema.safeParse({
        email: "reader@example.com",
        personalDataConsent: false,
      }).success,
    ).toBe(false);
  });

  it("accepts email with explicit consent", () => {
    expect(
      schema.safeParse({
        email: "reader@example.com",
        personalDataConsent: true,
      }).success,
    ).toBe(true);
  });
});
