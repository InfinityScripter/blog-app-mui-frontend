import type { HostPoseName } from "../components/types";
import type {
  QuizItem,
  QuizPhase,
  VaryaPose,
  LevelState,
  SeriesLesson,
} from "./types";

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

interface QuizPoseInput {
  phase: QuizPhase;
  index: number;
  score: number;
  total: number;
  answer?: boolean;
  picked?: boolean;
}

export function quizPose({
  phase,
  index,
  score,
  total,
  answer,
  picked,
}: QuizPoseInput): HostPoseName {
  if (phase === "intro") return "curious";
  if (phase === "result") {
    if (score === total) return "wow";
    return score * 2 >= total ? "smile" : "shrug";
  }
  if (picked === undefined) return "think";
  const even = index % 2 === 0;
  if (picked === answer) return even ? "thumbs-up" : "laugh";
  return even ? "oops" : "facepalm";
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
