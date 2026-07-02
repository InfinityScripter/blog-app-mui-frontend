import type { LlmModel } from "../types";

// ----------------------------------------------------------------------
// Landmark LLMs of 2024 — multimodality, open frontier models and the first
// reasoning wave. «NEVER invented»: unknown numerics are `null`. openai.com /
// x.ai announcement pages are canonical (they 403 bots but open in browsers).

export const LLM_MODELS_2024: LlmModel[] = [
  {
    id: "google-gemini-1-5",
    slug: "gemini-1-5",
    vendor: "Google",
    name: "Gemini 1.5",
    releaseDate: "2024-02-15",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Контекстное окно до 1 млн токенов на архитектуре Mixture-of-Experts.",
    description:
      "Gemini 1.5 представлена Google 15 февраля 2024 года как модель следующего поколения на архитектуре Mixture-of-Experts. Ключевой прорыв — контекстное окно до 1 млн токенов (в исследованиях протестировано до 10 млн), что позволяет обрабатывать час видео, 11 часов аудио или свыше 700 тысяч слов за один проход. Gemini 1.5 Pro достигла качества уровня 1.0 Ultra при меньших вычислительных затратах и показала 99% точности в тесте Needle In A Haystack. Стандартное окно составляло 128K токенов, расширенное до 1M — в приватном превью. Число параметров не раскрывалось.",
    capabilities: ["multimodal", "long-context", "MoE", "reasoning", "code"],
    sourceUrl:
      "https://blog.google/innovation-and-ai/products/google-gemini-next-generation-model-february-2024/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "Контекст Gemini 1.5 Pro — 1 млн токенов (в тестах до 10 млн): час видео или 700 тысяч слов в одном промпте.",
  },
  {
    id: "google-gemma",
    slug: "gemma",
    vendor: "Google",
    name: "Gemma",
    releaseDate: "2024-02-21",
    contextTokens: 8192,
    params: "2B / 7B",
    highlight:
      "Первые открытые веса от Google — лёгкие модели на технологиях Gemini.",
    description:
      "Google впервые выпустила модели с открытыми весами — Gemma 2B и 7B, построенные на тех же исследованиях и технологиях, что и Gemini. Обе версии вышли в предобученном и instruction-tuned вариантах с контекстом 8192 токена и лицензией, допускающей коммерческое использование. Пресса расценила релиз как ответ на волну открытых моделей конкурентов и разворот многолетней закрытой политики Google.",
    capabilities: [
      "open-weights",
      "lightweight",
      "on-device",
      "instruction-tuned",
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/technology/developers-tools/gemma-open-models/",
    wikiUrl: "https://en.wikipedia.org/wiki/Gemma_(language_model)",
    funFact:
      "К маю 2025 года модели Gemma скачали более 150 млн раз, а на Hugging Face накопилось около 70 тысяч их вариантов.",
  },
  {
    id: "mistral-ai-mistral-large",
    slug: "mistral-large",
    vendor: "Mistral AI",
    name: "Mistral Large",
    releaseDate: "2024-02-26",
    contextTokens: 32768,
    params: null,
    highlight:
      "Первая флагманская закрытая модель Mistral, конкурент GPT-4, с запуском ассистента Le Chat.",
    description:
      "Флагманская проприетарная модель Mistral AI с топовыми способностями к рассуждению, позиционировавшаяся как конкурент GPT-4 и Claude 2. Нативно владеет английским, французским, испанским, немецким и итальянским, сильна в коде и математике, поддерживает контекст 32k токенов. Одновременно с моделью Mistral запустила чат-ассистент Le Chat и объявила о партнёрстве с Microsoft для дистрибуции через Azure. Число параметров не раскрывалось.",
    capabilities: [
      "proprietary",
      "reasoning",
      "multilingual",
      "code",
      "math",
      "api",
    ],
    sourceUrl: "https://mistral.ai/news/mistral-large/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Mistral_AI",
    funFact:
      "На релизе Mistral назвала её второй по силе моделью мира, доступной через API, — сразу после GPT-4.",
  },
  {
    id: "anthropic-claude-3-opus",
    slug: "claude-3-opus",
    vendor: "Anthropic",
    name: "Claude 3 Opus",
    releaseDate: "2024-03-04",
    contextTokens: 200000,
    params: null,
    highlight:
      "Флагман семейства Claude 3 — обошёл конкурентов на MMLU, GPQA и GSM8K и добавил мультимодальность.",
    description:
      "4 марта 2024 года Anthropic анонсировала семейство Claude 3 из трёх моделей; Opus — самая мощная, лидировавшая на ключевых бенчмарках (MMLU, GPQA, GSM8K) и показавшая почти идеальный recall в тесте Needle In A Haystack. Все модели получили окно 200K токенов и зрение — умеют читать фото, графики и технические диаграммы. Задан размерный нейминг Opus/Sonnet/Haiku, который структурирует линейку Claude до сих пор.",
    capabilities: [
      "multimodal",
      "vision",
      "reasoning",
      "long-context",
      "coding",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-3-family",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "В тесте Needle In A Haystack Opus иногда замечал, что «иголка» выглядит вставленной искусственно, — и говорил об этом проверяющим.",
  },
  {
    id: "anthropic-claude-3-sonnet",
    slug: "claude-3-sonnet",
    vendor: "Anthropic",
    name: "Claude 3 Sonnet",
    releaseDate: "2024-03-04",
    contextTokens: 200000,
    params: null,
    highlight:
      "Сбалансированная модель Claude 3 — вдвое быстрее Claude 2 при более высоком интеллекте.",
    description:
      "Средняя модель семейства Claude 3, представленная 4 марта 2024 года вместе с Opus и Haiku. Sonnet оптимизирована под баланс скорости, стоимости и качества: примерно вдвое быстрее Claude 2/2.1 при более высоком интеллекте, хорош для поиска знаний и автоматизации. Как и вся линейка, получила окно 200K токенов и мультимодальное зрение; доступна в claude.ai, API, Amazon Bedrock и Google Vertex AI.",
    capabilities: ["multimodal", "vision", "chat", "long-context", "coding"],
    sourceUrl: "https://www.anthropic.com/news/claude-3-family",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Sonnet работала вдвое быстрее Claude 2 при более высоком интеллекте — и стала бесплатным тиром claude.ai.",
  },
  {
    id: "anthropic-claude-3-haiku",
    slug: "claude-3-haiku",
    vendor: "Anthropic",
    name: "Claude 3 Haiku",
    releaseDate: "2024-03-04",
    contextTokens: 200000,
    params: null,
    highlight:
      "Самая быстрая и дешёвая модель Claude 3 — читает плотную arXiv-статью за пару секунд.",
    description:
      "Самая компактная и быстрая модель семейства Claude 3, анонсированная 4 марта 2024 года. Haiku позиционировалась как самая экономичная модель на рынке в своём классе интеллекта: может прочитать насыщенную данными научную статью на ~10K токенов с графиками менее чем за три секунды. Разделяет с семейством окно 200K токенов и мультимодальные способности.",
    capabilities: ["multimodal", "vision", "fast", "low-cost", "long-context"],
    sourceUrl: "https://www.anthropic.com/news/claude-3-family",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Haiku прочитывает плотную научную статью с arXiv (~10 тыс. токенов) вместе с графиками менее чем за три секунды.",
  },
  {
    id: "others-command-r",
    slug: "command-r",
    vendor: "Cohere",
    name: "Command R",
    releaseDate: "2024-03-11",
    contextTokens: 128000,
    params: "35B",
    highlight:
      "Enterprise-модель Cohere, заточенная под RAG и использование инструментов.",
    description:
      "Command R представлена Cohere 11 марта 2024 года — генеративная модель на 35B параметров с контекстом 128K токенов, оптимизированная под retrieval-augmented generation (RAG), вызов внешних API и инструментов. Она нацелена на масштабные продакшн-нагрузки: высокая точность RAG с цитированием, низкая задержка, сильная поддержка 10 ключевых языков и низкая цена. Веса выложены на Hugging Face для исследований; вскоре вышла старшая версия Command R+.",
    capabilities: [
      "RAG",
      "tool-use",
      "long-context",
      "multilingual",
      "enterprise",
    ],
    sourceUrl: "https://docs.cohere.com/docs/command-r",
    wikiUrl: "https://ru.wikipedia.org/wiki/Cohere",
    funFact:
      "Command R отвечает с цитированием источников прямо в RAG-ответе — фишка, ради которой её выбирали корпорации.",
  },
  {
    id: "others-grok-1",
    slug: "grok-1",
    vendor: "xAI",
    name: "Grok-1",
    releaseDate: "2024-03-17",
    contextTokens: 8192,
    params: "314B (MoE)",
    highlight:
      "Крупнейшая на момент выхода открытая модель — 314B параметров MoE под Apache 2.0.",
    description:
      "Grok-1 — базовая модель xAI, анонсированная в ноябре 2023 года и выпущенная как открытые веса 17 марта 2024 года под лицензией Apache 2.0. Это разреженная Mixture-of-Experts архитектура на 314 млрд параметров (около 25% весов активны на токен) — крупнейшая открытая модель на тот момент. Опубликован сырой чекпойнт после претрейна, без файнтюна под диалог; веса и код выложены на GitHub и Hugging Face.",
    capabilities: ["open-weights", "MoE", "base-model", "reasoning"],
    sourceUrl: "https://x.ai/news/grok-os",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "Веса Grok-1 — MoE на 314 млрд параметров — xAI раздала обычной magnet-ссылкой через торрент.",
  },
  {
    id: "meta-llama-3",
    slug: "llama-3",
    vendor: "Meta",
    name: "Llama 3",
    releaseDate: "2024-04-18",
    contextTokens: 8192,
    params: "8B / 70B",
    highlight: "Новый уровень качества открытых моделей масштаба 8B и 70B.",
    description:
      "Третье поколение Llama вышло 18 апреля 2024 года в размерах 8B и 70B (базовые и instruct-версии) и задало новый state-of-the-art для открытых моделей этих масштабов. Обучена на более чем 15 трлн токенов — в семь раз больше, чем Llama 2, с вчетверо большим объёмом кода, использует токенизатор со словарём 128K и grouped-query attention. Контекст расширен до 8192 токенов; эта версия легла в основу ассистента Meta AI.",
    capabilities: ["open-weights", "instruct", "GQA", "code", "text"],
    sourceUrl: "https://ai.meta.com/blog/meta-llama-3/",
    wikiUrl: "https://ru.wikipedia.org/wiki/LLaMA",
    funFact:
      "Llama 3 предобучена более чем на 15 трлн токенов — датасет в семь раз больше, чем у Llama 2.",
  },
  {
    id: "others-phi-3",
    slug: "phi-3",
    vendor: "Microsoft",
    name: "Phi-3 (mini)",
    releaseDate: "2024-04-23",
    contextTokens: 128000,
    params: "3.8B",
    highlight:
      "SLM на 3.8B уровня GPT-3.5, помещающийся на телефон, с контекстом до 128K.",
    description:
      "Phi-3-mini — открытая малая модель Microsoft на 3,8 млрд параметров, выпущенная 23 апреля 2024 года на Azure AI Studio, Hugging Face и Ollama в вариантах контекста 4K и 128K токенов. Обученная на 3,3 трлн токенов отфильтрованных веб- и синтетических данных, она сопоставима с Mixtral 8x7B и GPT-3.5 (69% MMLU, 8.38 MT-bench), при этом достаточно компактна для запуска на телефоне. Позже семейство пополнили Phi-3-small (7B), Phi-3-medium (14B) и мультимодальная Phi-3-vision.",
    capabilities: [
      "small-model",
      "open-weights",
      "on-device",
      "long-context",
      "reasoning",
    ],
    sourceUrl:
      "https://azure.microsoft.com/en-us/blog/introducing-phi-3-redefining-whats-possible-with-slms/",
    wikiUrl: "https://en.wikipedia.org/wiki/Phi_(language_model)",
    funFact:
      "Phi-3-mini при 3,8 млрд параметров запускается локально даже на смартфоне — и держит уровень GPT-3.5 на MMLU.",
  },
  {
    id: "deepseek-deepseek-v2",
    slug: "deepseek-v2",
    vendor: "DeepSeek",
    name: "DeepSeek-V2",
    releaseDate: "2024-05-07",
    contextTokens: 128000,
    params: "236B (21B активных, MoE)",
    highlight:
      "Открытая MoE-модель, представившая Multi-head Latent Attention и резко удешевившая инференс.",
    description:
      "DeepSeek-V2 — открытая Mixture-of-Experts модель на 236 млрд параметров, из которых на токен активируется лишь 21 млрд. Она ввела архитектуру Multi-head Latent Attention (MLA), сжимающую KV-кэш на 93,3%, и DeepSeekMoE для экономичного обучения — на 42,5% дешевле, чем DeepSeek 67B. Модель обучена на 8,1 трлн токенов и поддерживает контекст до 128K благодаря YaRN. Именно V2 задала фирменную для DeepSeek связку эффективности и низкой цены.",
    capabilities: [
      "open-weights",
      "MoE",
      "MLA",
      "long-context",
      "code",
      "reasoning",
    ],
    sourceUrl: "https://arxiv.org/abs/2405.04434",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Цены DeepSeek-V2 запустили в Китае ценовую войну LLM-API: конкурентам пришлось резко удешевлять свои модели.",
  },
  {
    id: "openai-gpt-4o",
    slug: "gpt-4o",
    vendor: "OpenAI",
    name: "GPT-4o",
    releaseDate: "2024-05-13",
    contextTokens: 128000,
    params: null,
    highlight:
      "«Omni»-модель: единая сеть для текста, аудио и изображений с почти живой скоростью речи.",
    description:
      "GPT-4o («o» — omni) представлена 13 мая 2024 года как единая end-to-end модель, обученная сразу на тексте, аудио и изображениях, а не как связка отдельных моделей. Она отвечает на аудио за ~320 мс (сопоставимо со временем реакции человека в разговоре), держит уровень GPT-4 Turbo по тексту и коду, но вдвое дешевле в API и заметно сильнее в мультиязычных, аудио- и визуальных задачах. Впервые лучшая модель OpenAI стала доступна и бесплатным пользователям.",
    capabilities: ["multimodal", "audio", "vision", "realtime", "faster"],
    sourceUrl: "https://openai.com/index/hello-gpt-4o/",
    wikiUrl: "https://en.wikipedia.org/wiki/GPT-4o",
    funFact:
      "GPT-4o отвечает на голос в среднем за 320 мс (минимум 232 мс) — сравнимо со скоростью реакции человека в разговоре.",
  },
  {
    id: "others-qwen2",
    slug: "qwen2",
    vendor: "Alibaba",
    name: "Qwen2",
    releaseDate: "2024-06-07",
    contextTokens: 128000,
    params: "0.5B–72B",
    highlight:
      "Второе поколение Qwen: до 72B, контекст 128K и обгон Llama 3 70B на бенчмарках.",
    description:
      "Серия Qwen2 выпущена Alibaba Cloud 7 июня 2024 года: пять размеров от 0.5B до 72B плюс MoE-модель Qwen2-57B-A14B, обученные на 7 трлн токенов и 27+ языках. Флагман Qwen2-72B-Instruct поддерживает контекст до 128K токенов (через YARN) и превзошёл Llama 3 70B и Mixtral 8x22B на MMLU, MMLU-Pro, HumanEval и GSM8K. Все модели используют Grouped Query Attention для ускорения инференса; часть весов открыта.",
    capabilities: [
      "open-weights",
      "multilingual",
      "MoE",
      "long-context",
      "code",
      "math",
    ],
    sourceUrl: "https://qwenlm.github.io/blog/qwen2/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Qwen2 обучена на данных 27 языков помимо английского и китайского — ставка на глобальную мультиязычность.",
  },
  {
    id: "anthropic-claude-3-5-sonnet",
    slug: "claude-3-5-sonnet",
    vendor: "Anthropic",
    name: "Claude 3.5 Sonnet",
    releaseDate: "2024-06-21",
    contextTokens: 200000,
    params: null,
    highlight:
      "Обошла Claude 3 Opus по интеллекту при цене и скорости среднего уровня — и принесла Artifacts.",
    description:
      "21 июня 2024 года Anthropic выпустила Claude 3.5 Sonnet — первую модель поколения 3.5, превзошедшую даже Claude 3 Opus на бенчмарках рассуждений (GPQA, MMLU) и кода (HumanEval) при вдвое большей скорости. В агентном тесте кода решила 64% задач против 38% у Opus. Одновременно представлена функция Artifacts — динамическое рабочее окно для кода и документов. Окно 200K токенов, цена $3/$15 за млн токенов.",
    capabilities: [
      "multimodal",
      "vision",
      "reasoning",
      "coding",
      "artifacts",
      "long-context",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-3-5-sonnet",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Средняя модель 3.5 Sonnet обошла флагманскую Claude 3 Opus — впервые «середняк» нового поколения побил топ предыдущего.",
  },
  {
    id: "meta-llama-3-1-405b",
    slug: "llama-3-1-405b",
    vendor: "Meta",
    name: "Llama 3.1 405B",
    releaseDate: "2024-07-23",
    contextTokens: 128000,
    params: "405B",
    highlight:
      "Первая открытая frontier-модель, соперничающая с GPT-4o и Claude 3.5 Sonnet.",
    description:
      "Выпущенная 23 июля 2024 года Llama 3.1 405B стала крупнейшей и первой по-настоящему frontier-моделью Meta с открытыми весами, сравнимой с закрытыми GPT-4o и Claude 3.5 Sonnet по знаниям, математике, использованию инструментов и мультиязычности. Все модели релиза (8B, 70B и 405B) получили контекст 128K токенов и поддержку восьми языков. Обучение на 15+ трлн токенов шло на более чем 16 тыс. GPU H100; открытые веса позволили сообществу генерировать синтетические данные и дистиллировать модель.",
    capabilities: [
      "open-weights",
      "frontier",
      "long-context",
      "multilingual",
      "tool-use",
      "instruct",
    ],
    sourceUrl: "https://ai.meta.com/blog/meta-llama-3-1/",
    wikiUrl: "https://ru.wikipedia.org/wiki/LLaMA",
    funFact:
      "405B — первая Llama, обученная более чем на 16 тысячах GPU H100; Meta назвала её первой открытой моделью фронтир-уровня.",
  },
  {
    id: "others-grok-2",
    slug: "grok-2",
    vendor: "xAI",
    name: "Grok-2",
    releaseDate: "2024-08-14",
    contextTokens: 128000,
    params: null,
    highlight:
      "Фронтир-модель xAI с чатом, кодом, рассуждениями и генерацией изображений.",
    description:
      "Grok-2 и облегчённый Grok-2 mini выпущены в бете 14 августа 2024 года как значительный шаг вперёд относительно Grok-1.5. Модель достигла конкурентного с фронтир-моделями уровня в GPQA, MMLU, MMLU-Pro и MATH, а также показала сильные результаты в vision-задачах (MathVista, DocVQA). Ранняя версия под именем «sus-column-r» тестировалась на LMSYS-лидерборде, обходя Claude 3.5 Sonnet и GPT-4-Turbo. Добавлена генерация изображений через Flux от Black Forest Labs.",
    capabilities: [
      "reasoning",
      "code",
      "multimodal",
      "vision",
      "image-generation",
    ],
    sourceUrl: "https://x.ai/news/grok-2",
    wikiUrl: "https://ru.wikipedia.org/wiki/Grok",
    funFact:
      "Год спустя xAI открыла веса Grok-2: чекпойнт занимает около 500 ГБ в 42 файлах.",
  },
  {
    id: "openai-o1",
    slug: "o1",
    vendor: "OpenAI",
    name: "o1",
    releaseDate: "2024-09-12",
    contextTokens: 200000,
    params: null,
    highlight:
      "Первая reasoning-модель: «думает» перед ответом, масштабируя вычисления на инференсе.",
    description:
      "o1 — первая reasoning-модель OpenAI, обученная тратить больше времени на размышление перед ответом за счёт скрытой цепочки рассуждений. Preview-версия вышла 12 сентября 2024 года, полная o1 — 5 декабря 2024 года в рамках «12 Days of OpenAI». Она резко превзошла GPT-4o в математике, науке и программировании (например, 83% на отборочном тесте IMO против 13% у GPT-4o) и ввела третью ось масштабирования — вычисления во время инференса.",
    capabilities: [
      "reasoning",
      "chain-of-thought",
      "inference-scaling",
      "STEM",
    ],
    sourceUrl: "https://openai.com/index/introducing-openai-o1-preview/",
    wikiUrl: "https://ru.wikipedia.org/wiki/OpenAI_o1",
    funFact:
      "Благодаря «цепочке рассуждений» перед ответом o1 вошла в 89-й перцентиль участников соревнований Codeforces.",
  },
  {
    id: "alibaba-qwen2-5",
    slug: "qwen2-5",
    vendor: "Alibaba",
    name: "Qwen2.5",
    releaseDate: "2024-09-19",
    contextTokens: 131072,
    params: "0.5B–72B",
    highlight:
      "Открытое семейство 0.5B–72B на 18 трлн токенов — флагман достал Llama-3-405B.",
    description:
      "Alibaba выпустила семейство Qwen2.5: семь открытых моделей от 0,5 до 72 млрд параметров, обученных на 18 трлн токенов, плюс специализированные Qwen2.5-Coder и Qwen2.5-Math. Флагман Qwen2.5-72B на ряде бенчмарков достигал уровня Llama-3-405B — модели в разы крупнее. Семейство поддерживает контекст до 128K токенов и генерацию до 8K и стало одной из главных открытых линеек 2024 года.",
    capabilities: [
      "open-weights",
      "multilingual",
      "coding",
      "math",
      "long-context",
    ],
    sourceUrl: "https://qwenlm.github.io/blog/qwen2.5/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Qwen2.5-Coder дополнительно обучали на 5,5 трлн токенов кода — отдельный «кодовый» претрейн размером с датасеты целых моделей.",
  },
  {
    id: "alibaba-qwq-32b-preview",
    slug: "qwq-32b-preview",
    vendor: "Alibaba",
    name: "QwQ-32B-Preview",
    releaseDate: "2024-11-28",
    contextTokens: 32768,
    params: "32.5B",
    highlight:
      "Первая reasoning-модель с открытыми весами — за два месяца до DeepSeek-R1.",
    description:
      "Команда Qwen выпустила QwQ-32B-Preview — экспериментальную модель, «сфокусированную на развитии способностей ИИ к рассуждению», первую reasoning-модель класса o1 с открытыми весами. При 32,5 млрд параметров она набрала 65,2% на GPQA и 90,6% на MATH-500. Авторы честно перечислили ограничения превью — смешение языков и зацикливание рассуждений; спустя два месяца эпоху открытого reasoning закрепила DeepSeek-R1.",
    capabilities: [
      "reasoning",
      "chain-of-thought",
      "open-weights",
      "math",
      "experimental",
    ],
    sourceUrl: "https://qwenlm.github.io/blog/qwq-32b-preview/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "Анонс QwQ написан в философском тоне: модель сравнивают с «вечным студентом мудрости», который сомневается в собственных допущениях.",
  },
  {
    id: "google-gemini-2-0",
    slug: "gemini-2-0",
    vendor: "Google",
    name: "Gemini 2.0",
    releaseDate: "2024-12-11",
    contextTokens: 1000000,
    params: null,
    highlight:
      "Модель «агентной эры» с нативной генерацией изображений и аудио.",
    description:
      "Gemini 2.0 анонсирована Google 11 декабря 2024 года как модель, построенная для «агентной эры». Первой вышла экспериментальная версия Gemini 2.0 Flash, которая превзошла 1.5 Pro на ключевых бенчмарках при вдвое большей скорости. Помимо мультимодального ввода (изображения, видео, аудио), модель получила нативный мультимодальный вывод — генерацию изображений вперемешку с текстом и управляемый многоязычный TTS. Вместе с моделью Google показала агентные прототипы Project Astra, Project Mariner и Jules. Число параметров не раскрывалось.",
    capabilities: [
      "multimodal",
      "agentic",
      "image-generation",
      "long-context",
      "TTS",
    ],
    sourceUrl:
      "https://blog.google/innovation-and-ai/models-and-research/google-deepmind/google-gemini-ai-update-december-2024/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "Вместе с Gemini 2.0 Google показала агентов Project Astra, Project Mariner и Jules — ставку на «агентную эру» целиком.",
  },
  {
    id: "openai-o3",
    slug: "o3",
    vendor: "OpenAI",
    name: "o3",
    releaseDate: "2024-12-20",
    contextTokens: 200000,
    params: null,
    highlight:
      "Прорыв в рассуждениях: рекорд на ARC-AGI и регулируемый бюджет «размышления».",
    description:
      "o3 анонсирована 20 декабря 2024 года в финале «12 Days of OpenAI» как преемник o1 (название o2 пропустили из-за конфликта с торговой маркой телеком-оператора O2). Модель добавила регулируемое время рассуждения (low/medium/high) и поставила рекорды на жёстких бенчмарках: 96.7% на AIME 2024, 87.7% на GPQA Diamond, 25.2% на Frontier Math и прорывные 87.5% на ARC-AGI (high-compute). На анонсе модель ушла внешним исследователям на проверку безопасности; публичный релиз o3-mini состоялся 31 января 2025 года, а полной o3 — 16 апреля 2025 года.",
    capabilities: ["reasoning", "adjustable-compute", "ARC-AGI", "frontier"],
    sourceUrl: "https://openai.com/index/introducing-o3-and-o4-mini/",
    wikiUrl: "https://ru.wikipedia.org/wiki/OpenAI_o3",
    funFact:
      "Имя o2 пропустили из-за торговой марки телеком-оператора O2 — после o1 сразу вышла o3.",
  },
  {
    id: "deepseek-deepseek-v3",
    slug: "deepseek-v3",
    vendor: "DeepSeek",
    name: "DeepSeek-V3",
    releaseDate: "2024-12-26",
    contextTokens: 128000,
    params: "671B (37B активных, MoE)",
    highlight:
      "Открытая MoE на 671B, обученная всего за ~5,6 млн долларов и вставшая на уровень GPT-4o.",
    description:
      "DeepSeek-V3 — открытая Mixture-of-Experts модель на 671 млрд параметров (37 млрд активных на токен), обученная на 14,8 трлн токенов. При обучении на 2048 GPU H800 её стоимость оценивают примерно в 5,6 млн долларов — на порядок дешевле сопоставимых западных моделей. По бенчмаркам V3 достигла паритета с GPT-4o и Claude 3.5 Sonnet, обгоняя Llama 3.1 и Qwen 2.5, и стала базой для последующей R1.",
    capabilities: ["open-weights", "MoE", "MLA", "MTP", "long-context", "code"],
    sourceUrl: "https://api-docs.deepseek.com/news/news1226",
    wikiUrl: "https://ru.wikipedia.org/wiki/DeepSeek",
    funFact:
      "Обучение DeepSeek-V3 обошлось примерно в $5,6 млн — на порядок дешевле сопоставимых западных frontier-моделей.",
  },
];
