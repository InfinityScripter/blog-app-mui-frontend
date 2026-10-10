import { useState, useCallback } from "react";

import { QUIZ_SIZE } from "../const";
import { SERIES_LESSONS } from "../data/lessons";
import { countCorrect, pickQuizItems } from "../utils";

import type { QuizItem, QuizPhase } from "../types";

// ----------------------------------------------------------------------

export function useSeriesQuiz() {
  const [phase, setPhase] = useState<QuizPhase>("intro");
  const [items, setItems] = useState<QuizItem[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [index, setIndex] = useState(0);

  const start = useCallback(() => {
    setItems(pickQuizItems(SERIES_LESSONS, QUIZ_SIZE));
    setAnswers([]);
    setIndex(0);
    setPhase("question");
  }, []);

  const pick = useCallback(
    (value: boolean) =>
      setAnswers((prev) => (prev.length > index ? prev : [...prev, value])),
    [index],
  );

  const next = useCallback(() => {
    if (index + 1 < items.length) {
      setIndex(index + 1);
      return;
    }
    setPhase("result");
  }, [index, items.length]);

  const current: QuizItem | undefined = items[index];
  const picked: boolean | undefined = answers[index];

  return {
    phase,
    total: items.length,
    index,
    current,
    picked,
    score: countCorrect(items, answers),
    start,
    pick,
    next,
  };
}
