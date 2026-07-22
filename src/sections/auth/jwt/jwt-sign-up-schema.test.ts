import { it, expect, describe } from "vitest";

import { SignUpSchema } from "./jwt-sign-up-schema";

const validSignUp = {
  firstName: "Test",
  lastName: "User",
  email: "test@example.com",
  password: "password123",
};

describe("SignUpSchema", () => {
  it("rejects registration without personal data consent", () => {
    expect(SignUpSchema.safeParse(validSignUp).success).toBe(false);
    expect(
      SignUpSchema.safeParse({
        ...validSignUp,
        personalDataConsent: false,
      }).success,
    ).toBe(false);
  });

  it("accepts explicit personal data consent", () => {
    expect(
      SignUpSchema.safeParse({
        ...validSignUp,
        personalDataConsent: true,
      }).success,
    ).toBe(true);
  });
});
