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
];
