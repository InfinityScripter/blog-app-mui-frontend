import { it, expect, describe } from "vitest";

import { PORTFOLIO_PROJECTS } from "../const";
import ru from "../../../../../messages/ru.json";
import en from "../../../../../messages/en.json";

describe("PORTFOLIO_PROJECTS", () => {
  it("links only to public https resources", () => {
    PORTFOLIO_PROJECTS.forEach((project) => {
      expect(project.link).toMatch(/^https:\/\//);
    });
  });

  it.each([
    ["ru", ru],
    ["en", en],
  ])("has description and status for every project in %s", (_, messages) => {
    PORTFOLIO_PROJECTS.forEach(({ key }) => {
      const copy = messages.portfolio.projects.items[key];
      expect(copy.description).toBeTruthy();
      expect(copy.status).toBeTruthy();
    });
  });
});
