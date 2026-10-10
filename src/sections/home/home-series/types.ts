import type { AppLocale } from "src/i18n/locales";

// ----------------------------------------------------------------------

type LocalizedText = Record<AppLocale, string>;

interface SeriesQuestion {
  id: string;
  text: LocalizedText;
  answer: boolean;
  why: LocalizedText;
}

export interface SeriesLesson {
  number: number;
  title: LocalizedText;
  reelUrl?: string;
  questions: SeriesQuestion[];
}

export type LevelState = "passed" | "current" | "open" | "soon";

export interface SeriesProgress {
  passed: number[];
}

export interface QuizItem {
  lesson: SeriesLesson;
  question: SeriesQuestion;
}

export type QuizPhase = "intro" | "question" | "result";

export interface MapPoint {
  left: number;
  top: number;
}

export type VaryaPose = "walk" | "sit" | "jump";
