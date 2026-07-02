import type { LlmModel } from "../types";

// ----------------------------------------------------------------------
// Landmark LLMs of 2025 — the reasoning-and-agents year. «NEVER invented»:
// unknown numerics are `null`. openai.com / x.ai announcement pages are
// canonical (they 403 bots but open in browsers).

export const LLM_MODELS_2025: LlmModel[] = [
  {
    id: "deepseek-deepseek-r1",
    slug: "deepseek-r1",
    vendor: "DeepSeek",
    name: "DeepSeek-R1",
    releaseDate: "2025-01-20",
    contextTokens: 128000,
    params: "671B (37B активных, MoE)",
    highlight:
      "Открытая reasoning-модель уровня OpenAI o1, обученная в основном через RL — вызвала шок на рынке.",
    description:
      "DeepSeek-R1 — открытая reasoning-модель на архитектуре DeepSeek-V3 (671 млрд параметров, 37 млрд активных), развивающая способности к рассуждению через обучение с подкреплением. Ключевая идея — крупномасштабный RL по алгоритму GRPO поверх «холодного старта» на chain-of-thought данных, дающий самопроверку и коррекцию ошибок. По задачам рассуждения R1 сопоставима с OpenAI o1, но обучена гораздо дешевле; открытая публикация метода и весов вызвала резонанс на всём рынке ИИ.",
    capabilities: [
      "open-weights",
      "reasoning",
      "MoE",
      "reinforcement-learning",
      "long-context",
    ],
    sourceUrl: "https://api-docs.deepseek.com/news/news250120",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Релиз R1 обвалил акции Nvidia почти на 17% за день — рынок испугался, что frontier-ИИ может быть настолько дешёвым.",
  },
  {
    id: "xai-grok-3",
    slug: "grok-3",
    vendor: "xAI",
    name: "Grok 3",
    releaseDate: "2025-02-17",
    contextTokens: 131072,
    params: null,
    highlight:
      "Модель, обученная на суперкомпьютере Colossus (~200 тыс. GPU) — в 10 раз больше вычислений, чем у Grok 2.",
    description:
      "Флагман xAI, обученный на суперкомпьютере Colossus из примерно 200 000 GPU — с десятикратным ростом вычислений относительно Grok 2. Получил режимы рассуждений Think и Big Brain, а также DeepSearch — агентный поиск по интернету и X. xAI заявляла превосходство над GPT-4o на задачах AIME и GPQA.",
    capabilities: ["reasoning", "search", "chat", "frontier", "think-mode"],
    sourceUrl: "https://x.ai/news/grok-3",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "Режим Big Brain для самых сложных задач так и не выпустили публично — он остался внутренней функцией xAI.",
  },
  {
    id: "anthropic-claude-3-7-sonnet",
    slug: "claude-3-7-sonnet",
    vendor: "Anthropic",
    name: "Claude 3.7 Sonnet",
    releaseDate: "2025-02-24",
    contextTokens: 200000,
    params: null,
    highlight:
      "Первая на рынке гибридная reasoning-модель: одна модель — два режима мышления, плюс дебют Claude Code.",
    description:
      "24 февраля 2025 года Anthropic представила Claude 3.7 Sonnet — первую гибридную reasoning-модель, которая даёт как мгновенные ответы, так и видимое пошаговое «расширенное мышление» в одной модели. Через API можно задавать бюджет размышлений вплоть до 128K токенов вывода, торгуя скорость на качество. Модель стала state-of-the-art по коду (70.3% на SWE-bench Verified). Одновременно вышел агентный инструмент командной строки Claude Code.",
    capabilities: [
      "hybrid-reasoning",
      "extended-thinking",
      "multimodal",
      "coding",
      "agentic",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-3-7-sonnet",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Способности Claude 3.7 Sonnet демонстрировали в том числе игрой в Pokémon — модель проходила игру заметно дальше предшественников.",
  },
  {
    id: "yandex-yandexgpt-5",
    slug: "yandexgpt-5",
    vendor: "Yandex",
    name: "YandexGPT 5",
    releaseDate: "2025-02-25",
    contextTokens: 32000,
    params: "8B (Lite, открытая); параметры Pro не раскрыты",
    highlight:
      "Новое поколение LLM Яндекса: Pro — в Алисе и облаке, Lite 8B — первый опенсорс со времён YaLM-100B.",
    description:
      "Семейство из старшей YandexGPT 5 Pro и облегчённой Lite. Pro встала в чат с Алисой и Yandex Cloud API и, по замерам Яндекса (SbS), не уступает GPT-4o. YandexGPT 5 Lite Pretrain — модель на 8 млрд параметров с контекстом 32 тыс. токенов — выложена бесплатно на Hugging Face; претрейн шёл в два этапа: 15T токенов, затем Powerup на 320B отборных данных.",
    capabilities: ["russian", "open-weights", "chat", "assistant", "cloud"],
    sourceUrl: "https://habr.com/ru/companies/yandex/articles/885218/",
    wikiUrl: "https://ru.wikipedia.org/wiki/YandexGPT",
    funFact:
      "До Lite 8B Яндекс выкладывал открытую LLM лишь однажды — YaLM-100B в 2022 году.",
  },
  {
    id: "openai-gpt-4-5",
    slug: "gpt-4-5",
    vendor: "OpenAI",
    name: "GPT-4.5",
    releaseDate: "2025-02-27",
    contextTokens: 128000,
    params: null,
    highlight:
      "«Гигантская и дорогая» последняя нерассуждающая флагманская модель OpenAI — исчезла из API уже через 4,5 месяца.",
    description:
      "Research preview под кодовым именем Orion; Сэм Альтман назвал её «giant, expensive model». Превзошла GPT-4o на MMLU на 15 языках, но стоила рекордные $75/$150 за млн токенов ввода/вывода. Стала последним чат-ботом OpenAI без chain-of-thought-рассуждений — «конец эпохи» чистого масштабирования.",
    capabilities: ["chat", "scale", "frontier", "creative-writing"],
    sourceUrl: "https://openai.com/index/introducing-gpt-4-5/",
    wikiUrl: "https://ru.wikipedia.org/wiki/GPT-4.5",
    funFact:
      "Из OpenAI API модель убрали уже 14 июля 2025 — через 4,5 месяца после запуска: слишком дорогая в обслуживании.",
  },
  {
    id: "google-gemini-2-5-pro",
    slug: "gemini-2-5-pro",
    vendor: "Google",
    name: "Gemini 2.5 Pro",
    releaseDate: "2025-03-25",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Первая «думающая» модель линейки Gemini: дебют на 1-м месте LMArena и контекст 1 млн токенов.",
    description:
      "Google представила Gemini 2.5 как «thinking models» — модели, рассуждающие перед ответом. Gemini 2.5 Pro (Experimental) дебютировала на первом месте LMArena «со значительным отрывом» и вышла с контекстным окном в 1 млн токенов (обещали 2 млн). Стала главным конкурентом reasoning-моделей OpenAI в кодинге и математике.",
    capabilities: ["reasoning", "multimodal", "long-context", "coding"],
    sourceUrl:
      "https://blog.google/technology/google-deepmind/gemini-model-thinking-updates-march-2025/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "Контекст в 1 млн токенов работал с первого дня, а обещанные 2 млн так и остались «coming soon».",
  },
  {
    id: "meta-llama-4",
    slug: "llama-4",
    vendor: "Meta",
    name: "Llama 4 Scout / Maverick",
    releaseDate: "2025-04-05",
    contextTokens: 10000000,
    params: "Scout: 109B / 17B active; Maverick: 400B / 17B active (MoE)",
    highlight:
      "Первые нативно мультимодальные MoE-модели Meta; у Scout — рекордное окно в 10 млн токенов.",
    description:
      "Первое поколение Llama на архитектуре mixture-of-experts и с нативной мультимодальностью. Scout (109B/17B active) заявлен с контекстом 10 млн токенов, Maverick (400B/17B active) — 1 млн. Оба вышли открытыми весами; вместе с ними Meta анонсировала Behemoth — модель-учителя почти на 2 трлн параметров.",
    capabilities: ["open-weights", "MoE", "multimodal", "long-context"],
    sourceUrl: "https://ai.meta.com/blog/llama-4-multimodal-intelligence/",
    wikiUrl: "https://ru.wikipedia.org/wiki/LLaMA",
    funFact:
      "Behemoth (~2T параметров) по заявлению Meta обходил GPT-4.5 и Claude Sonnet 3.7 на STEM-бенчмарках, но так и не вышел.",
  },
  {
    id: "openai-gpt-4-1",
    slug: "gpt-4-1",
    vendor: "OpenAI",
    name: "GPT-4.1",
    releaseDate: "2025-04-14",
    contextTokens: 1047576,
    params: null,
    highlight:
      "API-семейство с окном в 1 млн токенов — рывок OpenAI в длинный контекст и дешёвый кодинг.",
    description:
      "Тройка GPT-4.1 / mini / nano вышла сразу и только в API, с фокусом на кодинг и следование инструкциям. Контекстное окно — 1 047 576 токенов, максимальный вывод — 32 768. С 14 мая 2025 GPT-4.1 добавили в ChatGPT, а mini заменила GPT-4o mini для всех пользователей.",
    capabilities: [
      "coding",
      "long-context",
      "api-only",
      "instruction-following",
    ],
    sourceUrl: "https://openai.com/index/gpt-4-1/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-4.1",
    funFact:
      "nano стала первой моделью OpenAI с приставкой «nano» — самой быстрой и дешёвой в линейке на тот момент.",
  },
  {
    id: "alibaba-qwen3",
    slug: "qwen3",
    vendor: "Alibaba",
    name: "Qwen3",
    releaseDate: "2025-04-29",
    contextTokens: 128000,
    params: "235B total / 22B active (MoE)",
    highlight:
      "8 открытых моделей за один день — от 0.6B до MoE 235B с гибридным «думающим» режимом.",
    description:
      "Alibaba выложила сразу восемь моделей: два MoE (235B-A22B и 30B-A3B) и шесть dense от 0.6B до 32B, под Apache 2.0. Главная фишка — гибридные режимы: один чекпойнт умеет и пошагово рассуждать (thinking mode), и отвечать мгновенно. Флагман активирует лишь 22B из 235B параметров на токен при контексте 128K.",
    capabilities: [
      "open-weights",
      "MoE",
      "reasoning",
      "hybrid-thinking",
      "apache-2.0",
    ],
    sourceUrl: "https://qwenlm.github.io/blog/qwen3/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Самая маленькая модель релиза (Qwen3-0.6B) меньше флагмана почти в 400 раз — но обе поддерживают режим рассуждений.",
  },
  {
    id: "anthropic-claude-4",
    slug: "claude-4",
    vendor: "Anthropic",
    name: "Claude Opus 4 / Sonnet 4",
    releaseDate: "2025-05-22",
    contextTokens: 200000,
    params: null,
    highlight:
      "Opus 4 — «лучшая кодинг-модель мира»: 72,5% SWE-bench и семь часов автономной работы.",
    description:
      "Anthropic назвала Opus 4 «the world's best coding model»: 72,5% на SWE-bench (у Sonnet 4 — 72,7%) и устойчивая работа в длинных агентных сценариях. Rakuten проверила это на практике — автономный рефакторинг опенсорса длился 7 часов без остановки. Opus 4 стал первой моделью Anthropic, выпущенной под усиленным уровнем безопасности ASL-3.",
    capabilities: ["coding", "agentic", "reasoning", "long-running-tasks"],
    sourceUrl: "https://www.anthropic.com/news/claude-4",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Opus 4 — первая модель, которой Anthropic присвоила «Level 3» по своей шкале риска и включила спецзащиты ASL-3.",
  },
  {
    id: "mistral-magistral",
    slug: "magistral",
    vendor: "Mistral AI",
    name: "Magistral",
    releaseDate: "2025-06-10",
    contextTokens: 128000,
    params: "24B (Small); параметры Medium не раскрыты",
    highlight:
      "Первая рассуждающая модель Европы: прозрачный chain-of-thought на русском и ещё 7 языках.",
    description:
      "Первый reasoning-релиз Mistral AI: открытая Magistral Small (24B, Apache 2.0) и корпоративная Magistral Medium. Medium набрала 73,6% на AIME2024 (90% с majority voting @64), Small — 70,7%. Ключевая особенность — рассуждение «нативно» на языке пользователя, включая русский и арабский, и десятикратная скорость в Le Chat через Flash Answers.",
    capabilities: ["reasoning", "multilingual", "open-weights", "transparency"],
    sourceUrl: "https://mistral.ai/news/magistral",
    wikiUrl: "https://ru.wikipedia.org/wiki/Mistral_AI",
    funFact:
      "Контекст у Magistral — 128K, но Mistral честно рекомендовала ограничиваться 40K: дальше качество рассуждений деградирует.",
  },
  {
    id: "xai-grok-4",
    slug: "grok-4",
    vendor: "xAI",
    name: "Grok 4",
    releaseDate: "2025-07-09",
    contextTokens: 256000,
    params: null,
    highlight:
      "Флагман xAI с нативными инструментами, поиском в реальном времени и мультиагентной версией Heavy.",
    description:
      "Grok 4 вышел сразу в двух вариантах — базовом и Grok 4 Heavy (доступен по подписке SuperGrok Heavy). Модель получила нативное использование инструментов и интеграцию поиска в реальном времени; xAI заявляла превосходство над конкурентами в бенчмарках. Контекст в API — 256K токенов.",
    capabilities: ["reasoning", "tool-use", "search", "multi-agent"],
    sourceUrl: "https://x.ai/news/grok-4",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "Через неделю после релиза заметили: на острые темы Grok 4 сначала искал взгляды Илона Маска — и лишь потом отвечал.",
  },
  {
    id: "moonshot-kimi-k2",
    slug: "kimi-k2",
    vendor: "Moonshot AI",
    name: "Kimi K2",
    releaseDate: "2025-07-11",
    contextTokens: 128000,
    params: "1T total / 32B active (MoE, 384 эксперта)",
    highlight:
      "Открытый «триллионник»: 1T параметров MoE — SOTA среди открытых моделей в кодинге.",
    description:
      "MoE-модель на 1 трлн параметров (32B активных, 384 эксперта, 8 на токен), выложенная под Modified MIT License. Спроектирована под агентные задачи: использование инструментов, рассуждения и автономное решение проблем; показала state-of-the-art среди открытых моделей в кодинг-бенчмарках. Претрейн — 15,5T токенов.",
    capabilities: ["open-weights", "MoE", "agentic", "coding", "tool-use"],
    sourceUrl: "https://moonshotai.github.io/Kimi-K2/",
    wikiUrl: "https://en.wikipedia.org/wiki/Kimi_K2",
    funFact:
      "15,5T токенов претрейна прошли на оптимизаторе MuonClip «с нулевой нестабильностью» — без единого всплеска лосса.",
  },
  {
    id: "zhipu-glm-4-5",
    slug: "glm-4-5",
    vendor: "Zhipu AI",
    name: "GLM-4.5",
    releaseDate: "2025-07-28",
    contextTokens: 128000,
    params: "355B total / 32B active (MoE)",
    highlight:
      "355B MoE под MIT: 3-е место в мире по сумме 12 бенчмарков — при цене от $0,11 за млн токенов.",
    description:
      "Z.ai (бывшая Zhipu AI) объединила в одной модели агентные навыки, рассуждения и кодинг: GLM-4.5 набрала 63,2 балла по сумме 12 бенчмарков — третье место среди всех моделей мира и первое среди открытых. Веса 355B/32B active (и облегчённой Air 106B/12B) выложены под MIT с гибридными режимами thinking/non-thinking.",
    capabilities: ["open-weights", "MoE", "agentic", "reasoning", "coding"],
    sourceUrl: "https://z.ai/blog/glm-4.5",
    wikiUrl: "https://en.wikipedia.org/wiki/GLM-4.5",
    funFact:
      "API-цена GLM-4.5 стартовала с $0,11 за млн входных токенов — на порядок ниже западных флагманов того лета.",
  },
  {
    id: "openai-gpt-oss",
    slug: "gpt-oss",
    vendor: "OpenAI",
    name: "gpt-oss",
    releaseDate: "2025-08-05",
    contextTokens: 128000,
    params: "120b: 117B / 5.1B active; 20b: 21B / 3.6B active (MoE)",
    highlight:
      "Первые открытые веса OpenAI со времён GPT-2: Apache 2.0, старшая модель влезает в одну GPU на 80 ГБ.",
    description:
      "OpenAI впервые за годы выложила открытые веса: reasoning-модели gpt-oss-120b (117B/5.1B active) и gpt-oss-20b (21B/3.6B) под Apache 2.0. По заявлению OpenAI, старшая сопоставима с o4-mini, младшая — с o3-mini. Благодаря MXFP4-квантованию 120b помещается в одну GPU на 80 ГБ (H100/MI300X).",
    capabilities: ["open-weights", "MoE", "reasoning", "apache-2.0", "local"],
    sourceUrl: "https://openai.com/index/introducing-gpt-oss/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-OSS",
    funFact:
      "gpt-oss-20b запускается на устройстве с 16 ГБ памяти — reasoning-модель OpenAI на обычном ноутбуке.",
  },
  {
    id: "openai-gpt-5",
    slug: "gpt-5",
    vendor: "OpenAI",
    name: "GPT-5",
    releaseDate: "2025-08-07",
    contextTokens: 400000,
    params: null,
    highlight:
      "Единая система с роутером вместо зоопарка моделей: 74,9% SWE-bench Verified и доступ даже бесплатным пользователям.",
    description:
      "GPT-5 — не одна модель, а система: быстрая модель, глубокая reasoning-модель и роутер, выбирающий их в реальном времени. 74,9% на SWE-bench Verified, контекст 400K токенов (272K вход + 128K вывод), впервые флагман открыт бесплатным пользователям ChatGPT. Запуск вышел скандальным: роутер сломался, а пользователи требовали вернуть GPT-4o.",
    capabilities: ["reasoning", "router", "coding", "agentic", "frontier"],
    sourceUrl: "https://openai.com/index/introducing-gpt-5/",
    wikiUrl: "https://ru.wikipedia.org/wiki/GPT-5",
    funFact:
      "В день запуска сломался автопереключатель моделей, и GPT-5 «казалась заметно глупее» — это признал сам Альтман.",
  },
  {
    id: "deepseek-deepseek-v3-1",
    slug: "deepseek-v3-1",
    vendor: "DeepSeek",
    name: "DeepSeek-V3.1",
    releaseDate: "2025-08-21",
    contextTokens: 128000,
    params: "671B total / 37B active (MoE)",
    highlight:
      "«Первый шаг в эру агентов»: один чекпойнт — два режима (think/non-think) и рост в использовании инструментов.",
    description:
      "Гибридная модель: один чекпойнт работает и в thinking-, и в non-thinking-режиме простой сменой шаблона чата. Пост-трейнинг усилил инструменты и многошаговые агентные задачи: 66,0% на SWE-bench и 68,4% на Aider-Polyglot, при этом V3.1-Think отвечает быстрее R1-0528. Веса (671B/37B active) открыты под MIT.",
    capabilities: [
      "open-weights",
      "MoE",
      "hybrid-thinking",
      "agentic",
      "coding",
    ],
    sourceUrl: "https://api-docs.deepseek.com/news/news250821",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Для длинного контекста фазу 32K-расширения нарастили в 10 раз — до 630 млрд токенов дообучения.",
  },
  {
    id: "anthropic-claude-sonnet-4-5",
    slug: "claude-sonnet-4-5",
    vendor: "Anthropic",
    name: "Claude Sonnet 4.5",
    releaseDate: "2025-09-29",
    contextTokens: 200000,
    params: null,
    highlight:
      "«Лучшая кодинг-модель мира» на день релиза: 77,2% SWE-bench Verified и 30+ часов автономного фокуса.",
    description:
      "Anthropic открыла анонс словами «Claude Sonnet 4.5 is the best coding model in the world»: 77,2% на SWE-bench Verified и 61,4% на OSWorld — лучший результат в управлении компьютером. Главный прорыв — длинная автономия: модель держит фокус на многошаговой задаче более 30 часов. Вышла в среднем ценовом сегменте ($3/$15 за млн токенов).",
    capabilities: ["coding", "agentic", "computer-use", "long-running-tasks"],
    sourceUrl: "https://www.anthropic.com/news/claude-sonnet-4-5",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "30+ часов непрерывной работы над задачей — вчетверо дольше, чем 7-часовой рекорд Opus 4 четырьмя месяцами ранее.",
  },
  {
    id: "moonshot-kimi-k2-thinking",
    slug: "kimi-k2-thinking",
    vendor: "Moonshot AI",
    name: "Kimi K2 Thinking",
    releaseDate: "2025-11-06",
    contextTokens: 256000,
    params: "1T total / 32B active (MoE)",
    highlight:
      "Открытый reasoning-агент: 44,9% на Humanity's Last Exam и 200–300 вызовов инструментов подряд.",
    description:
      "Reasoning-версия Kimi K2: 1T/32B active, контекст 256K, Modified MIT. С инструментами набирает 44,9% на Humanity's Last Exam (51,0% в heavy-режиме) и сохраняет целенаправленное поведение на 200–300 последовательных вызовах инструментов — там, где прежние системы деградировали после 30–50 шагов. Открытая модель впервые всерьёз догнала закрытые флагманы в агентных задачах.",
    capabilities: [
      "open-weights",
      "reasoning",
      "agentic",
      "tool-use",
      "long-horizon",
    ],
    sourceUrl: "https://moonshotai.github.io/Kimi-K2/thinking.html",
    wikiUrl: "https://en.wikipedia.org/wiki/Kimi_K2",
    funFact:
      "Благодаря квантованию INT4 с QAT модель генерирует примерно вдвое быстрее без потери качества рассуждений.",
  },
  {
    id: "openai-gpt-5-1",
    slug: "gpt-5-1",
    vendor: "OpenAI",
    name: "GPT-5.1",
    releaseDate: "2025-11-12",
    contextTokens: 400000,
    params: null,
    highlight:
      "«Теплее и умнее»: адаптивное рассуждение, 8 пресетов характера и ответ OpenAI на Gemini 3.",
    description:
      "Обновление GPT-5 в вариантах Instant и Thinking: у Instant появилось адаптивное рассуждение (модель сама решает, когда подумать), у Thinking — динамический бюджет размышлений. OpenAI сделала ставку на «теплоту» общения и персонализацию — восемь пресетов личности на выбор. 19 ноября линейку дополнили GPT-5.1-Codex-Max и GPT-5.1 Pro.",
    capabilities: ["chat", "reasoning", "adaptive-thinking", "personalization"],
    sourceUrl: "https://openai.com/index/gpt-5-1/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-5.1",
    funFact:
      "После жалоб на «плоский» тон GPT-5 в GPT-5.1 добавили восемь настраиваемых персон — реакция на главный провал предшественника.",
  },
  {
    id: "google-gemini-3",
    slug: "gemini-3",
    vendor: "Google",
    name: "Gemini 3",
    releaseDate: "2025-11-18",
    contextTokens: 1000000,
    params: null,
    highlight:
      "1501 Эло на LMArena, 37,5% на Humanity's Last Exam — и впервые сразу в Поиске Google в день запуска.",
    description:
      "«Самая умная модель» Google: 1501 Эло на LMArena, 37,5% на Humanity's Last Exam без инструментов (41,0% в режиме Deep Think), 45,1% на ARC-AGI-2. Контекст — 1 млн токенов. Впервые в истории компании модель в день релиза встала сразу в Поиск (AI Mode), приложение Gemini и инструменты разработчика, включая новую агентную среду Antigravity.",
    capabilities: [
      "multimodal",
      "reasoning",
      "long-context",
      "agentic",
      "frontier",
    ],
    sourceUrl: "https://blog.google/products/gemini/gemini-3/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "«Впервые мы выпускаем Gemini в Поиске в первый же день» — до этого новые модели добирались до Поиска месяцами.",
  },
  {
    id: "anthropic-claude-opus-4-5",
    slug: "claude-opus-4-5",
    vendor: "Anthropic",
    name: "Claude Opus 4.5",
    releaseDate: "2025-11-24",
    contextTokens: 200000,
    params: null,
    highlight:
      "Первая модель выше 80% на SWE-bench Verified (80,9%) — и втрое дешевле предыдущего Opus.",
    description:
      "«Лучшая модель в мире для кодинга, агентов и работы с компьютером»: 80,9% на SWE-bench Verified — первый в истории результат выше 80%, впереди GPT-5.1-Codex-Max (77,9%) и Gemini 3 Pro (76,2%). Цену при этом снизили с $15/$75 до $5/$25 за млн токенов. Релиз замкнул трёхнедельную гонку флагманов с OpenAI и Google.",
    capabilities: ["coding", "agentic", "computer-use", "frontier"],
    sourceUrl: "https://www.anthropic.com/news/claude-opus-4-5",
    wikiUrl: "https://en.wikipedia.org/wiki/Claude_Opus_4.5",
    funFact:
      "На внутреннем 2-часовом инженерном экзамене Anthropic модель набрала больше баллов, чем любой кандидат-человек за всю историю.",
  },
  {
    id: "mistral-mistral-large-3",
    slug: "mistral-large-3",
    vendor: "Mistral AI",
    name: "Mistral Large 3",
    releaseDate: "2025-12-02",
    contextTokens: 256000,
    params: "675B total / 41B active (MoE)",
    highlight:
      "Открытый флагман Европы: 675B MoE под Apache 2.0 — «одна из лучших permissive-моделей мира».",
    description:
      "Флагман семейства Mistral 3 (вместе с линейкой Ministral 3B/8B/14B): мультимодальный гранулярный MoE на 675B параметров (41B активных) с контекстом 256K, целиком под Apache 2.0. На LMArena занял 2-е место среди открытых non-reasoning моделей. Первый европейский опыт открытого фронтир-масштаба «в один клик» — от Hugging Face до Bedrock и Azure.",
    capabilities: [
      "open-weights",
      "MoE",
      "multimodal",
      "apache-2.0",
      "long-context",
    ],
    sourceUrl: "https://mistral.ai/news/mistral-3",
    wikiUrl: "https://ru.wikipedia.org/wiki/Mistral_AI",
    funFact:
      "Внутри 675B-модели живёт отдельный vision-энкодер на 2,5B параметров — флагман «видит» изображения из коробки.",
  },
];
