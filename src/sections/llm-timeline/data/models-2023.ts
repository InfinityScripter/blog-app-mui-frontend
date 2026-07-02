import type { LlmModel } from "../types";

// ----------------------------------------------------------------------
// Landmark LLMs of 2023 — the vendor race year. «NEVER invented»: unknown
// numerics are `null`. Source links verified to point at the model's own
// announcement, wiki links at the model/family article (ru preferred).

export const LLM_MODELS_2023: LlmModel[] = [
  {
    id: "meta-llama-1",
    slug: "llama-1",
    vendor: "Meta",
    name: "LLaMA",
    releaseDate: "2023-02-24",
    contextTokens: 2048,
    params: "7B / 13B / 33B / 65B",
    highlight:
      "Открытые веса, с которых начался бум локальных LLM: 13B обошла GPT-3 175B.",
    description:
      "Первое поколение больших языковых моделей Meta, выпущенное для исследователей 24 февраля 2023 года в размерах 7B, 13B, 33B и 65B параметров с контекстом 2048 токенов. Модели обучались только на публичных данных (до 1,4 трлн токенов), и меньшие версии соперничали с гораздо более крупными конкурентами — LLaMA-13B превзошла GPT-3 175B на большинстве бенчмарков. Хотя веса выдавались по заявкам и только для research, их утечка запустила волну открытых LLM и дообучений (Alpaca, Vicuna и другие).",
    capabilities: ["open-weights", "research-only", "text", "foundational"],
    sourceUrl: "https://ai.meta.com/blog/large-language-model-llama-meta-ai/",
    wikiUrl: "https://ru.wikipedia.org/wiki/LLaMA",
    funFact:
      "Веса LLaMA утекли в открытый доступ через торрент на 4chan уже через неделю после анонса.",
  },
  {
    id: "openai-gpt-4",
    slug: "gpt-4",
    vendor: "OpenAI",
    name: "GPT-4",
    releaseDate: "2023-03-14",
    contextTokens: 8192,
    params: null,
    highlight:
      "Первая мультимодальная GPT: принимает изображения и проходит экзамены на уровне человека.",
    description:
      "GPT-4 представлена 14 марта 2023 года как большая мультимодальная модель, принимающая на вход текст и изображения и выдающая текст. Она демонстрирует человеческий уровень на профессиональных и академических тестах — например, сдаёт имитацию адвокатского экзамена в топ-10% участников. Число параметров OpenAI не раскрыла; базовая версия давала 8192 токена контекста, вариант gpt-4-32k — 32 768 токенов.",
    capabilities: ["multimodal", "vision", "reasoning", "system-prompt"],
    sourceUrl: "https://openai.com/index/gpt-4-research/",
    wikiUrl: "https://ru.wikipedia.org/wiki/GPT-4",
    funFact:
      "В техническом отчёте GPT-4 OpenAI впервые сознательно не раскрыла ни размер модели, ни архитектуру, сославшись на конкуренцию и безопасность.",
  },
  {
    id: "anthropic-claude-1",
    slug: "claude-1",
    vendor: "Anthropic",
    name: "Claude 1",
    releaseDate: "2023-03-14",
    contextTokens: 9000,
    params: null,
    highlight:
      "Первая публичная модель Anthropic — ассистент, обученный по методу Constitutional AI быть полезным, честным и безвредным.",
    description:
      "14 марта 2023 года Anthropic представила Claude вместе с более лёгкой версией Claude Instant, открыв доступ через чат и API. Модель обучалась по фирменному подходу Constitutional AI и позиционировалась как более безопасная и управляемая альтернатива ChatGPT. Ранними партнёрами стали Notion, Quora (Poe) и DuckDuckGo. Стартовое контекстное окно составляло около 9K токенов.",
    capabilities: [
      "text",
      "chat",
      "coding",
      "summarization",
      "constitutional-ai",
    ],
    sourceUrl: "https://www.anthropic.com/news/introducing-claude",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "Ещё до публичного анонса Claude уже работал внутри Notion, поисковика DuckDuckGo и бота Poe от Quora.",
  },
  {
    id: "sber-gigachat",
    slug: "gigachat",
    vendor: "Sber",
    name: "GigaChat",
    releaseDate: "2023-04-24",
    contextTokens: null,
    params: "13B (ruGPT-3.5 в ансамбле NeONKA)",
    highlight:
      "Главный российский конкурент ChatGPT и YandexGPT — мультимодальный сервис Сбера.",
    description:
      "Сбер открыл закрытое бета-тестирование GigaChat — российского конкурента ChatGPT с поддержкой диалога, генерации кода и изображений. В основе сервиса ансамбль моделей NeONKA, включающий ruGPT-3.5 с 13 млрд параметров и Kandinsky 2.1 для картинок. Разработку вели SberDevices и Sber AI при поддержке института AIRI, обучение шло на суперкомпьютере Christofari Neo.",
    capabilities: [
      "russian",
      "dialogue",
      "multimodal",
      "code",
      "image-generation",
    ],
    sourceUrl:
      "https://sberdevices.ru/press/detail/gigachat_vs_chatgpt_sber_otkryvaet_dostup_k_svoei_noveisei_neirosetevoi_modeli/",
    wikiUrl: "https://ru.wikipedia.org/wiki/ГигаЧат",
    funFact:
      "Доступ к GigaChat на старте выдавали только по инвайтам в Telegram, а Герман Греф противопоставил его открытость «курсу Closed AI».",
  },
  {
    id: "others-yandexgpt",
    slug: "yandexgpt",
    vendor: "Yandex",
    name: "YandexGPT",
    releaseDate: "2023-05-17",
    contextTokens: null,
    params: null,
    highlight:
      "Первая генеративная LLM Яндекса, встроенная в голосового ассистента Алису.",
    description:
      "YandexGPT (изначально анонсирован как YaLM 2.0 в феврале 2023) официально представлен 17 мая 2023 года. Модель умеет генерировать и обрабатывать текст, выполнять задачи и учитывать контекст диалога; сразу после запуска она была подключена к виртуальному ассистенту Алисе. Параметры и размер контекста официально не раскрывались. В сентябре 2023 вышла улучшенная YandexGPT 2.",
    capabilities: ["russian", "assistant", "text-generation", "closed-weights"],
    sourceUrl: "https://yandex.com/company/news/17-05-23",
    wikiUrl: "https://ru.wikipedia.org/wiki/YandexGPT",
    funFact:
      "Яндекс заявил, что первым в мире встроил большую языковую модель нового поколения в массового голосового ассистента — Алису.",
  },
  {
    id: "tii-falcon-40b",
    slug: "falcon-40b",
    vendor: "TII",
    name: "Falcon 40B",
    releaseDate: "2023-05-25",
    contextTokens: 2048,
    params: "40B",
    highlight:
      "Открытая модель из ОАЭ под Apache 2.0, возглавившая Open LLM Leaderboard.",
    description:
      "Институт технологических инноваций (TII) из Абу-Даби открыл Falcon 40B — decoder-only модель, обученную на 1 трлн токенов веб-датасета RefinedWeb. Благодаря multiquery attention и FlashAttention модель быстро возглавила Open LLM Leaderboard Hugging Face и распространялась под Apache 2.0 с правом коммерческого использования. В сентябре 2023 года семейство пополнил Falcon 180B, обученный уже на 3,5 трлн токенов.",
    capabilities: [
      "open-weights",
      "apache-2.0",
      "refinedweb",
      "multiquery-attention",
    ],
    sourceUrl: "https://falconllm.tii.ae/falcon-40b.html",
    wikiUrl: null,
    funFact:
      "Уже через неделю после релиза Falcon 40B возглавил Open LLM Leaderboard Hugging Face; обучали модель на 384 GPU A100.",
  },
  {
    id: "anthropic-claude-2",
    slug: "claude-2",
    vendor: "Anthropic",
    name: "Claude 2",
    releaseDate: "2023-07-11",
    contextTokens: 100000,
    params: null,
    highlight:
      "Прорыв по длине контекста: 100K токенов — можно загрузить сотни страниц или целую книгу в один запрос.",
    description:
      "11 июля 2023 года Anthropic выпустила Claude 2 в публичную бету с контекстным окном на 100K токенов, загрузкой файлов и заметно улучшенными навыками кода и математики (HumanEval 71.2%, GSM8k 88.0%). 100K-контекст сделал модель лидером по объёму входных данных на фоне 8K/32K у GPT-4 того времени. Появился отдельный сайт claude.ai для широкого доступа.",
    capabilities: [
      "text",
      "chat",
      "long-context",
      "coding",
      "math",
      "file-upload",
    ],
    sourceUrl: "https://www.anthropic.com/news/claude-2",
    wikiUrl: "https://ru.wikipedia.org/wiki/Claude",
    funFact:
      "В один промпт Claude 2 помещалась целая книга — 100 тысяч токенов на фоне 8K у базовой GPT-4 того времени.",
  },
  {
    id: "meta-llama-2",
    slug: "llama-2",
    vendor: "Meta",
    name: "Llama 2",
    releaseDate: "2023-07-18",
    contextTokens: 4096,
    params: "7B / 13B / 70B",
    highlight:
      "Первая открытая модель Meta, разрешённая для коммерческого использования.",
    description:
      "Второе поколение Llama, представленное 18 июля 2023 года совместно с Microsoft, стало первой моделью семейства, доступной бесплатно и для research, и для коммерческого применения. Выпущена в размерах 7B, 13B и 70B параметров с удвоенным контекстом 4096 токенов и обучена на 2 трлн токенов. Вместе с базовыми моделями вышла чат-версия Llama 2-Chat, дообученная через SFT и RLHF, что сделало Llama полноценной основой для продуктовых ассистентов с открытыми весами.",
    capabilities: [
      "open-weights",
      "commercial-license",
      "chat",
      "RLHF",
      "text",
    ],
    sourceUrl: "https://about.fb.com/news/2023/07/llama-2/",
    wikiUrl: "https://ru.wikipedia.org/wiki/LLaMA",
    funFact:
      "Llama 2 вышла бесплатной даже для коммерческого использования, а Microsoft стала «предпочтительным партнёром» Meta по её дистрибуции.",
  },
  {
    id: "others-qwen",
    slug: "qwen",
    vendor: "Alibaba",
    name: "Qwen (Qwen-7B)",
    releaseDate: "2023-08-03",
    contextTokens: 8192,
    params: "7B",
    highlight:
      "Дебют открытой линейки Alibaba — одна из первых китайских LLM с коммерчески доступными весами.",
    description:
      "Qwen-7B (Tongyi Qianwen) и Qwen-7B-Chat выпущены Alibaba Cloud 3 августа 2023 года на ModelScope и Hugging Face с техническим отчётом. Базовая модель на 7B параметров, обученная на более чем 2,2 трлн токенов веб-текстов, книг и кода, превзошла аналоги своего размера и даже часть 13B-моделей на MMLU, C-Eval, GSM8K и HumanEval. Это один из первых крупных китайских LLM с открытыми весами под разрешительной лицензией, задавший тон всей будущей линейке Qwen.",
    capabilities: ["open-weights", "multilingual", "code", "chat"],
    sourceUrl: "https://github.com/QwenLM/Qwen",
    wikiUrl: "https://ru.wikipedia.org/wiki/Qwen",
    funFact:
      "В июле 2024 года Qwen признали сильнейшей китайскоязычной моделью — третьей в мире после топ-моделей Anthropic и OpenAI.",
  },
  {
    id: "mistral-ai-mistral-7b",
    slug: "mistral-7b",
    vendor: "Mistral AI",
    name: "Mistral 7B",
    releaseDate: "2023-09-27",
    contextTokens: 8192,
    params: "7.3B",
    highlight:
      "Открытая 7B-модель, обошедшая Llama 2 13B и задавшая стандарт для компактных LLM.",
    description:
      "Первая модель парижской Mistral AI, выпущенная под лицензией Apache 2.0. При 7.3 млрд параметров она превосходила Llama 2 13B на всех бенчмарках и приближалась к Llama 1 34B. Использовала Grouped-Query Attention (GQA) для быстрого инференса и Sliding Window Attention (SWA) для работы с длинными последовательностями. Стала эталоном эффективности среди небольших открытых моделей.",
    capabilities: [
      "open-weights",
      "apache-2.0",
      "text",
      "code",
      "efficient",
      "GQA",
      "SWA",
    ],
    sourceUrl: "https://mistral.ai/news/announcing-mistral-7b/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Mistral_AI",
    funFact:
      "Mistral AI привлекла €105 млн ещё до выпуска первого продукта — через месяц после основания компании тремя выходцами из Meta и DeepMind.",
  },
  {
    id: "google-gemini-1-0",
    slug: "gemini-1-0",
    vendor: "Google",
    name: "Gemini 1.0",
    releaseDate: "2023-12-06",
    contextTokens: 32768,
    params: null,
    highlight:
      "Первая нативно мультимодальная модель Google в трёх размерах: Ultra, Pro, Nano.",
    description:
      "Gemini 1.0 анонсирована Сундаром Пичаи и Демисом Хассабисом 6 декабря 2023 года как самая мощная на тот момент модель Google. Она изначально спроектирована мультимодальной — понимает и комбинирует текст, код, аудио, изображения и видео — и выпущена в трёх размерах: Ultra для сложных задач, Pro для широкого спектра и Nano для устройств. Gemini Ultra стала первой моделью, превзошедшей экспертов-людей на бенчмарке MMLU с результатом 90.0%. Число параметров официально не раскрывалось.",
    capabilities: ["multimodal", "reasoning", "code", "on-device"],
    sourceUrl:
      "https://blog.google/innovation-and-ai/technology/ai/google-gemini-ai/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Gemini_(языковая_модель)",
    funFact:
      "Gemini Ultra первой превзошла экспертов-людей на бенчмарке MMLU, набрав 90,0%.",
  },
  {
    id: "mistral-ai-mixtral-8x7b",
    slug: "mixtral-8x7b",
    vendor: "Mistral AI",
    name: "Mixtral 8x7B",
    releaseDate: "2023-12-11",
    contextTokens: 32768,
    params: "46.7B total / 12.9B active",
    highlight:
      "Первая открытая sparse MoE-модель, обошедшая Llama 2 70B при в 6 раз более быстром инференсе.",
    description:
      "Первая открытая модель Mistral с архитектурой sparse mixture-of-experts (SMoE) под лицензией Apache 2.0. Из 8 экспертов на каждом слое активируются только два, поэтому при 46.7 млрд суммарных параметров модель работает со скоростью и стоимостью 12.9B-модели. Обходит Llama 2 70B на большинстве бенчмарков и соответствует или превосходит GPT-3.5, поддерживает контекст 32k токенов и пять языков.",
    capabilities: [
      "open-weights",
      "apache-2.0",
      "mixture-of-experts",
      "multilingual",
      "code",
      "32k-context",
    ],
    sourceUrl: "https://mistral.ai/news/mixtral-of-experts/",
    wikiUrl: "https://ru.wikipedia.org/wiki/Mistral_AI",
    funFact:
      "Mixtral 8x7B Mistral анонсировала в своём стиле — магнет-ссылкой на торрент в X, без пресс-релиза и демо.",
  },
  {
    id: "others-phi-2",
    slug: "phi-2",
    vendor: "Microsoft",
    name: "Phi-2",
    releaseDate: "2023-12-12",
    contextTokens: 2048,
    params: "2.7B",
    highlight:
      "Маленькая модель на 2.7B, обходящая модели в 25 раз крупнее на рассуждениях.",
    description:
      "Phi-2 — компактная модель Microsoft Research на 2,7 млрд параметров, выпущенная 12 декабря 2023 года в каталоге Azure AI Studio. Несмотря на размер, она превосходит Mistral и Llama-2 на 7B и 13B, а на задачах кодинга и математики обгоняет даже Llama-2-70B. Успех приписывают «учебному» качеству данных (синтетика + отфильтрованный веб) и передаче знаний от Phi-1.5. Обучена на 1,4 трлн токенов за 14 дней на 96 A100; это базовая модель без RLHF и instruct-тюнинга.",
    capabilities: ["small-model", "reasoning", "code", "math", "base-model"],
    sourceUrl:
      "https://www.microsoft.com/en-us/research/blog/phi-2-the-surprising-power-of-small-language-models/",
    wikiUrl: "https://en.wikipedia.org/wiki/Phi_(language_model)",
    funFact:
      "Линейка Phi выросла из статьи «Textbooks Are All You Need»: ставка на «учебниковое» качество данных вместо масштаба.",
  },
];
