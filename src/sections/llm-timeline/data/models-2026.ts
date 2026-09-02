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
    sourceUrl: "https://openai.com/index/gpt-5-6/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.6",
    funFact:
      "OpenAI публично раскритиковала правительственный гейтинг в собственном анонсе: «Мы не считаем, что такой процесс доступа со стороны государства должен стать нормой по умолчанию».",
  },
  {
    id: "zhipu-glm-5-2",
    slug: "glm-5-2",
    vendor: "Zhipu AI",
    name: "GLM-5.2",
    releaseDate: "2026-06-13",
    contextTokens: 1000000,
    params: "744B total / ~40B active (MoE)",
    highlight:
      "Открытая MIT-модель вплотную к Claude Opus 4.8 на длинногоризонтном кодинге — при цене в 5–7 раз ниже.",
    description:
      "GLM-5.2 — флагман Z.ai и отдельный, более поздний релиз, чем GLM-5: sparse-MoE на 744B параметров (~40B активных) под MIT с реально используемым окном в 1 млн токенов и двумя уровнями reasoning-усилия (High/Max). По официальным замерам — 81.0 на Terminal-Bench 2.1 и 62.1 на SWE-bench Pro, в пределах 1% от Opus 4.8 на FrontierSWE. Цена — $1.4/$4.4 за млн токенов.",
    capabilities: ["open-weights", "MoE", "coding", "agentic", "long-context"],
    sourceUrl: "https://docs.z.ai/guides/llm/glm-5.2",
    wikiUrl: "https://en.wikipedia.org/wiki/GLM-4.5",
    funFact:
      "Анонс вышел на следующий день после того, как власти США ограничили иностранцам доступ к Claude Fable 5 — Z.ai подчёркивала, что скачанные MIT-веса «нельзя отключить» никаким госрегулятором.",
  },
  {
    id: "xai-grok-4-5",
    slug: "grok-4-5",
    vendor: "xAI",
    name: "Grok 4.5",
    releaseDate: "2026-07-08",
    contextTokens: null,
    params: null,
    highlight:
      "Модель класса Opus по коду и агентным задачам, но втрое дешевле и в разы токен-эффективнее (80 TPS).",
    description:
      "Grok 4.5 — сильнейшая модель xAI, выпущенная 8 июля 2026 и заточенная под кодинг, агентные задачи и работу со знаниями; обучена совместно с Cursor на GPU NVIDIA GB300. Цена $2/$6 за млн токенов, скорость 80 токенов/с, 64.7% на SWE-bench Pro и 83.3% на Terminal-Bench 2.1. Стала моделью по умолчанию в Grok Build, Cursor и плагинах MS Office; на старте недоступна в ЕС.",
    capabilities: ["coding", "agentic", "tool-use", "reasoning"],
    sourceUrl: "https://x.ai/news/grok-4-5",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "На SWE-bench Pro Grok 4.5 решает задачу в среднем за 15 954 выходных токена — примерно вчетверо экономнее, чем Opus 4.8 с его 67 020 токенами.",
  },
  {
    id: "meta-muse-spark-1-1",
    slug: "muse-spark-1-1",
    vendor: "Meta",
    name: "Muse Spark 1.1",
    releaseDate: "2026-07-09",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Разворот Meta от открытых Llama к закрытым весам: первая платная модель компании и её первый коммерческий API.",
    description:
      "Muse Spark 1.1 — проприетарная агентная мультимодальная reasoning-модель Meta Superintelligence Labs, выпущенная 9 июля 2026 вместе с новым платным Meta Model API (публичное превью, только США). Заточена под оркестрацию мульти-агентов, tool use и контекст в 1 млн токенов; API совместим с SDK OpenAI и Anthropic. По заявлению Meta — 61.5 на SWE-bench Pro и 88.1 на MCP Atlas.",
    capabilities: [
      "agentic",
      "coding",
      "multimodal",
      "tool-use",
      "long-context",
    ],
    sourceUrl:
      "https://ai.meta.com/blog/introducing-muse-spark-meta-model-api/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Llama",
    funFact:
      "Meta никогда раньше не брала денег за свои модели — Muse Spark 1.1 с ценником $1.25/$4.25 за млн токенов закрывает эпоху бесплатных открытых весов Llama.",
  },
  {
    id: "thinking-machines-inkling",
    slug: "inkling",
    vendor: "Thinking Machines Lab",
    name: "Inkling",
    releaseDate: "2026-07-15",
    contextTokens: 1000000,
    params: "975B total / 41B active (MoE)",
    highlight:
      "Первая модель лаборатории Миры Мурати — сразу с открытыми весами и мультимодальностью до видео.",
    description:
      "Thinking Machines Lab выпустила Inkling — первую модель в своём семействе и сразу с полными весами в открытом доступе, «чтобы люди могли сделать её своей». Разреженный MoE на 975B параметров (41B активных) принимает текст, картинки, звук и видео, держит контекст до 1 млн токенов и умеет управляемое «усилие мышления» ради экономии на простых задачах. Заявленные результаты: 97.1% на AIME 2026, 87.2% на GPQA Diamond, 77.6% на SWE-bench Verified, 46.0% на Humanity's Last Exam с инструментами и 73.5% на MMMU Pro. Лаборатория не претендует на первое место в бенчмарках, а позиционирует Inkling как удобную открытую базу для кастомизации: дообучение через собственный Tinker, инференс — у Together AI, Fireworks, Modal, Databricks и Baseten.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "multimodal",
      "agentic",
      "long-context",
    ],
    sourceUrl: "https://thinkingmachines.ai/news/introducing-inkling/",
    wikiUrl: null,
    funFact:
      "Бенчмарки на официальной странице сняты при effort=0.99 — у Inkling «усилие мышления» задаётся дробным числом, и витринные цифры получены почти на максимуме шкалы.",
  },
  {
    id: "moonshot-kimi-k3",
    slug: "kimi-k3",
    vendor: "Moonshot AI",
    name: "Kimi K3",
    releaseDate: "2026-07-16",
    contextTokens: 1000000,
    params: "2.8T total / 16 of 896 experts active (MoE)",
    highlight:
      "Первая открытая модель класса 3T: 2.8 триллиона параметров, миллион токенов контекста и первое место в Frontend Code Arena.",
    description:
      "Moonshot AI показала K3 на WAIC в Шанхае — «первую открытую модель 3T-класса». Разреженный MoE активирует 16 экспертов из 896, поверх двух собственных разработок: Kimi Delta Attention (гибридное линейное внимание) и Attention Residuals вместо обычных residual-связей; заявленный выигрыш по эффективности масштабирования — примерно 2.5x к Kimi K2. Контекст 1M токенов, нативное зрение, вход текстом, картинкой и видео. API стоит $3.00/$15.00 за млн токенов ($0.30 при попадании в кеш) и работает с 16 июля, а веса Moonshot обещала выложить на Hugging Face к 27 июля. В Frontend Code Arena K3 занял первое место с 1679 очками, обойдя Claude Fable 5 (1631) и GPT-5.6 Sol (1618).",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://www.kimi.com/blog/kimi-k3",
    wikiUrl: "https://en.wikipedia.org/wiki/Kimi_K2",
    funFact:
      "Независимый замер Artificial Analysis показал, что доля галлюцинаций у K3 выросла с 39% до примерно 51% — этой цифры в бенчмарк-графиках Moonshot нет.",
  },
  {
    id: "google-gemini-3-6-flash",
    slug: "gemini-3-6-flash",
    vendor: "Google",
    name: "Gemini 3.6 Flash",
    releaseDate: "2026-07-21",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Рабочая лошадка Google дешевеет и умнеет: тот же контекст 1M, но на 17% меньше выходных токенов и вдвое ниже цена вывода.",
    description:
      "Google выпустила 21 июля 2026 сразу тройку Gemini-моделей — 3.6 Flash, 3.5 Flash-Lite и security-версию 3.5 Flash Cyber (пилот только для госзаказчиков), — но флагманский 3.5 Pro снова отложила, зато объявила о старте пред-обучения Gemini 4. Основная 3.6 Flash сохраняет контекст 1M токенов и 64K вывода, поднимает knowledge cutoff до марта 2026, добавляет встроенный Computer Use и тратит на ту же агентную задачу на ~17% меньше выходных токенов. Цена — $1.50/$7.50 за млн токенов (вывод подешевел с $9.00 у 3.5 Flash). Более дешёвый Gemini 3.5 Flash-Lite стоит $0.30/$2.50 за млн и метит в высоконагруженные сценарии. Обе модели сразу доступны в Gemini API и AI Studio.",
    capabilities: [
      "multimodal",
      "agentic",
      "coding",
      "tool-use",
      "long-context",
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/",
    wikiUrl: "https://en.wikipedia.org/wiki/Gemini_(language_model)",
    funFact:
      "В том же анонсе Google не показала обещанный флагман 3.5 Pro, зато объявила о запуске самого масштабного в своей истории цикла пред-обучения — уже под Gemini 4.",
  },
  {
    id: "ant-group-ling-3-0-flash",
    slug: "ling-3-0-flash",
    vendor: "Ant Group",
    name: "Ling-3.0-flash",
    releaseDate: "2026-07-23",
    contextTokens: 262144,
    params: "124B total / 5.1B active (MoE)",
    highlight:
      "Веса открыты по MIT: 124B параметров против триллиона у прошлого флагмана лаборатории — и те же результаты на бенчмарках.",
    description:
      "Ant Group через свою открытую лабораторию inclusionAI выпустила Ling-3.0-flash сначала по API 23 июля, а 2 августа выложила веса на Hugging Face под лицензией MIT: родной BF16 весит около 255 ГБ, 4 августа рядом появились квантованные FP8, FP4 и INT4 (FP8 — около 128 ГБ), запускается через SGLang или vLLM. Разреженный MoE активирует 8 экспертов из 512 — 5.1B параметров из 124B на токен, это примерно 12% от размера прошлого флагмана лаборатории Ring-2.6-1T при сопоставимых результатах. Внимание гибридное с самого пред-обучения: 35 слоёв Kimi Delta Attention чередуются с 7 слоями Gated MLA в пропорции 5:1. Контекст — 262 144 токена, рекомендованный вывод — 32K. Заявленные цифры: 93.2 на AIME 2026, 87.0 на HMMT Feb 2026, 72.4 на SWE-Bench Multilingual и 56.6 на SWE-Bench Pro. Цель модели — не рекорды, а дешёвый агентный рантайм: программирование, поиск, глубокие исследования и вызов инструментов.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://huggingface.co/inclusionAI/Ling-3.0-flash",
    wikiUrl: null,
    funFact:
      "Квантование почти ничего не стоит по качеству: на четырёх официальных бенчмарках максимальный разрыв FP8 и BF16 — 1.57 балла, при этом файл весов худеет вдвое, с ~255 до ~128 ГБ.",
  },
  {
    id: "anthropic-claude-opus-5",
    slug: "claude-opus-5",
    vendor: "Anthropic",
    name: "Claude Opus 5",
    releaseDate: "2026-07-24",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Интеллект уровня Fable 5 за половину цены плюс «ручка усилия»: сам решаешь, сколько модель думает.",
    description:
      "Claude Opus 5 — четвёртая модель Anthropic меньше чем за два месяца (после Mythos 5, Fable 5 и Sonnet 5) и уже дефолтная на Claude Max. Подходит вплотную к фронтиру Fable 5 при цене $5/$25 против $10/$50 — прайс не изменился относительно Opus 4.8. Главное новое — параметр effort (low/medium/high): на низких уровнях модель сохраняет большую часть качества, тратя заметно меньше токенов; есть fast mode примерно вдвое быстрее за двойную цену. Контекст 1M токенов, вывод до 128K. По system card Anthropic — 96.0% на SWE-bench Verified и 43.3% на FrontierBench v0.1 против 21.1% у Opus 4.8 и 33.8% у Fable 5; на SWE-bench Pro 79.2% — чуть ниже Fable 5 с её 80.0%.",
    capabilities: [
      "adaptive-thinking",
      "agentic",
      "coding",
      "computer-use",
      "long-context",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-opus-5",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_(language_model)",
    funFact:
      "У Opus 5 knowledge cutoff — май 2026, тогда как у более дорогого Fable 5 и у Opus 4.8 он январский: младшая по цене модель знает мир на четыре месяца свежее.",
  },
  {
    id: "microsoft-mai-cyber-1-flash",
    slug: "mai-cyber-1-flash",
    vendor: "Microsoft",
    name: "MAI-Cyber-1-Flash",
    releaseDate: "2026-07-27",
    contextTokens: null,
    params: null,
    highlight:
      "Первая собственная кибербез-модель Microsoft — и первый её выход из лиги компактных Phi в лигу фронтира.",
    description:
      "27 июля 2026 Microsoft представила MAI-Cyber-1-Flash — свою первую модель, заточенную под кибербезопасность, вместе с агентной платформой Perception, которую в компании называют новым кибер-стеком безопасности. По словам главы Microsoft AI Мустафы Сулеймана, модель уходит в продакшн немедленно и на Cyber Gym — который он назвал «золотым бенчмарком» отрасли — обходит Gemini, GPT-5.5 Cyber, GPT-5.6 Sol и Mythos 5. Perception раскладывает работу на команды агентов: красные имитируют атаки, синие ищут баги, зелёные накатывают исправления; по оценке инженера Дейва Уэстона, это сокращает починку уязвимости с часов ручной работы до минут. Сама платформа выйдет в превью 3 ноября, а число параметров, окно контекста и цены Microsoft не раскрыла.",
    capabilities: ["security", "agentic", "tool-use"],
    sourceUrl:
      "https://blogs.microsoft.com/blog/2026/07/27/rethinking-security-for-the-age-of-ai/",
    wikiUrl: null,
    funFact:
      "Классический кибербез делится на красные и синие команды — Microsoft добавила третий цвет: зелёные агенты не ищут уязвимости, а сами пишут и накатывают фиксы.",
  },
  {
    id: "thinking-machines-inkling-small",
    slug: "inkling-small",
    vendor: "Thinking Machines Lab",
    name: "Inkling-Small",
    releaseDate: "2026-07-30",
    contextTokens: 1000000,
    params: "276B total / 12B active (MoE)",
    highlight:
      "Ученик обошёл учителя: вчетверо меньше флагмана, но выше него в рассуждениях и агентном коде.",
    description:
      "Через две недели после первой открытой модели Inkling лаборатория Миры Мурати выпустила её уменьшенную версию — 276B параметров против 975B, из них 12B активных. По собственному замеру лаборатории Inkling-Small «обходит Inkling на бенчмарках рассуждений и агентного кода»: 31.6% на Humanity's Last Exam (текст, без инструментов), 80.2% на SWE-bench Verified, 82.2% на IFBench, 40.0% по индексу Artificial Analysis v4.1. Разреженный MoE на 42 слоя маршрутизирует каждый токен в 6 из 256 экспертов плюс два общих, нативно рассуждает по тексту, картинкам и звуку, поддерживает регулируемое «усилие мышления» и контекст до 1 млн токенов. Полные веса выложены в публичный репозиторий Hugging Face, дообучение — через Tinker.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "multimodal",
      "coding",
      "agentic",
    ],
    sourceUrl: "https://thinkingmachines.ai/news/inkling-small/",
    wikiUrl: null,
    funFact:
      "Модель дообучали on-policy дистилляцией, где учителем был сам Inkling, — и ученик обошёл учителя в рассуждениях, но не в эрудиции: 20.6% на SimpleQA Verified, и лаборатория прямо признаёт, что «Inkling сохраняет преимущество в покрытии знаний и фактологии».",
  },
  {
    id: "deepseek-deepseek-v4-flash-0731",
    slug: "deepseek-v4-flash-0731",
    vendor: "DeepSeek",
    name: "DeepSeek-V4-Flash (0731)",
    releaseDate: "2026-07-31",
    contextTokens: 1000000,
    params: "284B total / 13B active (MoE)",
    highlight:
      "Та же модель, другое дообучение: без единого нового параметра Flash стал агентным исполнителем за $0.14 за млн токенов.",
    description:
      "DeepSeek вывела младшую модель четвёртого поколения из превью в публичную бету. Компания прямо подчёркивает, что архитектура и размер не изменились относительно апрельского DeepSeek-V4-Flash-Preview — переделан только этап пост-обучения. Заявленные результаты сборки 0731: 82.7 на Terminal Bench 2.1, 76.7 на Cybergym, 70.3 на Toolathlon verified, 68.7 на DSBench-FullStack, 54.4 на DeepSWE и 54.2 на NL2Repo. Эндпоинт `deepseek-v4-flash` теперь нативно понимает формат Responses API и адаптирован под Codex, имя модели и способ вызова не поменялись — интеграции подхватили новую сборку сами. Контекст остался 1 млн токенов при максимуме 384K на выход, цена — $0.14 за млн входных токенов при промахе кеша, $0.0028 при попадании и $0.28 за выходные. V4-Pro и модели в приложении и вебе обновление не затронуло.",
    capabilities: [
      "open-weights",
      "MoE",
      "agentic",
      "coding",
      "long-context",
      "reasoning",
    ],
    sourceUrl: "https://api-docs.deepseek.com/updates",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Весь прирост в агентных задачах DeepSeek получила без единого нового параметра — те же 284B/13B, переделан только пост-трейнинг. А в репозитории Hugging Face чекпоинт весит на 20B больше базовой модели: сверху прицеплен модуль спекулятивного декодирования DSpark, из-за которого карточка показывает 304B.",
  },
  {
    id: "alibaba-qwen3-8-max",
    slug: "qwen3-8-max",
    vendor: "Alibaba",
    name: "Qwen3.8-Max",
    releaseDate: "2026-08-03",
    contextTokens: 1000000,
    params: "2.4T total / 95B active (MoE)",
    highlight:
      "Самая большая модель Alibaba — 2.4 триллиона параметров — и первая в закрытой ветке Max, которой обещаны открытые веса.",
    description:
      "Alibaba выпустила Qwen3.8-Max — старшую модель семейства: разреженный MoE на 2.4T параметров (95B активных) поверх архитектуры Qwen3.5, вход текстом, картинками и видео, контекст 1 млн токенов (до 991K на вход, 131K на выход, до 262K на рассуждения) и три уровня «усилия» — low, medium, xhigh. API стоит $2.00/$6.00 за млн токенов ($0.25 при попадании в кеш) и совместим сразу с форматами OpenAI и Anthropic, так что переезд сводится к смене base URL и имени модели. По собственной таблице Alibaba: 92.6% на GPQA Diamond, 93.0 на PaperBench, 86.6 на Terminal-Bench 2.1, 86.1 на OSWorld-Verified, 82.8 на IFBench. Главный сдвиг — не бенчмарки, а лицензия: Max впервые обещан с открытыми весами на Hugging Face и ModelScope, вместе с младшим чекпоинтом Qwen3.8-27B для развёртывания на своём железе. В тот же день Alibaba открыла публичную бету QwenWork — платформы для рабочих сценариев поверх модели.",
    capabilities: [
      "MoE",
      "multimodal",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://qwen.ai/blog?id=qwen3.8",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Витрина автономности — репозиторий oh-my-cli, который модель вела сама 16 дней: 265 коммитов, 127 pull request'ов и 151 issue, от сбора запросов до тестов и мержа. При этом на SWE-bench Pro, где чинят баги в живом репозитории, у Qwen3.8-Max 67.7% против 80.0% у Claude Fable 5.",
  },
  {
    id: "meta-muse-spark-1-2",
    slug: "muse-spark-1-2",
    vendor: "Meta",
    name: "Muse Spark 1.2",
    releaseDate: "2026-08-05",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Meta наконец вышла в войну кодовых агентов: модель под код и первый собственный терминальный агент Muse Code, обученные вместе.",
    description:
      "Muse Spark 1.2 — третья модель Meta Superintelligence Labs за четыре месяца и первая, выпущенная в паре со своим агентом: терминальным Muse Code, который планирует правки, пишет код и сам проверяет результат в больших репозиториях. Модель и агент обучали совместно — веса дообучали на отобранных траекториях самого агента, с настройкой под цели, компактификацию контекста и субагентов; дополнительно работал цикл самоулучшения, где Muse Spark 1.1 генерировала сложные окружения и оценивала решения-кандидаты для 1.2. Контекст остался 1 млн токенов, цена стандартного тарифа не изменилась — $1.25/$4.25 за млн токенов ($0.15 при попадании в кеш). По собственным замерам Meta: 82.9% на Terminal-Bench 2.1 против 76.2% у версии 1.1 и 59.3% на DeepSWE v1.1 против 53.0%. Все эти прогоны Meta делала на своём стенде, где каждую конкурирующую модель запускали в её собственном агенте, и по этой же таблице 1.2 всё равно уступает Claude Opus 5 на максимальном усилии (86.7%). Независимый индекс Artificial Analysis даёт 54 балла — тринадцатое место и ровно столько же, сколько у Grok 4.5. Muse Code вышел в бете только для macOS и Linux и, в отличие от Claude Code и Codex, живёт исключительно в терминале, без настольного приложения.",
    capabilities: [
      "agentic",
      "coding",
      "multimodal",
      "tool-use",
      "long-context",
    ],
    sourceUrl:
      "https://research.meta.ai/blog/introducing-muse-code-and-muse-spark-1-2",
    wikiUrl: "https://ru.wikipedia.org/wiki/Llama",
    funFact:
      "У модели два ценника за одни и те же веса: обычный `muse-spark-1.2` за $1.25/$4.25 и `muse-spark-1.2-contributor` за $0.10/$0.20 — в 12 раз дешевле на входе и в 21 раз на выходе, если разрешить Meta учиться на вашем трафике. Правда, дешёвый тариф упирается в 60 запросов в минуту против трёх тысяч у обычного, так что расплачиваться данными имеет смысл только на экспериментах.",
  },
  {
    id: "ant-group-ling-3-0-tiny",
    slug: "ling-3-0-tiny",
    vendor: "Ant Group",
    name: "Ling-3.0-tiny",
    releaseDate: "2026-08-06",
    contextTokens: 262144,
    params: "7.9B total / 1.3B active (MoE)",
    highlight:
      "На токен работают всего 1.3B параметров из 7.9B — а контекст такой же, как у старшей модели лаборатории: 262 тысячи токенов.",
    description:
      "Через две недели после старшего Ling-3.0-flash лаборатория inclusionAI выпустила младшую модель линейки: разреженный MoE на 7.9B параметров, из которых на каждый токен работают только 1.3B. Режим рассуждений переключается прямо в запросе — Thinking для длинной цепочки размышлений и Instant для мгновенного ответа, так что один эндпоинт закрывает и то, и другое. Контекст — 262 144 токена, максимальный ответ — 32 768, есть родной вызов инструментов и кеширование промпта. Сценарии вендор показал бытовые: локальный запуск с поиском по собственным заметкам, быстрый перевод веб-страниц и управление браузером и телефоном через вызов инструментов. На старте модель доступна только по API — OpenRouter, Vercel AI Gateway и Novita, с бесплатным окном на первую неделю; весов на Hugging Face пока нет.",
    capabilities: [
      "MoE",
      "reasoning",
      "hybrid-thinking",
      "agentic",
      "tool-use",
      "long-context",
    ],
    sourceUrl: "https://openrouter.ai/inclusionai/ling-3.0-tiny",
    wikiUrl: null,
    funFact:
      "Старшая и младшая модели линейки различаются по общему размеру в шестнадцать раз — 124B против 7.9B, — но окно контекста у них одно и то же: 262 144 токена.",
  },
  {
    id: "mistral-leanstral-1-5",
    slug: "leanstral-1-5",
    vendor: "Mistral AI",
    name: "Leanstral 1.5",
    releaseDate: "2026-07-02",
    contextTokens: 262144,
    params: "119B total / 6B active (MoE, 128 экспертов, 4 активных)",
    highlight:
      "Открытая модель, которая закрыла miniF2F на 100% и нашла пять неизвестных багов в чужих репозиториях.",
    description:
      "Leanstral 1.5 — открытый агент Mistral для Lean 4, языка, на котором математические доказательства и свойства программ записывают так, что их проверяет компьютер, а не рецензент. Модель полностью закрыла miniF2F — 100% и на валидации, и на тесте, — решила 587 задач из 672 на PutnamBench и вышла в лидеры на FATE-H и FATE-X с результатами 87 и 34. Практическая часть интереснее бенчмарков: на 57 живых репозиториях модель отметила 47 нарушенных свойств, из них 11 оказались настоящими багами, а пять — никем раньше не описанными. Архитектура разреженная: из 119 миллиардов параметров на токен работают около шести, 128 экспертов при четырёх активных, окно 256 тысяч токенов, на вход принимает и текст, и картинки. Веса под Apache 2.0 лежат на Hugging Face, плюс есть бесплатная ручка в API Mistral.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "coding",
      "agentic",
      "long-context",
    ],
    sourceUrl: "https://mistral.ai/news/leanstral-1-5",
    wikiUrl: null,
    funFact:
      "Доказывая свойства AVL-дерева, модель проработала 2.7 миллиона токенов и 22 раза ужимала собственный контекст, не теряя нить рассуждения.",
  },
  {
    id: "sakana-ai-namazu",
    slug: "sakana-namazu",
    vendor: "Sakana AI",
    name: "Sakana Namazu",
    releaseDate: "2026-08-03",
    contextTokens: 262144,
    params: null,
    highlight:
      "Японский «суверенный» ответ на дорогие фронтир-модели: чужие открытые веса Kimi K2.6, дообученные под японский язык и деловые привычки страны.",
    description:
      "Sakana AI открыла API для Namazu — модели, которая до этого работала только внутри их собственного чат-сервиса Sakana Chat. Своей архитектуры у неё нет: за основу взята открытая модель Kimi K2.6 от Moonshot AI, поверх которой лаборатория дообучила японский язык, деловой контекст страны и отдельно отучила модель уходить от ответа на неудобные темы. Логика такая: фронтир-модели для японского бизнеса слишком дороги, а открытая модель «как есть» вызывает вопросы к качеству и к тому, куда уходят данные, — Namazu закрывает середину. API совместим с OpenAI (а также поддерживает форматы Responses и Anthropic Messages), так что переезд сводится к замене base_url на api.sakana.ai/v1 и имени модели на sakana-namazu. Внутри есть встроенные инструменты — веб-поиск и запуск кода, — а также приём картинок, файлов (PDF, XLSX, CSV, DOCX) и режим долгих рассуждений. По замерам самой Sakana AI модель сохраняет уровень базовой Kimi K2.6 на AIME26, MMLU-Pro и LiveCodeBench v6, а на японских проверках обгоняет её: на JFBench (тест на следование инструкциям от Preferred Networks), на внутреннем японско-английском переводе и на FairPoliticsQA, где нейтральность ответов выросла с 34,10% до 56,30%.",
    capabilities: [
      "reasoning",
      "agentic",
      "tool-use",
      "multimodal",
      "long-context",
    ],
    sourceUrl: "https://sakana.ai/namazu-api/",
    wikiUrl: "https://en.wikipedia.org/wiki/Sakana_AI",
    funFact:
      "Витриной агентных способностей Sakana AI сделала не бенчмарк, а аквариум: модели дают одну тему — «мир моря», — дальше она сама решает, какую фигуру показать, ищет референсы в вебе и рассчитывает, как должны двигаться около тысячи рыб, чтобы сложиться в эту фигуру. На каждом шаге модель получает скриншот аквариума картинкой и по нему правит команды.",
  },
  {
    id: "mistral-shieldstral-1-0-3b",
    slug: "shieldstral-1-0-3b",
    vendor: "Mistral AI",
    name: "Shieldstral 1.0 3B",
    releaseDate: "2026-08-04",
    contextTokens: 32768,
    params: "3B",
    highlight:
      "Модерация без переобучения: правило пишется обычными словами прямо в запросе, а ответ — один токен «yes» или «no».",
    description:
      "Shieldstral — первая открытая модель-фильтр Mistral: она не сама отвечает пользователю, а проверяет чужие тексты и картинки на соответствие правилам. Обычные фильтры обучают под фиксированный список запрещённых тем, и новую тему туда без переобучения не добавить; здесь правило пишется свободным текстом прямо в запросе — «продвигает ли этот текст насилие?» — и модель отвечает на него за один проход. Собрана на базе Ministral-3-3B-Base-2512 с довеском зрительной части от Pixtral, поэтому одинаково проверяет текст, картинку и текст с картинкой вместе; понимает 12 языков, включая русский. По замерам Mistral она держится вровень с открытыми фильтрами до семи раз крупнее себя, где-то выигрывая, где-то отставая на доли балла: 84.1 против 79.8 у GPT-OSS-Safeguard-20B на ToxicChat, но 81.4 против 84.0 на OpenAI Moderation. Явный отрыв — на картинках: 97.7 против 88.5 у ближайшего соперника на VLGuard и 81.8 против 72.6 на UnsafeBench. Веса под Apache 2.0, три миллиарда параметров помещаются на одну видеокарту.",
    capabilities: ["open-weights", "security", "multimodal", "on-device"],
    sourceUrl: "https://mistral.ai/news/shieldstral",
    wikiUrl: null,
    funFact:
      "Весь вердикт модели — одно слово. Она отвечает только «yes» или «no», и оценкой безопасности служит вероятность этого единственного токена: строгость настраивается порогом, в замерах Mistral он равен 0.5.",
  },
  {
    id: "liquid-ai-lfm-2-5-2-6b",
    slug: "lfm-2-5-2-6b",
    vendor: "Liquid AI",
    name: "LFM2.5-2.6B",
    releaseDate: "2026-08-04",
    contextTokens: 131072,
    params: "2.69B",
    highlight:
      "Агент целиком на телефоне: 2.6 миллиарда параметров, меньше 2.5 ГБ памяти и 30 токенов в секунду без всякого сервера.",
    description:
      "Liquid AI выпустила LFM2.5-2.6B — модель, которая планирует, вызывает инструменты и доводит многошаговые задачи до конца прямо на устройстве: телефоне, ноутбуке, ПК или роботе. Данные при этом никуда не уходят, а стоимость каждого запуска фактически нулевая. Архитектура нестандартная: 30 слоёв, из них 22 блока свёрток с двойным гейтингом и только 8 блоков обычного внимания — за счёт этого модель быстро работает на процессоре, а не на видеокарте. Претрейн — около 34 триллионов токенов, словарь расширили вдвое, до 128 тысяч, дописав существующий токенизатор вместо обучения нового. Контекст — 131 072 токена. Заявленная скорость: 220 токенов в секунду на Apple M5 Max, 113 на Ryzen AI Max+ 395 и 30 на телефоне при расходе меньше 2.5 ГБ памяти. Веса открыты под собственной лицензией lfm1.0, в день выхода заработали llama.cpp, MLX, vLLM, SGLang и ONNX. Liquid честно предупреждает, что для агентного программирования и задач, где нужны обширные знания, модель брать не стоит — там выигрывают модели побольше.",
    capabilities: [
      "open-weights",
      "on-device",
      "agentic",
      "tool-use",
      "long-context",
    ],
    sourceUrl: "https://www.liquid.ai/blog/lfm2-5-2-6b",
    wikiUrl: null,
    funFact:
      "Часть дообучения шла не на статичном датасете, а внутри живых агентных обвязок: прокси-слой перехватывал реальные траектории работы агента, не требуя переписывать сам фреймворк.",
  },
  {
    id: "openai-gpt-5-6-august",
    slug: "gpt-5-6-august",
    vendor: "OpenAI",
    name: "GPT-5.6 Sol (август)",
    releaseDate: "2026-08-06",
    contextTokens: 1050000,
    params: null,
    highlight:
      "Одно имя модели — две разные версии: в чате ChatGPT с 6 августа работают новые веса, а в Codex и ChatGPT Work остались июльские.",
    description:
      "Через месяц после выхода семейства OpenAI переобучила две модели линейки и выложила на них отдельную системную карту, где сама разделяет версии по месяцу релиза: августовская живёт только в чате ChatGPT, июльская осталась в Codex и ChatGPT Work. Обновление не про мощность, а про надёжность: оценки способностей к самоулучшению OpenAI даже не гоняла, объяснив, что интеллект августовской Sol близок к июльской. Зато выросла фактическая точность — доля ответов с хотя бы одной фактической ошибкой у Sol упала примерно на 60% против GPT-5.5 Instant сразу на трёх наборах сложных промптов, у Luna — более чем на 60% на высокорисковых медицинских, юридических и финансовых вопросах и примерно на 30% на остальных. На HealthBench Professional Sol прибавила 15.6 балла (54.0 против 38.4), на HealthBench Hard — 8.5 (31.4 против 22.9), и при этом стала отвечать короче. Обе августовские версии заменяют в чате GPT-5.5 Instant, а Plus и Pro получили слайдер, которым уровень усилия выбирается вручную вместо переключения между разными моделями. По шкале готовности OpenAI обе модели проходят как High в кибербезопасности и в биологии с химией, но ниже порога Critical — ровно как их июльские предшественницы.",
    capabilities: [
      "reasoning",
      "adaptive-thinking",
      "honesty",
      "chat",
      "long-context",
    ],
    sourceUrl: "https://openai.com/index/improving-gpt-5-6-sol-in-chatgpt/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.6",
    funFact:
      "Впервые в системной карте OpenAI появился отдельный раздел проверок для подростков: модель отдельно оценивают по правилам для пользователей младше 18 лет — по возрастным ограничениям товаров и услуг и по темам, где подростку может понадобиться помощь.",
  },
  {
    id: "meta-muse-glimmer-30b",
    slug: "muse-glimmer-30b",
    vendor: "Meta",
    name: "Muse Glimmer 30B",
    releaseDate: "2026-08-10",
    contextTokens: 131072,
    params: "29.8B (dense, включая vision-энкодер)",
    highlight:
      "Первая открытая модель Meta под локального агента: 30 миллиардов параметров, Apache 2.0 и запуск на одной домашней видеокарте с 24 ГБ памяти.",
    description:
      "Meta Superintelligence Labs выложила веса Muse Glimmer под Apache 2.0 — это дистиллят большой Muse Spark, собранный не ради рекордов на бенчмарках, а ради того, чтобы агент работал на пользовательском ноутбуке постоянно и без интернета. Плотный трансформер на 29.8 миллиарда параметров вместе со зрительным энкодером: на вход текст и картинки, на выход только текст, звука нет, видео разбирается по отдельным кадрам. Контекст — 131 072 токена, и держится он за счёт того, что 39 слоёв из 52 смотрят лишь на скользящее окно в 2048 токенов, а по всей длине работают только 13. В полной точности модель просит больше 55 ГБ видеопамяти, но в четырёхбитной сборке K-Quant-17GB укладывается в 24 ГБ, теряя, по замерам Meta, около 1% качества. По собственным цифрам вендора: 76.0% на SWE-Bench Verified, 51.2% на SWE-Bench Pro, 94.7% на AIME 2026, 83.5% на GPQA Diamond и 75.5 на агентном MCP Atlas против 54.2 у Gemma4-31B и 62.5 у Qwen3.6-27B; на computer-use задачах OSWorld-Verified Qwen остаётся впереди. В день выхода модель поддержали llama.cpp, vLLM, Ollama, LM Studio, MLX и ExecuTorch. Тогда же Марк Цукерберг пообещал открыть веса и у старшей Muse Spark 1.2 — той самой, из которой Glimmer дистиллировали.",
    capabilities: [
      "agentic",
      "open-weights",
      "on-device",
      "multimodal",
      "tool-use",
      "long-context",
    ],
    sourceUrl:
      "https://research.meta.ai/blog/introducing-muse-glimmer-open-agentic-model",
    wikiUrl: "https://ru.wikipedia.org/wiki/Llama",
    funFact:
      "Вместе с моделью идёт маленький «черновик» DFlash: он угадывает сразу 16 токенов за один проход, а основная модель их параллельно проверяет и оставляет только верные. На RTX 5090 это поднимает скорость с 74.9 до 233.4 токенов в секунду — в 3.1 раза, без потери качества ответа.",
  },
  {
    id: "upstage-solar-pro-4",
    slug: "solar-pro-4",
    vendor: "Upstage",
    name: "Solar Pro 4",
    releaseDate: "2026-08-10",
    contextTokens: 524288,
    params: null,
    highlight:
      "Корейская Upstage целит не в баллы, а в законченную работу: модель обучали на офисных задачах, где оценка ставится только за готовый документ.",
    description:
      "Solar Pro 4 — агентная модель корейской Upstage под многошаговую офисную работу: разобрать пачку документов, вызвать инструменты, поработать в терминале и довести дело до готового файла. Контекст — 512 тысяч токенов, ответ до 128 тысяч, вход и выход на английском, корейском и японском; «глубину раздумий» можно переключать — high для разбора, low для чата в реальном времени. Весов нет, модель только по API: для своего железа у Upstage есть отдельная открытая Solar Open 2. Главное отличие от предшественницы — не размер, а то, на чём учили: конвейер OfficeVerse собирает офисные задачи из открытых данных по 11 отраслям и 12 типам работ и ставит зачёт или незачёт по итоговому документу, а не по промежуточным шагам. Оттуда же выросла Ko-GDPval — корейский бенчмарк офисной работы. Опубликованные вендором цифры — Terminal-Bench v2.1 57, τ³-Banking 23 и AA-LCR 71 — посчитаны по методике Artificial Analysis, и сам Upstage помечает, что публичной карточки этого замера пока нет. Отдельно Upstage прямо заявляет как фичу поведение «сказать, что проверить не получилось», вместо того чтобы придумать ответ.",
    capabilities: [
      "agentic",
      "tool-use",
      "reasoning",
      "long-context",
      "multilingual",
    ],
    sourceUrl: "https://www.upstage.ai/blog/en/solar-pro-4",
    wikiUrl: "https://en.wikipedia.org/wiki/Upstage_(company)",
    funFact:
      "Вместо бенчмарка Upstage показала одно задание целиком: вымышленной сети кофеен Solarbean нужно выбрать место под новую точку. На входе — документ с правилами открытия и шесть файлов с данными рынка, на выходе за три запроса подряд — таблица Excel с десятью площадками и пометками «прошла / не прошла», отчёт по ней и презентация, причём число, посчитанное в таблице, доезжает до слайдов без пересчёта вручную.",
  },
  {
    id: "nvidia-nemotron-3-5-lightning",
    slug: "nemotron-3-5-lightning",
    vendor: "NVIDIA",
    name: "Nemotron 3.5 Lightning",
    releaseDate: "2026-08-11",
    contextTokens: 1000000,
    params: "30B total / 3B active (MoE)",
    highlight:
      "Открытые веса под разрешительной лицензией и миллион токенов контекста на одной видеокарте — NVIDIA делает не самую умную модель, а самую быструю рабочую лошадь для агентов.",
    description:
      "Nemotron 3.5 Lightning — первая модель новой линейки NVIDIA и наследница Nemotron 3 Nano 30B. Архитектура гибридная: слои Mamba-2 чередуются с MoE-слоями, между ними вставлены отдельные слои внимания; всего 30 миллиардов параметров, но на каждый токен работают только 3 миллиарда. Предобучение — больше 20 триллионов токенов, контекст заявлен до 1 миллиона токенов, хотя для разворачивания на одной H100 сама NVIDIA рекомендует 256 тысяч. Веса выложены на Hugging Face в двух форматах, NVFP4 и BF16, под разрешительной лицензией OpenMDW 1.1, коммерческое использование разрешено. Замысел не в том, чтобы обогнать фронтир: NVIDIA строит «систему из моделей», где тяжёлая Nemotron 3 Ultra планирует, а Lightning быстро и дёшево выполняет поток мелких шагов — для этого вместе с моделью открыли библиотеку маршрутизации NeMo Switchyard. Заявленный выигрыш — до четырёх раз выше скорость выдачи против моделей своего размера и на 30% быстрее прохождение агентных задач. Собственные замеры NVIDIA: MMLU Pro 81,94, GPQA Diamond 75,44, SWE-bench Verified 51,56, Terminal-Bench 2.1 24,58, AA-LCR 52,00. Модель текстовая, языки — английский, испанский, французский, немецкий, итальянский, японский и языки программирования; в день выхода её поддержали vLLM, Ollama, llama.cpp и LM Studio.",
    capabilities: [
      "MoE",
      "open-weights",
      "agentic",
      "tool-use",
      "reasoning",
      "long-context",
    ],
    sourceUrl:
      "https://developer.nvidia.com/blog/nvidia-nemotron-3-5-lightning-delivers-fast-accurate-specialized-task-execution-for-long-running-agents/",
    wikiUrl: null,
    funFact:
      "Заявленный миллион токенов контекста на платном тарифе OpenRouter не получить: там у модели стоит 262 144. Полный миллион отдаёт только бесплатный эндпоинт `nvidia/nemotron-3.5-lightning:free` — то есть самое длинное окно у этой модели там, где за неё не платят.",
  },
  {
    id: "alibaba-qwen3-8-2-4t-a95b",
    slug: "qwen3-8-2-4t-a95b",
    vendor: "Alibaba",
    name: "Qwen3.8-2.4T-A95B",
    releaseDate: "2026-08-12",
    contextTokens: 262144,
    params: "2.4T total / 95B active (MoE)",
    highlight:
      "Обещание из августовского анонса выполнено: веса Max-модели на 2.4 триллиона параметров выложены открыто — впервые в истории Qwen.",
    description:
      "Через девять дней после анонса Qwen3.8-Max Alibaba выложила на Hugging Face сами веса — 213 файлов safetensors, плюс отдельный вариант в FP8. Это первый случай, когда Qwen открывает модель класса Max. Устройство: разреженный MoE на 2.4T параметров, из которых на токен работают 95B; 92 слоя, 512 экспертов, на каждый токен включаются 10 маршрутизируемых и 1 общий. Контекст у открытых весов — 262 144 токена с растяжением до 1 010 000, тогда как у платного Qwen3.8-Max миллион идёт по умолчанию. Режим рассуждений отключить нельзя: каждый ответ начинается с блока `<think>`, а глубину регулирует параметр `reasoning_effort` с уровнями low, medium и xhigh (по умолчанию xhigh). Открытая версия — только текст: картинок, видео и встроенных инструментов, как у платного Max, здесь нет. Лицензия своя, не Apache 2.0: использовать, дообучать и продавать можно, но при 100 миллионах активных пользователей в месяц или 20 миллионах долларов выручки придётся указывать имя модели в интерфейсе, а сервисам, которые перепродают инференс или делают ИИ-ассистента для работы, при выручке свыше 50 миллионов долларов за год — договариваться с Qwen отдельно.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://huggingface.co/Qwen/Qwen3.8-2.4T-A95B",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Обещанный вместе с флагманом младший Qwen3.8-27B, который и должен был стать «моделью для своего железа», на Hugging Face в день выкладки весов так и не появился — репозиторий отдаёт 404, тогда как у 2.4T уже больше тысячи скачиваний.",
  },
  {
    id: "deepseek-deepseek-v4-pro-0813",
    slug: "deepseek-v4-pro-0813",
    vendor: "DeepSeek",
    name: "DeepSeek-V4-Pro (0813)",
    releaseDate: "2026-08-12",
    contextTokens: 1000000,
    params: "1.6T total / 49B active (MoE)",
    highlight:
      "Старшая модель четвёртого поколения вышла из превью — спустя три с половиной месяца после апрельского анонса.",
    description:
      "DeepSeek обновила эндпоинт `deepseek-v4-pro` до сборки DeepSeek-V4-Pro-0813, выведя старшую модель четвёртого поколения из превью, в котором она провисела с 24 апреля. Способ вызова не изменился — имя модели то же, интеграции подхватывают новую сборку сами; ровно так же две недели назад обновили младший Flash до сборки 0731. Контекст остался 1 млн токенов при максимуме 384K на выход, работают вызов инструментов, JSON-вывод, кеширование контекста и форматы Responses API и Anthropic API. Официальная цена — $0.435 за млн входных токенов при промахе кеша, $0.003625 при попадании и $0.87 за выходные, лимит — 500 одновременных запросов против 2500 у Flash. Собственных заметок о релизе с бенчмарками DeepSeek на момент выкладки не опубликовала: в официальном журнале изменений последняя запись по-прежнему от 31 июля, а факт обновления виден только в документации API и на странице цен. Веса сборки 0813 тоже не выложены — репозиторий на Hugging Face с апрельского превью не обновлялся с 22 июня.",
    capabilities: [
      "MoE",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
      "tool-use",
    ],
    sourceUrl: "https://api-docs.deepseek.com/quick_start/pricing",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "На той же странице, где DeepSeek объявила новую сборку, стоит предупреждение: цены на API планируют поднять «в ближайшее время» и «значительно», а конкретный тариф объявят позже. Компания, которая полтора года сбивала цены рынку, впервые просит планировать расходы с запасом.",
  },
  {
    id: "xai-grok-4-6",
    slug: "grok-4-6",
    vendor: "xAI",
    name: "Grok 4.6",
    releaseDate: "2026-08-12",
    contextTokens: 500000,
    params: null,
    highlight:
      "Сравнялась с GPT-5.6 Sol по сводному индексу Artificial Analysis — 61 балл против 56 у Grok 4.5 месяцем раньше.",
    description:
      "Grok 4.6 — надстройка над Grok 4.5 с упором на долго живущих агентов и на работу, где важен визуальный результат: модель держит задачу на много шагов подряд, будь то исследование темы, разбор данных, правки по всей кодовой базе или превращение идеи в готовое приложение. Новых параметров не добавляли — компания удлинила дополнительный тренировочный прогон, подмешала отобранные данные по рассуждениям и инженерии, сменила оптимизатор, а затем переиспользовала саму Grok 4.5, чтобы заново сгенерировать обучающие траектории и отсеять проблемные модельными проверками. По собственной таблице: 61 балл сводного индекса Artificial Analysis (у Grok 4.5 было 56), 69.9% на CursorBench 3.2, 65.9% на DeepSWE 1.1, 61.3% на FrontierCode 1.1 и 26% на Terminal-Bench 3.0. Контекст — 500 тысяч токенов, цена $2 за млн входных и $6 за млн выходных, но после 200 тысяч токенов в запросе тариф удваивается, а «быстрый» вариант стоит вдвое дороже обычного. В день выхода модель доступна в Cursor, Grok Build, собственном API, а также через OpenRouter, Vercel и Cloudflare; первую неделю в Cursor и Grok Build дают двойную квоту.",
    capabilities: [
      "agentic",
      "coding",
      "reasoning",
      "tool-use",
      "multimodal",
      "long-context",
    ],
    sourceUrl: "https://x.ai/news/grok-4-6",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "В собственной таблице компании Grok 4.6 не только выигрывает у предшественницы, но и заметно проигрывает конкурентам там, где раньше Grok был силён: на Terminal-Bench 3.0 у неё 26% против 34.6% у GPT-5.6 Sol. Зато на юридическом Harvey LAB разрыв обратный и огромный — 15.8% против 2.5% у той же GPT-5.6 Sol.",
  },
  {
    id: "upstage-solar-open-2-250b",
    slug: "solar-open-2-250b",
    vendor: "Upstage",
    name: "Solar Open 2 250B",
    releaseDate: "2026-07-22",
    contextTokens: 1048576,
    params: "250B total / 15B active (MoE)",
    highlight:
      "Корея выложила свою первую по-настоящему большую открытую модель — и получила миллион токенов контекста тем, что вообще убрала позиционное кодирование.",
    description:
      "Solar Open 2 — открытая модель корейской Upstage, сделанная в рамках государственной программы суверенного ИИ: страна строит собственные базовые модели, и по условиям программы ни одна команда не имеет права брать готовые чужие веса. Устройство: MoE на 250 миллиардов параметров, из которых на токен работают только 15 миллиардов. Внимание гибридное — три слоя линейного внимания на один обычный; поскольку линейные слои запоминают порядок токенов в своём внутреннем состоянии, позиционное кодирование убрали целиком (подход NoPE). Именно это снимает обычное ограничение на растяжение контекста и даёт заявленный миллион токенов. Обучение вышло дешёвым: модель не учили с нуля, а перенесли в неё те 2,3% весов предыдущей Solar Open 1, которые пережили смену архитектуры, затем обучили двенадцать узких специалистов под разные агентные сценарии и слили их в одну модель. Собственные цифры Upstage: Ko-GDPval 86,8 против 86,9 у DeepSeek-V4-Pro на 1,6 триллиона параметров, MMLU-Pro 86,2, LiveCodeBench v6 92,4. Лицензия своя, Upstage Solar License — производная Apache 2.0, коммерческое использование и производные модели разрешены. Это открытая половина линейки: платная агентная Solar Pro 4 вышла позже, в августе, и весов у неё нет.",
    capabilities: [
      "open-weights",
      "MoE",
      "agentic",
      "long-context",
      "tool-use",
      "multilingual",
    ],
    sourceUrl: "https://www.upstage.ai/blog/en/solar-open-2",
    wikiUrl: "https://en.wikipedia.org/wiki/Upstage_(company)",
    funFact:
      "Модель обогнала по агентным замерам всех в своём классе, но запустить её сразу было почти негде: в карточке на Hugging Face команда запуска ссылалась на разборщики vLLM, которых не было ни в одной выпущенной версии, а поддержку архитектуры влили в основную ветку только 5 августа — через две недели после выкладки весов.",
  },
  {
    id: "sk-telecom-a-x-k2",
    slug: "a-x-k2",
    vendor: "SK Telecom",
    name: "A.X K2",
    releaseDate: "2026-07-29",
    contextTokens: 262144,
    params: "688B total / 33B active (MoE)",
    highlight:
      "Самая большая корейская модель на момент выхода — и одна из первых больших моделей, которую целиком обучили в формате FP8, включая обратный проход.",
    description:
      "A.X K2 — вклад SK Telecom в корейскую программу суверенного ИИ: MoE на 688 миллиардов параметров, из которых на токен работают 33 миллиарда, 61 слой, 256 маршрутизируемых экспертов плюс один общий, из них 8 активны на токен. Главная инженерная особенность — обучение целиком в FP8: обычно в этом «коротком» формате чисел считают только прямой проход, а обратный оставляют в более точном, здесь же в FP8 идут оба, и только эталонная копия весов хранится в FP32. Так экономят память и время на тех же видеокартах. Объём обучения — примерно 8,2 триллиона токенов в три этапа; состав данных раскрыт: 72,7% английский, 15,4% корейский, 8,3% код, по проценту японский, испанский и китайский. Контекст — 262 144 токена: 128 тысяч выучены напрямую, дальше растянуты методом YaRN. Лицензия Apache 2.0, то есть без оговорок про выручку и число пользователей. Собственные цифры компании в режиме рассуждений: AIME 2026 — 97,1%, GPQA Diamond — 85,6%, LiveCodeBench — 84,0%, корейский KMMLU-Pro — 80,5%.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "math",
      "coding",
      "multilingual",
    ],
    sourceUrl: "https://huggingface.co/skt/A.X-K2",
    wikiUrl: "https://en.wikipedia.org/wiki/SK_Telecom",
    funFact:
      "Модель телеком-оператора вышла на золотой уровень Международной математической олимпиады 2026 года и поделила первое место в таблице MathArena по AIME 2026 — с моделью Inkling от Thinking Machines, лаборатории, которую основала бывший технический директор OpenAI.",
  },
  {
    id: "lg-k-exaone-2-0",
    slug: "k-exaone-2-0",
    vendor: "LG AI Research",
    name: "K-EXAONE 2.0",
    releaseDate: "2026-07-31",
    contextTokens: 262144,
    params: "750B total / 37B active (MoE)",
    highlight:
      "750 миллиардов параметров под Apache 2.0 — крупнейшая открытая модель Кореи, втрое больше предыдущей и лидер первого этапа государственного отбора.",
    description:
      "K-EXAONE 2.0 — модель исследовательского подразделения LG, вторая выложенная в рамках корейской программы суверенного ИИ. Разреженный MoE: 750 миллиардов параметров всего, 37 миллиардов работают на токен, 256 экспертов, из них 8 активных плюс один общий. Против модели первого этапа на 236 миллиардов это рост больше чем втрое. Контекст — 262 144 токена, лицензия Apache 2.0 без ограничений на коммерческое использование. Языков десять: корейский, английский, испанский, немецкий, японский, вьетнамский, французский, итальянский, польский и португальский; знания обрезаны вторым кварталом 2025 года. Из фич — встроенный режим рассуждений с возможностью сохранять ход мысли между ходами диалога, вызов инструментов и ускорение выдачи в 3–5 раз за счёт спекулятивного декодирования. Собственные цифры LG: среднее 70,1 по 24 замерам против 63,3 у модели первого этапа, MMLU-Pro 83,5, AIME 2026 92,3, SWE-Bench Verified 68,2, длинный контекст OpenAI-MRCR 94,4. На первом этапе государственной оценки модель забрала все три категории с результатом 90,2 из 100.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "agentic",
      "long-context",
      "multilingual",
    ],
    sourceUrl: "https://huggingface.co/LGAI-EXAONE/K-EXAONE-2.0-750B-A37B",
    wikiUrl: null,
    funFact:
      "Победителя корейской программы выбирают не только эксперты: 200 граждан, отобранных лотереей, с августа сравнивают все четыре модели вживую. Две команды-финалистки к декабрю 2026 года получат право обслуживать не меньше половины запросов бесплатного государственного ИИ-помощника для 51 миллиона жителей страны.",
  },
  {
    id: "motif-technologies-motif-3",
    slug: "motif-3",
    vendor: "Motif Technologies",
    name: "Motif 3",
    releaseDate: "2026-08-09",
    contextTokens: 262144,
    params: "314B total / 13.2B active (MoE)",
    highlight:
      "Команда примерно из тридцати человек выложила модель под лицензией MIT — самой разрешительной из всей корейской четвёрки.",
    description:
      "Motif 3 — финальная версия модели Motif Technologies, тридцатичеловечной дочерней компании корейской Moreh, четвёртого участника программы суверенного ИИ. MoE на 314 миллиардов параметров, на токен работают 13,2 миллиарда: 384 маршрутизируемых эксперта, из них 8 активных плюс один общий. Обучение — около 12,5 триллиона токенов: веб, точные науки, код, математика, многоязычные данные, корейский, юридические и финансовые тексты. Контекст — 262 144 токена. Главное отличие от июльской беты — лицензия: вместо запрета на коммерческое использование финальную версию выложили под MIT, то есть можно всё, включая продажу и дообучение. Из своего в архитектуре компания называет два механизма: GDLA — внимание со сжатым представлением ключей и значений, и отдельная функция активации для каждого эксперта; плюс голова предсказания нескольких токенов сразу, чтобы модель ускоряла саму себя при выдаче. Собственные цифры: SWE-Bench Verified 76,2, GPQA Diamond 83,4, Terminal-Bench 2.1 74,9 — сильнее всего модель выглядит на агентных задачах и работе с инструментами.",
    capabilities: [
      "open-weights",
      "MoE",
      "agentic",
      "tool-use",
      "coding",
      "multilingual",
    ],
    sourceUrl: "https://huggingface.co/Motif-Technologies/Motif-3",
    wikiUrl: null,
    funFact:
      "Из четырёх корейских команд у Motif самая маленькая модель и самая маленькая команда, но по сводному индексу Artificial Analysis она встала выше двух соседей по программе — на 34-е место из 577 отслеживаемых моделей мира, то есть в верхние 7%.",
  },
  {
    id: "google-gemini-3-7-flash",
    slug: "gemini-3-7-flash",
    vendor: "Google",
    name: "Gemini 3.7 Flash",
    releaseDate: "2026-08-13",
    contextTokens: 1048576,
    params: null,
    highlight:
      "Через три недели после предыдущей Flash — и вдвое дешевле её, но только до конца года: с 1 января цена возвращается к прежней.",
    description:
      "Gemini 3.7 Flash — рабочая лошадь Google под код и агентов, вышедшая всего через три недели после Gemini 3.6 Flash. Новой базовой модели нет: компания прямо называет это доработкой архитектуры 3.6 по обратной связи разработчиков. Прирост Google показывает на задачах программирования: DeepSWE v1.1 — 65,3% против 49,0% у предшественницы, FrontierCode 1.1 — 43,6% против 34,4%, разбор документов GDP.pdf — 34,0% против 22,0%, автоматизация AutomationBench — 30,4% против 17,0%, веб-разработка на WebDev Arena — 1588 очков против 1538. Вход мультимодальный: текст, картинки, звук и видео, контекст миллион токенов, ответ до 64 тысяч — как у 3.6. Цена введена как вводная и действует до 31 декабря 2026 года: 0,75 доллара за миллион входных токенов и 3,75 за миллион выходных, вдвое дешевле прежней; с 1 января 2027-го тариф становится 1,50 и 7,50. Доступ в день выхода — AI Studio, Android Studio, агентная платформа Antigravity, корпоративная Gemini Enterprise, а для подписчиков Pro и Ultra — режим Spark в приложении Gemini; днём позже модель включили в режим ИИ-ответов в поиске.",
    capabilities: [
      "multimodal",
      "coding",
      "agentic",
      "reasoning",
      "long-context",
      "tool-use",
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/models-and-research/gemini-models/introducing-gemini-3-7-flash/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Google_Gemini",
    funFact:
      "Google выпускает уже вторую Flash за месяц, а обещанной Gemini 3.5 Pro всё ещё нет: в июле компания говорила, что старшая модель тестируется с партнёрами и выйдет «скоро». Быстрая и дешёвая линейка обновляется, а флагманская стоит.",
  },
  {
    id: "alibaba-qwen3-8-27b",
    slug: "qwen3-8-27b",
    vendor: "Alibaba",
    name: "Qwen3.8-27B",
    releaseDate: "2026-08-14",
    contextTokens: 262144,
    params: "27B (dense)",
    highlight:
      "Та самая модель для своей видеокарты, которую ждали две недели: плотные 27 миллиардов параметров, зрение из коробки и Apache 2.0.",
    description:
      "Qwen3.8-27B — младшая половина поколения 3.8 и, в отличие от флагмана на 2,4 триллиона параметров, модель, которую реально запустить на потребительской видеокарте. Плотная, не MoE: 27 миллиардов параметров, 64 слоя, внимание гибридное — 16 слоёв Gated DeltaNet чередуются со слоями обычного управляемого внимания. Мультимодальность родная: на вход идут текст, картинки и видео. Контекст — 262 144 токена, растягивается до миллиона методом YaRN. Лицензия Apache 2.0 — то есть без оговорок про выручку и число пользователей, которые Alibaba прописала для открытых весов старшей Max. Рассуждения включены по умолчанию, глубину задаёт параметр `reasoning_effort` с уровнями low, medium и xhigh, а режим `preserve_thinking` сохраняет ход мысли между ходами диалога — это заметно помогает агентным сценариям. Собственные цифры Alibaba: SWE-bench Pro 61,7%, LiveCodeBench 90,3%, GPQA Diamond 89,2%, Terminal-Bench 2.1 73,0%, работа с компьютером OSWorld 84,3% и WebArena 64,8%.",
    capabilities: [
      "open-weights",
      "multimodal",
      "reasoning",
      "agentic",
      "coding",
      "long-context",
    ],
    sourceUrl: "https://huggingface.co/Qwen/Qwen3.8-27B",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Выкладку этой модели обещали на неделе с 10 августа, и 12-го в драфте по флагману пришлось отметить, что репозиторий Qwen3.8-27B отдаёт 404. Веса появились 14 августа — и за первые же сутки набрали больше 260 тысяч скачиваний против примерно тысячи у старшей 2.4T, вышедшей двумя днями раньше.",
  },
  {
    id: "dots-studio-dots3-note-preview",
    slug: "dots3-note-preview",
    vendor: "dots studio",
    name: "dots3-note preview",
    releaseDate: "2026-08-14",
    contextTokens: 512000,
    params: "280B total / 16B active (MoE)",
    highlight:
      "Соцсеть Xiaohongshu открыла первую модель семейства dots3 — с полумиллионом токенов контекста и звуком на входе, под Apache 2.0.",
    description:
      "dots3-note preview — первая открытая модель семейства dots3 от dots studio, ИИ-лаборатории китайской соцсети Xiaohongshu («Сяохуншу», она же RedNote). MoE на 280 миллиардов параметров, на токен работают 16 миллиардов: один плотный слой и 45 слоёв MoE, 256 маршрутизируемых экспертов. Внимание разложено на два типа — 13 слоёв разреженного внимания и 33 слоя внимания в скользящем окне; за счёт этого контекст доходит до 512 тысяч токенов. Вход мультимодальный и включает звук: текст, картинки, видео и аудио, на выходе только текст. Лицензия Apache 2.0, веса на Hugging Face и ModelScope, код и рецепты запуска — на GitHub. Разворачивание рекомендуют в виде FP8-версии на одном узле из восьми видеокарт через SGLang или vLLM; поддержка есть в основной ветке vLLM, но до попадания в стабильный выпуск нужна ночная сборка. Собственные цифры лаборатории: SWE-bench Verified 78,4, SWE-bench Pro 61, мультимодальный MMMU Pro 79,1. В названии — «note», заметка: семейство затачивают под долгие бытовые задачи, а не под олимпиадные.",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "long-context",
      "agentic",
      "coding",
    ],
    sourceUrl: "https://huggingface.co/dots-studio/dots3-note-prev",
    wikiUrl: "https://en.wikipedia.org/wiki/Xiaohongshu",
    funFact:
      "Архитектуру модели раскрыли за восемь дней до релиза — её случайно выдал открытый запрос на изменение в проекте vLLM, где заранее добавили поддержку ещё не выпущенной модели.",
  },
  {
    id: "zhipu-glm-5-3",
    slug: "glm-5-3",
    vendor: "Zhipu AI",
    name: "GLM-5.3",
    releaseDate: "2026-08-14",
    contextTokens: 1000000,
    params: "744B total / ~40B active (MoE)",
    highlight:
      "Базовую модель не меняли вообще — весь прирост Z.ai получила одним дообучением поверх GLM-5.2 и заявляет плюс 50% на своём кодовом бенчмарке.",
    description:
      "GLM-5.3 — флагман Z.ai, у которого нет собственной базовой модели: компания прямо пишет, что взяла ту же базу, что у GLM-5.2, и все улучшения получила на этапе дообучения, многократно расширив набор длинных рабочих окружений. Отсюда и параметры без изменений — 744 миллиарда всего, около 40 активных на токен, контекст в миллион токенов; выросла только длина ответа, до 128 тысяч токенов. По собственным замерам вендора: плюс 50% к GLM-5.2 на внутреннем Z.ai Code Bench, первое место среди открытых моделей на Terminal-Bench 3.0 и Agents' Last Exam, 84,5% на CyberGym — бенчмарке поиска уязвимостей, где модель ищет дыры в чужом коде. Режим рассуждения теперь выключить нельзя вообще: параметр `thinking.type: disabled` больше не поддерживается, вместо него три уровня усилия — low, high и max, по умолчанию max. Вход только текстовый, картинок модель не понимает. В день выхода доступ дали подписчикам GLM Coding Plan, где квота считается очками, а вызовы в выходные и ночью списывают вдвое меньше; веса на день релиза не выложили — их пообещали примерно через две недели после запуска, когда закончится проверка безопасности.",
    capabilities: [
      "coding",
      "agentic",
      "reasoning",
      "long-context",
      "tool-use",
    ],
    sourceUrl: "https://docs.z.ai/guides/llm/glm-5.3",
    wikiUrl: "https://en.wikipedia.org/wiki/GLM-4.5",
    funFact:
      "Веса GLM-5.2 лежали на Hugging Face под лицензией MIT уже через несколько дней после запуска подписки. У GLM-5.3 компания впервые придержала их примерно на две недели ради проверки безопасности — и причина видна в её же цифрах: 84,5% на бенчмарке поиска уязвимостей означает, что модель хорошо умеет искать дыры не только в своём коде.",
  },
  {
    id: "deepreinforce-ornith-1-5",
    slug: "ornith-1-5",
    vendor: "DeepReinforce",
    name: "Ornith-1.5",
    releaseDate: "2026-08-18",
    contextTokens: 262144,
    params: "397B MoE / 35B-A3B MoE / 9B dense",
    highlight:
      "Модель, которая сама придумывает себе задачи и сама пишет обвязку для их решения: открытые веса под MIT и заявка на уровень Claude Opus 4.8 в агентном кодинге.",
    description:
      "Ornith-1.5 — второе поколение открытых моделей небольшой лаборатории DeepReinforce, выложенное сразу тремя размерами: флагман на 397 миллиардов параметров (MoE, 60 слоёв, 512 экспертов, 10 работают на токен), средняя MoE на 35 миллиардов с тремя активными и плотная девятимиллиардная, у которой есть отдельная квантованная сборка Mobile для iPhone и Android. Своей базовой модели у лаборатории нет: Ornith-1.0 собирали поверх открытых Qwen3.5 и Gemma 4 с дообучением, а 1.5 — продолжение того же дообучения. Главное здесь не архитектура, а способ обучения. Обычно для обучения с подкреплением люди руками составляют набор задач и обвязку, в которой модель их решает; в Ornith-1.5 модель делает и то, и другое сама — придумывает новые задачи, строит под каждую свою обвязку, генерирует решения и учится на них. Когда задача становится для неё лёгкой, награда за неё падает, и генератор задач сам сдвигается к более трудным. Контекст — 262 144 токена, растягивается примерно до миллиона методом YaRN; рассуждения включены по умолчанию и возвращаются отдельным полем. Лицензия MIT, без оговорок про выручку. Собственные цифры лаборатории для флагмана, усреднённые по пяти прогонам: Terminal-Bench 2.1 — 86,1 против 85,0 у Claude Opus 4.8 и 88,3 у Kimi K3; SWE-bench Verified — 86,0 против 85,8 у Opus 4.8; DeepSWE — 56,0 против 59,0; GPQA Diamond — 92,8 против 93,6. Средняя 35B при трёх активных миллиардах заявляет 79,0 на SWE-bench Verified, младшая 9B — 70,6 там же и 47,0 на Terminal-Bench 2.1.",
    capabilities: [
      "open-weights",
      "MoE",
      "agentic",
      "coding",
      "reasoning",
      "long-context",
      "on-device",
    ],
    sourceUrl: "https://ornith.ai/ornith_1_5.html",
    wikiUrl: null,
    funFact:
      "Резче всего самообучение видно на DeepSWE — бенчмарке, где модель правит настоящие баги в чужих репозиториях. Прошлая версия того же размера набирала там 8 баллов из ста, новая — 56. У средней модели разрыв ещё нагляднее: Ornith-1.5-35B получает 22 балла, а её ровесники Qwen3.6-35B и прошлая Ornith-1.0-35B — ровный ноль.",
  },
  {
    id: "deepseek-deepseek-v4-flash-vision-exp",
    slug: "deepseek-v4-flash-vision-exp",
    vendor: "DeepSeek",
    name: "DeepSeek-V4-Flash-Vision-Exp",
    releaseDate: "2026-08-21",
    contextTokens: 1000000,
    params: "~305B total (посчитано по весам)",
    highlight:
      "Младшая модель DeepSeek научилась смотреть на картинки, и доплаты за это нет: тот же прайс, что у текстовой версии.",
    description:
      "DeepSeek добавила в API экспериментальную модель `deepseek-v4-flash-vision-exp` — это июльская DeepSeek-V4-Flash 0731, к которой прикрутили понимание картинок. На вход теперь идут текст и изображения, на выходе по-прежнему только текст; видео, PDF и режима распознавания текста нет. По заявлению компании, на чисто текстовых задачах модель не отличается от обычной V4-Flash, а на агентных задачах, где нужно смотреть на экран, даёт заметный скачок и подходит вплотную к Claude Opus 4.8. Контекст — миллион токенов, ответ до 384 тысяч, есть вызов функций и ответ в формате JSON. Картинки передаются как base64, ссылкой или через Files API. Размер модели для vision-сборки DeepSeek не раскрывала: базовая V4-Flash — 284 миллиарда параметров при 13 активных, но сколько добавил зрительный модуль, компания не сказала. После выкладки весов размер стало видно по файлам — около 305 миллиардов параметров всего; сколько из них активны, компания по-прежнему не говорит. Первые десять дней модель жила только в API, но 31 августа DeepSeek выложила её веса на Hugging Face под лицензией MIT — вместе с эталонной реализацией вывода, включая зрительный кодировщик. Суффикс `exp` в имени при этом остался: компания по-прежнему называет это экспериментом, а не стабильным релизом.",
    capabilities: [
      "open-weights",
      "multimodal",
      "vision",
      "agentic",
      "coding",
      "reasoning",
      "long-context",
    ],
    sourceUrl: "https://api-docs.deepseek.com/news/news260821/",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Картинка любого размера стоит максимум 384 токена — DeepSeek считает её по габаритам, но обрезает счёт сверху. То есть фотография 5000×5000 обходится ровно во столько же, во сколько 2000×2000, и зрение не меняет прайс модели вообще: тарифы vision-версии совпадают с текстовой до цента.",
  },
  {
    id: "apodex-apodex-1-1",
    slug: "apodex-1-1",
    vendor: "Apodex AI",
    name: "Apodex 1.1",
    releaseDate: "2026-08-24",
    contextTokens: null,
    params: null,
    highlight:
      "Модель сама решает, на сколько подзадач разбить работу и скольким помощникам её раздать, а перед выдачей отдельный этап проверяет каждое утверждение по источникам.",
    description:
      "Apodex 1.1 — флагман небольшой лаборатории Apodex AI, сделанный не как собеседник, а как исполнитель долгих рабочих задач: юридических, финансовых и научных. Модель работает не только с текстом, но и с файлами напрямую — статьями, таблицами, картинками, наборами данных и кодом: чистит данные, выбирает метод, запускает расчёт, смотрит на промежуточный результат, исправляется после ошибки и доводит задачу до готового документа за один непрерывный проход. Главная особенность — асинхронная «команда агентов»: модель сама решает, можно ли разбить задачу, как именно и скольким помощникам её раздать; результаты стекаются в общее состояние задачи, поэтому пользователь может подкинуть новый файл или поменять требование посреди работы, не начиная всё заново. Перед выдачей включается отдельный этап Statement Review — он независимо сверяет ключевые утверждения с источниками, данными и расчётами, а при нестыковке помечает проблему и правит вывод, оставляя сам разбор видимым. Собственные цифры компании для флагмана: APEX-Agents — 38,5, GDPVal — 78,8, FrontierFinance — 54,3, FrontierScience-Research — 63,3, BioMysteryBench — 35,3, Humanity's Last Exam — 56,1. Веса флагмана закрыты, доступ через apodex.ai и платный API. Вместе с ним вышла открытая младшая модель Apodex 1.1 mini под Apache 2.0 — 35 миллиардов параметров, около 3 активных на токен, контекст 262 144 токена; это дообучение поверх Qwen3.5-35B-A3B, и по цифрам компании она ведёт FrontierFinance с 50,2 и почти догоняет лучший результат APEX-Agent с 27,7. Отдельно выложен открытый каркас для запуска агентной команды — FrontierAgent под Apache 2.0.",
    capabilities: [
      "agentic",
      "reasoning",
      "multimodal",
      "tool-use",
      "long-running-tasks",
    ],
    sourceUrl:
      "https://www.apodex.com/blog/apodex-1.1-scaling-agentic-intelligence-for-complex-work",
    wikiUrl: null,
    funFact:
      "В карточке модели компания прямо пишет, что на время замеров закрывает модели доступ к сайтам, где лежат сами бенчмарки. Причина простая: модель умеет искать в интернете, и без такого запрета она могла бы найти не решение задачи, а готовый ответ из публичного репозитория с тестами — и замер показал бы качество поиска, а не качество рассуждения.",
  },
  {
    id: "alibaba-qwen3-8-flash-next",
    slug: "qwen3-8-flash-next",
    vendor: "Alibaba",
    name: "Qwen3.8-Flash-Next",
    releaseDate: "2026-08-26",
    contextTokens: 262144,
    params: "125B total / 6B active (MoE) + 51B n-gram embeddings",
    highlight:
      "Alibaba заранее открыла архитектуру будущей Qwen4: на токен работают всего 6 миллиардов параметров, а обучение обошлось примерно в девять раз дешевле прошлого флагмана.",
    description:
      "Qwen3.8-Flash-Next — открытая модель, которую Alibaba выпустила не как очередной релиз линейки, а как ранний показ архитектуры, на которой будет построена Qwen4. Такое компания уже делала: два года назад Qwen3-Next точно так же обкатала связку Gated DeltaNet и управляемого внимания, и эта связка потом ушла в серии Qwen3.5, 3.6, 3.7 и 3.8. Модель мультимодальная, со зрительным кодировщиком: на вход идут текст, картинки и видео. Основная часть — 125 миллиардов параметров, на токен работают 6 миллиардов; сверх этого есть отдельная таблица н-граммных эмбеддингов на 51 миллиард параметров и слой предсказания нескольких токенов вперёд на 4 миллиарда. 48 слоёв, 512 экспертов, на токен включаются 10 маршрутизируемых и один общий. Внимание гибридное: на каждые четыре слоя приходятся три слоя Gated DeltaNet и один слой Qwen Sparse Attention, который выбирает нужный кусок контекста не по отдельным токенам, а блоками — за счёт этого длинный контекст обходится сильно дешевле. Контекст — 262 144 токена, растягивается до миллиона. Лицензия своя, Qwen Community License 1.0: пользоваться и продавать можно, но при больших оборотах требуется указывать имя модели в интерфейсе, а перепродажа модели как сервиса требует отдельного разрешения. Собственные цифры Alibaba: DeepSWE 1.1 — 58,7 против 54,4 у DeepSeek-V4-Flash-0731, SWE-bench Pro — 62,5 против 53,4 у Claude Opus 4.6, SWE-bench Multilingual — 81,0, офисные задачи CoWorkBench — 73,9 против 45,1 у DeepSeek, GPQA Diamond — 91,7, LiveCodeBench v6 — 91,9, работа с телефоном AndroidWorld — 84,5. Обучение, по словам компании, стоило примерно в девять раз дешевле, чем у Qwen3.7-Plus.",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "agentic",
      "coding",
      "reasoning",
      "long-context",
    ],
    sourceUrl: "https://huggingface.co/Qwen/Qwen3.8-Flash-Next",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Самая необычная деталь — таблица н-граммных эмбеддингов: 20 миллионов пар и троек соседних токенов, к которой модель обращается на втором слое. Она добавляет 51 миллиард параметров, но почти не требует вычислений, поэтому её можно держать не в видеопамяти, а в обычной оперативной, подгружая заранее. Получается способ нарастить объём знаний модели, не увеличивая счёт за видеокарты.",
  },
  {
    id: "zhipu-glm-5-3-flash",
    slug: "glm-5-3-flash",
    vendor: "Zhipu AI",
    name: "GLM-5.3-Flash",
    releaseDate: "2026-08-26",
    contextTokens: 1000000,
    params: "320B total / 18B active (MoE)",
    highlight:
      "Первая модель GLM, которая изначально умеет смотреть на картинки, — и первая, чьи веса выложили под MIT прямо в день выхода, а не через две недели, как у старшей GLM-5.3.",
    description:
      "GLM-5.3-Flash — младшая модель линейки GLM-5 и первая в ней, которая мультимодальна с самого обучения, а не получила зрение потом. 320 миллиардов параметров всего, 18 работают на токен; вход — текст, картинки, видео и файлы, выход только текстовый. Режим рассуждения выключить нельзя, как и у старшей GLM-5.3. Базовую модель Z.ai обучила заново, а не дообучила прежнюю, и впервые в серии собрала внимание из двух типов сразу — разреженного и линейного. По её собственным замерам, в пересчёте на слой это даёт втрое меньше вычислений на внимание и вчетверо меньше памяти под кеш ключей, чем у GLM-5.3. Контекст — миллион токенов, претрейн — 30 триллионов токенов мультимодального корпуса. Собственные цифры компании: DeepSWE v1.1 — 63,4 против 46,2 у GLM-5.2, AutomationBench — 48,8 против 26,2, а на внутреннем Z.ai Code Bench v1.0 при максимальном усилии модель почти догоняет Claude Opus 4.8 — 29,0 против 29,5. Отдельно Z.ai приводит замер Artificial Analysis, чужой методикой: 57 баллов индекса версии 4.1.1 при 0,045 доллара за задачу со скидкой. Веса выложены на Hugging Face под лицензией MIT в двух точностях, FP8 и BF16, — то есть без оговорок про выручку и число пользователей.",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "coding",
      "agentic",
      "reasoning",
      "long-context",
    ],
    sourceUrl: "https://docs.z.ai/guides/llm/glm-5.3-flash",
    wikiUrl: "https://en.wikipedia.org/wiki/GLM-4.5",
    funFact:
      "Перед релизом Z.ai выкатила эту модель анонимно, под именем ox-alpha, на OpenCode и OpenRouter — просто чтобы собрать отзывы, не называя автора. По словам самой компании, безымянная модель стала самой популярной моделью недели, и весь этот поток запросов обслуживали китайские ускорители, а не Nvidia.",
  },
];
