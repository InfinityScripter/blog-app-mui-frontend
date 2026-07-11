import type { LlmModel } from "../types";

// ----------------------------------------------------------------------
// Landmark LLMs of 2026 — the agent-and-frontier-race year. «NEVER invented»:
// unknown numerics are `null`. Each entry carries a verified official
// announcement URL (vendor pages 403 bots but open in browsers).

export const LLM_MODELS_2026: LlmModel[] = [
  {
    id: "moonshot-kimi-k2-5",
    slug: "kimi-k2-5",
    vendor: "Moonshot AI",
    name: "Kimi K2.5",
    releaseDate: "2026-01-27",
    contextTokens: 262144,
    params: "1T total / 32B active (MoE)",
    highlight:
      "Открытая мультимодальная эволюция Kimi K2: рассуждения, зрение и агентные «рои» на весах под свободной лицензией.",
    description:
      "Moonshot AI обновила свой открытый триллионник: K2.5 сохраняет 1T параметров (32B активных) и добавляет мультимодальность (зрение), усиленные рассуждения и режим агентных «роёв» (agent swarm) для параллельной работы над задачей. Контекст расширен до 256K токенов. Веса выложены под свободной лицензией, первопартийный API стоит $0.60/$2.50 за млн токенов.",
    capabilities: ["open-weights", "MoE", "reasoning", "agentic", "multimodal"],
    sourceUrl: "https://www.kimi.com/blog/kimi-k2-5",
    wikiUrl: "https://en.wikipedia.org/wiki/Kimi_K2",
    funFact:
      "K2.5 набирает 96.1% на AIME — открытая модель вплотную подошла к закрытым флагманам по олимпиадной математике.",
  },
  {
    id: "anthropic-claude-opus-4-6",
    slug: "claude-opus-4-6",
    vendor: "Anthropic",
    name: "Claude Opus 4.6",
    releaseDate: "2026-02-05",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Адаптивное мышление и контекст 1M токенов за ту же цену, что Opus 4.5 — 80.8% на SWE-bench Verified.",
    description:
      "Anthropic заменила «расширенное мышление» на adaptive thinking с уровнями усилия (low/medium/high/max): модель сама решает, сколько рассуждать над задачей. Opus 4.6 набирает 80.8% на SWE-bench Verified, получает окно в 1 млн токенов (в бете) и до 128K токенов вывода — при неизменной базовой цене $5/$25 за млн токенов.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "computer-use",
      "long-context",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-6",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "Базовая цена осталась $5/$25, но при выходе за 200K токенов в 1M-окне включается премиум-тариф $10/$37.50.",
  },
  {
    id: "zhipu-glm-5",
    slug: "glm-5",
    vendor: "Zhipu AI",
    name: "GLM-5",
    releaseDate: "2026-02-11",
    contextTokens: 200000,
    params: "744B total / 40B active (MoE)",
    highlight:
      "Открытый фронтир Z.ai: 744B MoE с 77.8% на SWE-bench Verified и 92.7% на AIME.",
    description:
      "Z.ai (бывшая Zhipu AI) выпустила GLM-5 — открытую MoE-модель на 744B параметров (40B активных), закрепив линейку GLM среди открытых фронтир-моделей. Набирает 77.8% на SWE-bench Verified, 86% на GPQA Diamond и 92.7% на AIME, объединяя агентные навыки, рассуждения и кодинг с гибридными режимами thinking/non-thinking.",
    capabilities: ["open-weights", "MoE", "agentic", "reasoning", "coding"],
    sourceUrl: "https://docs.z.ai/release-notes/new-released",
    wikiUrl: "https://en.wikipedia.org/wiki/GLM-4.5",
    funFact:
      "GLM-5 вышла всего через полгода после GLM-4.5 и подняла результат на SWE-bench с 64 до 77.8% — почти на уровень закрытых флагманов.",
  },
  {
    id: "alibaba-qwen3-5",
    slug: "qwen3-5",
    vendor: "Alibaba",
    name: "Qwen3.5",
    releaseDate: "2026-02-16",
    contextTokens: 262144,
    params: "397B total / 17B active (MoE, гибридное линейное внимание)",
    highlight:
      "Открытый флагман Qwen с гибридной архитектурой линейного внимания и разреженного MoE — 88.4% GPQA.",
    description:
      "Alibaba выложила Qwen3.5 (397B/17B active) — открытую MoE-модель с гибридной архитектурой, сочетающей линейное внимание (Gated DeltaNet) и разреженный MoE ради длинного контекста и скорости. Мультимодальна, поддерживает 20+ языков, контекст 256K токенов; набирает 88.4% на GPQA Diamond и 76.4% на SWE-bench Verified. Первопартийный API — $0.60/$3.60 за млн токенов.",
    capabilities: ["open-weights", "MoE", "reasoning", "coding", "multimodal"],
    sourceUrl: "https://qwen.ai/blog?id=qwen3.5",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Гибридное линейное внимание позволяет держать 256K-контекст без квадратичного роста памяти — редкий выбор архитектуры для открытого флагмана.",
  },
  {
    id: "google-gemini-3-1-pro",
    slug: "gemini-3-1-pro",
    vendor: "Google",
    name: "Gemini 3.1 Pro",
    releaseDate: "2026-02-19",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Превью обновлённого флагмана Google: 77.1% на ARC-AGI-2 — более чем вдвое выше Gemini 3 Pro.",
    description:
      "Google выпустила Gemini 3.1 Pro как превью — чтобы обкатать агентные сценарии перед общей доступностью. Результат на ARC-AGI-2 подскочил до 77.1% (более чем вдвое против Gemini 3 Pro), GPQA Diamond — 94.3%, SWE-bench Verified — 80.6%. Контекст 1 млн токенов, доступ через Gemini API, Vertex AI, приложение Gemini и NotebookLM. Цена — $2/$12 за млн токенов.",
    capabilities: [
      "reasoning",
      "multimodal",
      "long-context",
      "agentic",
      "coding",
    ],
    sourceUrl: "https://deepmind.google/models/model-cards/gemini-3-1-pro/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "Модель выпустили именно как preview, а не GA: Google взяла время обкатать агентные рабочие процессы на масштабе перед широким релизом.",
  },
  {
    id: "openai-gpt-5-4",
    slug: "gpt-5-4",
    vendor: "OpenAI",
    name: "GPT-5.4",
    releaseDate: "2026-03-05",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Первая mainline-модель OpenAI с нативным управлением компьютером: 75.0% на OSWorld — выше человека.",
    description:
      "GPT-5.4 — первая reasoning-модель общего назначения OpenAI с нативным computer-use: 75.0% на OSWorld-Verified против 47.3% у GPT-5.2 и выше уровня человека (72.4%). Вобрала фронтир-кодинг GPT-5.3-Codex и раскатана по ChatGPT, API и Codex. Контекст до 1 млн токенов (стандартно 272K), в API появилась система Tool Search. Цена — $2.50/$15 за млн токенов.",
    capabilities: [
      "reasoning",
      "coding",
      "computer-use",
      "agentic",
      "long-context",
    ],
    sourceUrl: "https://openai.com/index/introducing-gpt-5-4/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.4",
    funFact:
      "Новая система Tool Search подгружает определения инструментов по запросу, а не все сразу — это срезает расход токенов примерно на 47% в tool-heavy сценариях.",
  },
  {
    id: "google-gemma-4",
    slug: "gemma-4",
    vendor: "Google",
    name: "Gemma 4",
    releaseDate: "2026-04-02",
    contextTokens: 256000,
    params: "E2B / E4B / 26B MoE (3.8B active) / 31B dense",
    highlight:
      "Самое умное открытое семейство Google (Apache 2.0): 31B Dense — #3 среди всех открытых моделей на Arena.",
    description:
      "Gemma 4 — открытое семейство Google в четырёх размерах (от E2B до 31B dense) под Apache 2.0, построенное на той же базе, что и проприетарный Gemini 3. Старшая 31B Dense вышла на #3 среди всех открытых моделей на Arena, обходя модели в 20 раз крупнее; AIME 2026 выросла до 89.2% против 20.8% у Gemma 3 27B. Служит фундаментом для будущего Gemini Nano.",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "reasoning",
      "on-device",
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-4/",
    wikiUrl: "https://en.wikipedia.org/wiki/Gemma_(language_model)",
    funFact:
      "Модели E2B/E4B работают полностью офлайн с почти нулевой задержкой на телефонах, Raspberry Pi и NVIDIA Jetson — Gemma к тому моменту скачали более 400 млн раз.",
  },
  {
    id: "anthropic-claude-opus-4-7",
    slug: "claude-opus-4-7",
    vendor: "Anthropic",
    name: "Claude Opus 4.7",
    releaseDate: "2026-04-16",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Ввёл уровень усилия xhigh между high и max — акцент на самых трудных задачах разработки.",
    description:
      "Opus 4.7 — заметный шаг вперёд в агентной разработке с приростом на самых сложных задачах. Anthropic добавила уровень усилия xhigh (между high и max), улучшила зрение (изображения до ~3.75 мегапикселя) и работу с файловой памятью. Цена осталась на уровне 4.6 — $5/$25 за млн токенов.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "vision",
      "long-context",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-7",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "Anthropic прямо признала, что 4.7 менее широко способен, чем их же нерелизнутый на тот момент Claude Mythos Preview.",
  },
  {
    id: "openai-gpt-5-5",
    slug: "gpt-5-5",
    vendor: "OpenAI",
    name: "GPT-5.5",
    releaseDate: "2026-04-23",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Сильнейшая агентная кодинг-модель OpenAI на момент выхода: SOTA 82.7% на Terminal-Bench 2.0.",
    description:
      "GPT-5.5 (кодовое имя «Spud») — самая мощная агентная модель OpenAI на день релиза: SOTA 82.7% на Terminal-Bench 2.0 и 58.6% на SWE-Bench Pro. Контекст 1 млн токенов, цена $5/$30 за млн токенов (вдвое дороже GPT-5.4), есть вариант Pro ($30/$180). 5 мая 2026 GPT-5.5 Instant стала дефолтной моделью ChatGPT.",
    capabilities: [
      "reasoning",
      "coding",
      "agentic",
      "computer-use",
      "long-context",
    ],
    sourceUrl: "https://openai.com/index/introducing-gpt-5-5/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.5",
    funFact:
      "Несмотря на удвоение цены за токен, в агентных задачах модель выдаёт примерно на 40% меньше выходных токенов — реальный рост стоимости около 20%.",
  },
  {
    id: "deepseek-deepseek-v4",
    slug: "deepseek-v4",
    vendor: "DeepSeek",
    name: "DeepSeek-V4 (Preview)",
    releaseDate: "2026-04-24",
    contextTokens: 1000000,
    params: "V4-Pro: 1.6T / 49B active; V4-Flash: 284B / 13B active (MoE)",
    highlight:
      "Открытый прыжок DeepSeek к 1M-контексту: превью V4 набирает 80.6% на SWE-bench Verified.",
    description:
      "Превью DeepSeek-V4 в двух вариантах — Pro (1.6T/49B active) и Flash (284B/13B active) — с расширением контекста до 1 млн токенов. По заявлению DeepSeek, набирает 80.6% на SWE-bench Verified. Открытые веса и первопартийный API по цене $0.435/$0.87 за млн токенов сохраняют репутацию DeepSeek как самого дешёвого фронтира.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "agentic",
      "long-context",
    ],
    sourceUrl: "https://api-docs.deepseek.com/news/news260424/",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "V4-Pro на 1.6 трлн параметров — крупнейшая на тот момент открытая MoE-модель, при этом на токен активирует лишь 49B.",
  },
  {
    id: "google-gemini-3-5-flash",
    slug: "gemini-3-5-flash",
    vendor: "Google",
    name: "Gemini 3.5 Flash",
    releaseDate: "2026-05-19",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Дебют поколения Gemini 3.5 на Google I/O 2026: 76.2% на Terminal-Bench 2.1 при рекордной скорости.",
    description:
      "Быстрая модель нового поколения Gemini 3.5, анонсированная на Google I/O 2026 и доступная сразу. Даёт интеллект уровня крупных флагманов при высокой скорости: 76.2% на Terminal-Bench 2.1, 83.6% на MCP Atlas и вчетверо больше токенов в секунду, чем другие фронтир-модели. Цена — $1.50/$9 за млн токенов; вместе с ней анонсирован Gemini 3.5 Pro (выход месяцем позже).",
    capabilities: ["reasoning", "coding", "agentic", "multimodal"],
    sourceUrl:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-5/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "На I/O 2026 Google перетасовала иерархию: 3.5 Flash вышел первым, а 3.5 Pro был обещан «в следующем месяце» — обратный привычному порядку.",
  },
  {
    id: "alibaba-qwen3-7-max",
    slug: "qwen3-7-max",
    vendor: "Alibaba",
    name: "Qwen3.7-Max",
    releaseDate: "2026-05-20",
    contextTokens: 1000000,
    params: "~1T total / ~24B active (MoE)",
    highlight:
      "Закрытый агентный флагман Alibaba: 92.4% GPQA и 80.4% SWE-bench Verified при контексте 1M.",
    description:
      "Qwen3.7-Max — старшая закрытая модель Alibaba, позиционируемая как «граница агентов»: ~1T параметров (~24B активных, MoE), контекст 1 млн токенов, 92.4% на GPQA Diamond и 80.4% на SWE-bench Verified. В отличие от открытой линейки Qwen, Max доступна только через API Alibaba Cloud по цене $2.50/$7.50 за млн токенов.",
    capabilities: ["reasoning", "agentic", "coding", "long-context"],
    sourceUrl:
      "https://www.alibabacloud.com/blog/qwen3-7-the-agent-frontier_603154",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Max — единственная закрытая ветка Qwen: открытыми Alibaba выкладывает модели поменьше, а флагман-«агент» держит только в облаке.",
  },
  {
    id: "anthropic-claude-opus-4-8",
    slug: "claude-opus-4-8",
    vendor: "Anthropic",
    name: "Claude Opus 4.8",
    releaseDate: "2026-05-28",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Упор на надёжность кода и честность: вчетверо реже пропускает собственные баги, 84% на Online-Mind2Web.",
    description:
      "Anthropic описала Opus 4.8 как улучшение агентного мышления и суждения. Модель примерно вчетверо реже предшественника оставляет незамеченными дефекты в собственном коде, набирает 84% на Online-Mind2Web (computer use) и ставит рекорд на Legal Agent Benchmark. Базовая цена $5/$25 за млн токенов, быстрый режим — $10/$50.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "computer-use",
      "honesty",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-8",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "Модель больше склонна честно отмечать неуверенность в собственной работе, чем отвечать наугад — Anthropic сделала «честность» отдельной целью обучения.",
  },
  {
    id: "minimax-minimax-m3",
    slug: "minimax-m3",
    vendor: "MiniMax",
    name: "MiniMax M3",
    releaseDate: "2026-06-01",
    contextTokens: 1000000,
    params: "428B total / 23B active (MoE)",
    highlight:
      "Первая открытая модель, объединившая фронтир-кодинг, контекст 1M и нативную мультимодальность.",
    description:
      "MiniMax M3 — открытая модель (428B/23B active), позиционируемая как первая, совмещающая фронтир-уровень кодинга, контекст в 1 млн токенов и нативный мультимодальный ввод. Ключевая инновация — MiniMax Sparse Attention (MSA): более чем 9× ускорение prefill и 15× декодинга при 1M-контексте против M2. По заявлению вендора набирает 59.0% на SWE-Bench Pro. Цена — $0.30/$1.20 за млн токенов.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://www.minimax.io/blog/minimax-m3",
    wikiUrl: null,
    funFact:
      "Веса M3 выложили на Hugging Face уже через несколько дней после анонса, а технический отчёт по Sparse Attention появился на arXiv 11 июня 2026.",
  },
  {
    id: "anthropic-claude-fable-5",
    slug: "claude-fable-5",
    vendor: "Anthropic",
    name: "Claude Fable 5",
    releaseDate: "2026-06-09",
    contextTokens: null,
    params: null,
    highlight:
      "Начало поколения Claude 5: state-of-the-art почти на всех тестах и рекордная автономность.",
    description:
      "Claude Fable 5 — самая мощная модель Anthropic на момент выхода и старт поколения Claude 5: state-of-the-art почти на всех тестах возможностей — разработка, knowledge work, зрение, научные исследования. Может автономно работать над задачами на протяжении миллионов токенов подряд. Цена — $10/$50 за млн токенов.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "vision",
      "long-running-tasks",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-fable-5-mythos-5",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "Зрение Fable 5 настолько сильно, что модель восстанавливает исходный код веб-приложения по одним скриншотам интерфейса.",
  },
  {
    id: "anthropic-claude-sonnet-5",
    slug: "claude-sonnet-5",
    vendor: "Anthropic",
    name: "Claude Sonnet 5",
    releaseDate: "2026-06-30",
    contextTokens: null,
    params: null,
    highlight:
      "Самый агентный Sonnet: планирует, работает с браузером и терминалом, близок к Opus 4.8 дешевле.",
    description:
      "Claude Sonnet 5 — самый агентный Sonnet: планирует, пользуется браузером и терминалом, работает автономно. Существенный шаг вперёд относительно Sonnet 4.6 по рассуждению, использованию инструментов, кодингу и knowledge work; по ряду бенчмарков близок к Opus 4.8 при меньшей стоимости. Стандартная цена $3/$15, вводная — $2/$10 до 31 августа 2026.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "tool-use",
      "autonomous-agents",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-sonnet-5",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "На старте Sonnet 5 дали по вводной цене $2/$10 — заметно дешевле Opus 4.8 при близком качестве.",
  },
  {
    id: "sber-gigachat-3-5-ultra",
    slug: "gigachat-3-5-ultra",
    vendor: "Sber",
    name: "GigaChat 3.5 Ultra",
    releaseDate: "2026-07-06",
    contextTokens: null,
    params: "432B total / 28B active (MoE, гибридная архитектура)",
    highlight:
      "Открытый MoE-флагман Сбера: 432B параметров с гибридной архитектурой — новая веха российских LLM.",
    description:
      "GigaChat 3.5 Ultra — старшая модель линейки GigaChat 3 от Сбера: MoE на 432B параметров (28B активных) с гибридной архитектурой. Набирает 42.6% на SWE-bench Verified — заметный рост для российской LLM. Веса выложены открыто, что продолжает курс Сбера на открытость после GigaChat 3 Ultra Preview.",
    capabilities: ["russian", "open-weights", "MoE", "chat", "reasoning"],
    sourceUrl: "https://habr.com/ru/companies/sberbank/articles/1055826/",
    wikiUrl: "https://ru.wikipedia.org/wiki/GigaChat",
    funFact:
      "GigaChat 3.5 Ultra — одна из крупнейших открытых MoE-моделей российской разработки: 432B параметров против типичных для рынка десятков миллиардов.",
  },
  {
    id: "openai-gpt-5-6",
    slug: "gpt-5-6",
    vendor: "OpenAI",
    name: "GPT-5.6 (Sol)",
    releaseDate: "2026-07-09",
    contextTokens: 1050000,
    params: null,
    highlight:
      "Новейшее семейство OpenAI из трёх уровней (Sol/Terra/Luna): Sol Ultra — 91.9% на Terminal-Bench 2.1.",
    description:
      "GPT-5.6 — последнее семейство OpenAI, публично выпущенное 9 июля 2026 после ограниченного превью с 26 июня (по требованию правительства США). Три уровня: Sol (флагман), Terra (сбалансированный, ~вдвое дешевле GPT-5.5) и Luna (самый быстрый и дешёвый), плюс режим Sol Ultra. Контекст ~1.05M токенов, вывод до 128K. Цены: Sol $5/$30, Terra $2.50/$15, Luna $1/$6. Terminal-Bench 2.1 — 88.8% у базового Sol и 91.9% у Sol Ultra.",
    capabilities: [
      "reasoning",
      "coding",
      "agentic",
      "computer-use",
      "long-context",
    ],
    sourceUrl: "https://openai.com/index/previewing-gpt-5-6-sol/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.6",
    funFact:
      "OpenAI публично раскритиковала правительственный гейтинг в собственном анонсе: «Мы не считаем, что такой процесс доступа со стороны государства должен стать нормой по умолчанию».",
  },
];
