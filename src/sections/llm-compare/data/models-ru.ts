import type { ComparableModel } from "../types";

// ----------------------------------------------------------------------
// Russian LLM vendors (Yandex, Sber) plus cheap/baseline models widely used as
// reference points (GPT-4o, Claude 3.5 Haiku, Gemini 2.0 Flash). For RU
// vendors USD pricing is `null` — their published rates are per-1000-tokens in
// rubles and no clean, dated USD conversion is asserted («NEVER invented»).
// Benchmarks are vendor-reported; MMLU only where the vendor states plain MMLU.

export const MODELS_RU: ComparableModel[] = [
  {
    id: "sber-gigachat-3-5-ultra",
    vendor: "Sber",
    name: "GigaChat 3.5 Ultra",
    releaseDate: "2026-07-06",
    contextTokens: null,
    maxOutputTokens: null,
    pricing: { inputPerM: null, outputPerM: null },
    benchmarks: {
      mmlu: null,
      gpqa: null,
      sweBench: { value: 42.6, unit: "percent" },
      aime: null,
    },
    capabilities: ["chat", "russian", "open-weights", "reasoning"],
    modality: ["text"],
    openWeights: true,
    highlight:
      "Открытый MoE-флагман Сбера: 432B параметров (28B активных) с гибридной архитектурой, 42.6% на SWE-bench Verified.",
    sourceUrl: "https://habr.com/ru/companies/sberbank/articles/1055826/",
    pricingAsOf: "2026-07-11",
  },
  {
    id: "yandex-yandexgpt-5-pro",
    vendor: "Yandex",
    name: "YandexGPT 5 Pro",
    releaseDate: "2025-02-25",
    contextTokens: 32000,
    maxOutputTokens: null,
    pricing: { inputPerM: null, outputPerM: null },
    benchmarks: {
      mmlu: { value: 83, unit: "percent" },
      gpqa: null,
      sweBench: null,
      aime: null,
    },
    capabilities: ["chat", "russian", "rag", "function-calling"],
    modality: ["text"],
    openWeights: false,
    highlight:
      "Флагман Яндекса для русскоязычных задач и RAG: на уровне GPT-4o в 64% типовых задач при контексте 32K токенов.",
    sourceUrl: "https://yandex.cloud/ru/services/yandexgpt",
    pricingAsOf: "2026-07-05",
  },
  {
    id: "sber-gigachat-2-max",
    vendor: "Sber",
    name: "GigaChat 2 MAX",
    releaseDate: "2025-03-13",
    contextTokens: 128000,
    maxOutputTokens: null,
    pricing: { inputPerM: null, outputPerM: null },
    benchmarks: {
      mmlu: { value: 86, unit: "percent" },
      gpqa: null,
      sweBench: null,
      aime: null,
    },
    capabilities: ["chat", "russian", "function-calling", "image-generation"],
    modality: ["text", "vision"],
    openWeights: false,
    highlight:
      "Старшая модель Сбера для сложных профессиональных задач: 128K контекста и MMLU 0.86 (5-shot) по данным Сбера.",
    sourceUrl: "https://developers.sber.ru/docs/ru/gigachat/models/updates",
    pricingAsOf: "2026-07-05",
  },
  {
    id: "openai-gpt-4o",
    vendor: "OpenAI",
    name: "GPT-4o",
    releaseDate: "2024-05-13",
    contextTokens: 128000,
    maxOutputTokens: 16384,
    pricing: { inputPerM: 2.5, outputPerM: 10 },
    benchmarks: { mmlu: null, gpqa: null, sweBench: null, aime: null },
    capabilities: ["chat", "vision", "function-calling"],
    modality: ["text", "vision"],
    openWeights: false,
    highlight:
      "Универсальный флагман-бейслайн OpenAI: 128K контекста, ввод текста и изображений, $2.50/$10 за 1M токенов.",
    sourceUrl: "https://developers.openai.com/api/docs/models/gpt-4o",
    pricingAsOf: "2026-07-05",
  },
  {
    id: "anthropic-claude-3-5-haiku",
    vendor: "Anthropic",
    name: "Claude 3.5 Haiku",
    releaseDate: "2024-10-22",
    contextTokens: 200000,
    maxOutputTokens: 8192,
    pricing: { inputPerM: 0.8, outputPerM: 4 },
    benchmarks: {
      mmlu: { value: 77.6, unit: "percent" },
      gpqa: { value: 41.6, unit: "percent" },
      sweBench: { value: 40.6, unit: "percent" },
      aime: { value: 5.3, unit: "percent" },
    },
    capabilities: ["chat", "vision", "coding", "tool-use"],
    modality: ["text", "vision"],
    openWeights: false,
    highlight:
      "Быстрый дешёвый тир Anthropic: 200K контекста и $0.80/$4 за 1M токенов при сильном кодинге и tool-use.",
    sourceUrl: "https://platform.claude.com/docs/en/about-claude/pricing",
    pricingAsOf: "2026-07-05",
  },
  {
    id: "google-gemini-2-0-flash",
    vendor: "Google",
    name: "Gemini 2.0 Flash",
    releaseDate: "2025-02-05",
    contextTokens: 1000000,
    maxOutputTokens: null,
    pricing: { inputPerM: 0.1, outputPerM: 0.4 },
    benchmarks: {
      mmlu: null,
      gpqa: { value: 65.2, unit: "percent" },
      sweBench: { value: 21.4, unit: "percent" },
      aime: { value: 29.7, unit: "percent" },
    },
    capabilities: ["chat", "vision", "tool-use", "multimodal"],
    modality: ["text", "vision", "audio"],
    openWeights: false,
    highlight:
      "Дешёвый быстрый мультимодальный бейслайн Google: 1M контекста и $0.10/$0.40 за 1M токенов.",
    sourceUrl: "https://ai.google.dev/gemini-api/docs/pricing",
    pricingAsOf: "2026-07-05",
  },
];
