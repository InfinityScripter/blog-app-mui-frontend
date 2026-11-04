import type { Post } from "src/types/domain";

import type { QuizItem, VaryaPose, LevelState, SeriesLesson } from "./types";

// ----------------------------------------------------------------------

export function getLevelStates(
  lessons: SeriesLesson[],
  passed: number[],
): LevelState[] {
  const currentNumber = lessons.find(
    (lesson) => !passed.includes(lesson.number),
  )?.number;

  return lessons.map((lesson) => {
    if (passed.includes(lesson.number)) return "passed";
    if (lesson.number === currentNumber) return "current";
    return lesson.reelUrl === undefined ? "soon" : "open";
  });
}

export function addPassed(passed: number[], lessonNumber: number): number[] {
  if (passed.includes(lessonNumber)) return passed;
  return [...passed, lessonNumber].sort((a, b) => a - b);
}

export function pickQuizItems(
  lessons: SeriesLesson[],
  count: number,
  random: () => number = Math.random,
): QuizItem[] {
  return lessons
    .map((lesson) => ({ lesson, order: random() }))
    .sort((a, b) => a.order - b.order)
    .slice(0, count)
    .map(({ lesson }) => ({
      lesson,
      question:
        lesson.questions[Math.floor(random() * lesson.questions.length)],
    }));
}

export function countCorrect(items: QuizItem[], answers: boolean[]): number {
  return items.filter((item, index) => answers[index] === item.question.answer)
    .length;
}

export function pickRelatedPosts(
  posts: Post[],
  tags: string[] | undefined,
  count: number,
): Post[] {
  if (!tags?.length) return [];
  return posts
    .filter((post) => post.tags.some((tag) => tags.includes(tag)))
    .slice(0, count);
}

export function varyaPose({
  hopping,
  finished,
}: {
  hopping: boolean;
  finished: boolean;
}): VaryaPose {
  if (hopping) return "jump";
  return finished ? "sit" : "walk";
}
