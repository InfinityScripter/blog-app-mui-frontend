import { it, expect, describe } from "vitest";

import {
  addPassed,
  countCorrect,
  pickQuizItems,
  getLevelStates,
} from "../utils";

import type { SeriesLesson } from "../types";

const lesson = (number: number, reelUrl?: string): SeriesLesson => ({
  number,
  title: { ru: `Урок ${number}`, en: `Lesson ${number}` },
  reelUrl,
  questions: [1, 2, 3].map((index) => ({
    id: `${number}-${index}`,
    text: { ru: `Вопрос ${index}`, en: `Question ${index}` },
    answer: index === 1,
    why: { ru: "Пояснение", en: "Explanation" },
  })),
});

const sequence = (values: number[]) => {
  let position = 0;
  return () => {
    const value = values[position % values.length];
    position += 1;
    return value;
  };
};

describe("getLevelStates", () => {
  it("marks the first unpassed lesson current and unpublished ones soon", () => {
    const lessons = [
      lesson(1, "https://x/1"),
      lesson(2),
      lesson(3, "https://x/3"),
    ];

    expect(getLevelStates(lessons, [])).toEqual(["current", "soon", "open"]);
  });

  it("keeps passed lessons passed and moves current to the next one", () => {
    const lessons = [
      lesson(1, "https://x/1"),
      lesson(2),
      lesson(3, "https://x/3"),
    ];

    expect(getLevelStates(lessons, [1])).toEqual(["passed", "current", "open"]);
  });

  it("has no current lesson when everything is passed", () => {
    const lessons = [lesson(1), lesson(2)];

    expect(getLevelStates(lessons, [1, 2])).toEqual(["passed", "passed"]);
  });
});

describe("addPassed", () => {
  it("adds a lesson once and keeps the list sorted", () => {
    expect(addPassed([3, 1], 2)).toEqual([1, 2, 3]);
    expect(addPassed([1, 2], 2)).toEqual([1, 2]);
  });
});

describe("pickQuizItems", () => {
  it("takes one question from each of `count` different lessons", () => {
    const lessons = [lesson(1), lesson(2), lesson(3), lesson(4)];
    const items = pickQuizItems(
      lessons,
      3,
      sequence([0.9, 0.1, 0.5, 0.3, 0.7]),
    );
    const numbers = items.map((item) => item.lesson.number);

    expect(items).toHaveLength(3);
    expect(new Set(numbers).size).toBe(3);
    items.forEach((item) =>
      expect(item.lesson.questions).toContain(item.question),
    );
  });

  it("returns every lesson when count exceeds the lesson total", () => {
    expect(pickQuizItems([lesson(1), lesson(2)], 5)).toHaveLength(2);
  });
});

describe("countCorrect", () => {
  it("counts answers that match the expected ones", () => {
    const items = [lesson(1), lesson(2)].map((item) => ({
      lesson: item,
      question: item.questions[0],
    }));

    expect(countCorrect(items, [true, false])).toBe(1);
    expect(countCorrect(items, [true])).toBe(1);
  });
});
