import { it, expect, describe } from "vitest";

import { SERIES_LESSONS } from "../data/lessons";

const TELEGRAM_QUIZ_EXPLANATION_LIMIT = 200;

describe("SERIES_LESSONS", () => {
  it("has 12 lessons numbered 1..12 in order", () => {
    expect(SERIES_LESSONS.map((lesson) => lesson.number)).toEqual(
      Array.from({ length: 12 }, (_, index) => index + 1),
    );
  });

  it("gives every lesson three questions with unique ids", () => {
    const ids = SERIES_LESSONS.flatMap((lesson) =>
      lesson.questions.map((question) => question.id),
    );

    SERIES_LESSONS.forEach((lesson) =>
      expect(lesson.questions).toHaveLength(3),
    );
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("mixes yes and no answers inside every lesson", () => {
    SERIES_LESSONS.forEach((lesson) => {
      const answers = lesson.questions.map((question) => question.answer);

      expect(answers).toContain(true);
      expect(answers).toContain(false);
    });
  });

  it("keeps explanations within the Telegram quiz limit in both languages", () => {
    const tooLong = SERIES_LESSONS.flatMap((lesson) => lesson.questions)
      .filter(
        (question) =>
          question.why.ru.length > TELEGRAM_QUIZ_EXPLANATION_LIMIT ||
          question.why.en.length > TELEGRAM_QUIZ_EXPLANATION_LIMIT,
      )
      .map((question) => question.id);

    expect(tooLong).toEqual([]);
  });

  it("links only to https reels", () => {
    const insecure = SERIES_LESSONS.filter(
      (lesson) =>
        lesson.reelUrl !== undefined && !lesson.reelUrl.startsWith("https://"),
    ).map((lesson) => lesson.number);

    expect(insecure).toEqual([]);
  });
});
