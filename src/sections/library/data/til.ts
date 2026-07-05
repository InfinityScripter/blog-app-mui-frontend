import type { TilItem } from "../types";

// ----------------------------------------------------------------------
// «Today I Learned» — короткие заметки о том, что выяснилось на практике.
// Свой микро-контент. Каждая — факт и почему он важен. Даты — реальные.

export const TIL_ITEMS: TilItem[] = [
  {
    id: "til-swr-null-key",
    date: "2026-07-04",
    title: "SWR не делает запрос, если ключ — null",
    body: "Условный фетч в SWR делается не через if, а через ключ: передал null вместо URL — хук просто не стреляет. Удобно, чтобы не грузить данные до готовности зависимостей.",
    tags: ["swr", "react", "data-fetching"],
    sourceUrl: "https://swr.vercel.app/docs/conditional-fetching",
  },
  {
    id: "til-geo-bluf",
    date: "2026-07-01",
    title: "LLM цитируют то, что легко извлечь",
    body: "Для GEO (генеративной оптимизации) структура важнее ключевых слов: вынесенный вперёд вывод (BLUF), FAQ-блок и таблицы повышают шанс, что ассистент процитирует именно вас. Princeton GEO показал прирост видимости до 40%.",
    tags: ["geo", "seo", "llm"],
    sourceUrl: "https://arxiv.org/abs/2311.09735",
  },
  {
    id: "til-never-invented",
    date: "2026-06-28",
    title: "Для данных о моделях правило «не выдумывать» — обязательно",
    body: "Когда собираешь таблицу цен и бенчмарков LLM, любое непроверенное число должно быть null, а не догадкой. На публичной странице выдуманная цифра стоит доверия дороже, чем прочерк.",
    tags: ["data", "llm", "trust"],
    sourceUrl: null,
  },
  {
    id: "til-swe-bench-verified",
    date: "2026-06-20",
    title: "SWE-bench Verified — не то же, что SWE-bench",
    body: "Вендоры почти всегда отчитываются по SWE-bench Verified — вручную отобранному подмножеству из 500 задач, где условие решаемо. Сравнивать проценты можно только в пределах одной версии бенчмарка.",
    tags: ["benchmarks", "evaluation", "coding"],
    sourceUrl: "https://openai.com/index/introducing-swe-bench-verified/",
  },
  {
    id: "til-mmlu-variants",
    date: "2026-06-15",
    title: "«MMLU» в отчётах моделей часто означает разные бенчмарки",
    body: "Один вендор пишет MMLU, другой — MMLU-Pro или MMLU-Redux, третий — Global MMLU. Это разные тесты с разными числами, поэтому колонка «MMLU» в чужих сравнениях нередко несопоставима.",
    tags: ["benchmarks", "llm", "mmlu"],
    sourceUrl: null,
  },
  {
    id: "til-prompt-caching",
    date: "2026-06-08",
    title: "Кэш промптов режет цену длинного контекста в разы",
    body: "Если системный промпт и контекст повторяются между запросами, prompt caching у Anthropic/OpenAI даёт кэш-хиты дешевле входных токенов в несколько раз. Для агентов с большим стабильным префиксом экономия существенная.",
    tags: ["cost", "api", "context"],
    sourceUrl:
      "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching",
  },
];
