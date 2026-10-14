import { it, vi, expect, describe } from "vitest";

import { generateMetadata as listMetadata } from "../page";
import { generateMetadata as detailMetadata } from "../[slug]/page";

vi.mock("next-intl/server", () => ({
  setRequestLocale: () => undefined,
  getTranslations: async () => (key: string) => key,
}));

vi.mock("src/sections/changelog/view/changelog-list-view", () => ({}));
vi.mock("src/sections/changelog/view/changelog-detail-view", () => ({}));
vi.mock("next/navigation", () => ({ notFound: () => undefined }));

vi.mock("src/actions/blog-ssr", () => ({
  getReleases: async () => ({ releases: [] }),
  getTimelineModels: async () => [],
  getRelease: async () => ({
    release: {
      vendor: "Anthropic",
      model: "Claude",
      version: "5",
      verdict: "ok",
      changes: [],
    },
  }),
}));

const SITE = "https://aifirst.us.com";

describe("changelog metadata", () => {
  it.each(["ru", "en"])(
    "list page %s points canonical at itself",
    async (locale) => {
      const meta = await listMetadata({ params: Promise.resolve({ locale }) });

      expect(meta).toMatchObject({
        alternates: {
          canonical: `${SITE}/${locale}/changelog/`,
          languages: {
            ru: `${SITE}/ru/changelog/`,
            en: `${SITE}/en/changelog/`,
            "x-default": `${SITE}/ru/changelog/`,
          },
        },
        openGraph: { url: `${SITE}/${locale}/changelog/` },
      });
    },
  );

  it("detail page ru has locale canonical, hreflang and matching og:url", async () => {
    const meta = await detailMetadata({
      params: Promise.resolve({ locale: "ru", slug: "claude 5" }),
    });

    expect(meta).toMatchObject({
      alternates: {
        canonical: `${SITE}/ru/changelog/claude%205/`,
        languages: {
          ru: `${SITE}/ru/changelog/claude%205/`,
          en: `${SITE}/en/changelog/claude%205/`,
          "x-default": `${SITE}/ru/changelog/claude%205/`,
        },
      },
      openGraph: { url: `${SITE}/ru/changelog/claude%205/` },
    });
  });
});
